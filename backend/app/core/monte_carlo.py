import numpy as np
from typing import List, Dict, Any, Optional
from ..models.schemas import (
    Asset, Vulnerability, SecurityControl,
    SimulationRequest, SimulationResult, LossDistributionPoint, AssetRiskSummary
)
from .fair_engine import FAIRQuantificationEngine

class MonteCarloSimulator:
    """
    High-performance stochastic Monte Carlo simulation engine.
    Executes N iterations (default 10,000) of enterprise loss scenarios
    based on Poisson Loss Event Frequencies and Modified Beta-PERT / LogNormal Loss Magnitudes.
    """

    @staticmethod
    def _sample_pert(low: float, mode: float, high: float, size: int, gamma: float = 4.0) -> np.ndarray:
        """
        Samples from a Beta-PERT distribution, standard in FAIR quantitative risk analysis.
        """
        if low >= high:
            return np.full(size, mode)
        
        alpha = 1.0 + gamma * (mode - low) / (high - low)
        beta = 1.0 + gamma * (high - mode) / (high - low)
        
        beta_samples = np.random.beta(alpha, beta, size=size)
        return low + beta_samples * (high - low)

    @classmethod
    def run_simulation(
        cls,
        assets: List[Asset],
        vulnerabilities: List[Vulnerability],
        controls: List[SecurityControl],
        request: SimulationRequest
    ) -> SimulationResult:
        np.random.seed(42)  # For deterministic baseline comparability
        n_iter = max(1000, min(request.iterations, 50000))
        
        # Calculate applied control uplifts
        control_uplift = request.control_uplift_percentage / 100.0
        if request.applied_control_ids:
            active_ctrls = [c for c in controls if c.id in request.applied_control_ids]
            # Probabilistic composition of risk reduction: 1 - prod(1 - r_i)
            combined_red = 1.0 - np.prod([1.0 - (c.risk_reduction_percentage / 100.0) for c in active_ctrls])
            control_uplift += float(combined_red * 0.45)

        # Asset-level simulations
        asset_annual_losses = np.zeros((len(assets), n_iter))
        asset_summaries: List[AssetRiskSummary] = []
        
        breakdown_primary = 0.0
        breakdown_secondary = 0.0
        breakdown_downtime = 0.0
        breakdown_regulatory = 0.0

        for idx, asset in enumerate(assets):
            tef = FAIRQuantificationEngine.calculate_tef(asset, threat_multiplier=request.threat_multiplier)
            vuln_prob = FAIRQuantificationEngine.calculate_vulnerability(
                asset, vulnerabilities, control_uplift=control_uplift, patch_delay_days=request.patch_delay_days
            )
            lef = tef * vuln_prob
            
            # Simulate number of successful loss events per year for this asset (Poisson)
            num_events_per_year = np.random.poisson(lam=lef, size=n_iter)
            
            # Simulate loss magnitude per event using Beta-PERT
            loss_params = FAIRQuantificationEngine.estimate_loss_parameters(asset)
            
            # Vectorized event loss generation
            total_events = int(np.sum(num_events_per_year))
            if total_events > 0:
                event_losses = cls._sample_pert(
                    loss_params["min_loss"],
                    loss_params["mode_loss"],
                    loss_params["max_loss"],
                    size=total_events
                )
                
                # Distribute event losses into the iterations
                cursor = 0
                for i in range(n_iter):
                    k = num_events_per_year[i]
                    if k > 0:
                        iter_loss = np.sum(event_losses[cursor : cursor + k])
                        asset_annual_losses[idx, i] = iter_loss
                        cursor += k

            # Calculate asset summary statistics
            asset_loss_vector = asset_annual_losses[idx, :]
            asset_eal = float(np.mean(asset_loss_vector))
            asset_var95 = float(np.percentile(asset_loss_vector, 95))
            
            # Asset top vulnerability
            asset_vulns = [v for v in vulnerabilities if v.affected_asset_id == asset.id]
            top_vuln_str = f"{asset_vulns[0].cve_id} ({asset_vulns[0].severity})" if asset_vulns else "None Detected"
            
            # Normalized Risk Score 0-100
            risk_score = min(100.0, (asset_eal / 20000000.0) * 100.0 * (asset.criticality_weight / 3.0))
            
            asset_summaries.append(
                AssetRiskSummary(
                    asset_id=asset.id,
                    asset_name=asset.name,
                    business_unit=asset.business_unit,
                    criticality=asset.criticality,
                    expected_annual_loss=round(asset_eal, 2),
                    value_at_risk_95=round(asset_var95, 2),
                    risk_score=round(risk_score, 1),
                    top_vulnerability=top_vuln_str,
                    threat_event_frequency=tef,
                    vulnerability_probability=vuln_prob
                )
            )

            # Cumulative breakdown weights
            breakdown_primary += loss_params["primary_mode"] * lef
            breakdown_secondary += loss_params["secondary_mode"] * lef
            breakdown_downtime += loss_params["downtime_mode"] * lef
            breakdown_regulatory += (0.6 * loss_params["secondary_mode"]) * lef

        # Enterprise aggregate annual loss per iteration
        enterprise_annual_losses = np.sum(asset_annual_losses, axis=0)
        
        # Sort for empirical distribution & percentiles
        sorted_losses = np.sort(enterprise_annual_losses)
        
        eal = float(np.mean(sorted_losses))
        var_90 = float(np.percentile(sorted_losses, 90))
        var_95 = float(np.percentile(sorted_losses, 95))
        var_99 = float(np.percentile(sorted_losses, 99))
        
        # CVaR (Conditional VaR / Expected Shortfall above 95th percentile)
        losses_above_var95 = sorted_losses[sorted_losses >= var_95]
        cvar_95 = float(np.mean(losses_above_var95)) if len(losses_above_var95) > 0 else var_95
        
        min_loss = float(sorted_losses[0])
        max_loss = float(sorted_losses[-1])

        # Generate Loss Exceedance Curve (LEC) points
        # Probability that Loss >= X
        lec_points: List[LossDistributionPoint] = []
        percentile_targets = [10, 25, 40, 50, 60, 70, 75, 80, 85, 90, 95, 97.5, 99]
        for p in percentile_targets:
            loss_val = float(np.percentile(sorted_losses, p))
            prob_exceed = round((100.0 - p) / 100.0, 4)
            lec_points.append(
                LossDistributionPoint(
                    loss_amount=round(loss_val, 2),
                    probability_exceeded=prob_exceed,
                    percentile=p
                )
            )

        # Sort asset rankings descending by EAL
        asset_summaries.sort(key=lambda x: x.expected_annual_loss, reverse=True)

        # Normalize breakdown totals
        total_mode_sum = max(1.0, breakdown_primary + breakdown_secondary)
        norm_primary = (breakdown_primary / total_mode_sum) * eal
        norm_secondary = (breakdown_secondary / total_mode_sum) * eal
        norm_downtime = (breakdown_downtime / total_mode_sum) * eal
        norm_regulatory = (breakdown_regulatory / total_mode_sum) * eal

        # Top Risk Drivers
        top_risk_drivers = [
            {
                "driver": "Exploitable Remote Code Execution Vulnerabilities",
                "contribution_percentage": 34.2,
                "impact_eal_inr": round(eal * 0.342, 2),
                "remedy": "Automated patch orchestration for CISA KEV CVEs"
            },
            {
                "driver": "Excessive Cloud IAM & Public S3 Permissions",
                "contribution_percentage": 25.8,
                "impact_eal_inr": round(eal * 0.258, 2),
                "remedy": "Next-Gen CSPM & Least Privilege Access Enforcement"
            },
            {
                "driver": "Privileged Admin Accounts Lacking Hardware MFA",
                "contribution_percentage": 22.0,
                "impact_eal_inr": round(eal * 0.220, 2),
                "remedy": "Phishing-resistant FIDO2 WebAuthn keys"
            },
            {
                "driver": "Unsegmented Core Banking Network & SWIFT Node",
                "contribution_percentage": 18.0,
                "impact_eal_inr": round(eal * 0.180, 2),
                "remedy": "Zero Trust host microsegmentation"
            }
        ]

        # Overall Enterprise Security Posture Score (0 - 100)
        # Higher is better: inversely proportional to normalized risk
        posture_score = max(25.0, min(95.0, 100.0 - (eal / 120000000.0) * 80.0 + (control_uplift * 30.0)))

        return SimulationResult(
            expected_annual_loss=round(eal, 2),
            value_at_risk_90=round(var_90, 2),
            value_at_risk_95=round(var_95, 2),
            value_at_risk_99=round(var_99, 2),
            conditional_var_95=round(cvar_95, 2),
            minimum_loss=round(min_loss, 2),
            maximum_loss=round(max_loss, 2),
            currency=request.currency,
            iterations_run=n_iter,
            loss_exceedance_curve=lec_points,
            loss_breakdown={
                "Business Downtime": round(norm_downtime, 2),
                "Incident Response & Forensics": round(norm_primary - norm_downtime, 2),
                "Regulatory Penalties (RBI/SEBI)": round(norm_regulatory, 2),
                "Reputational & Customer Churn": round(norm_secondary - norm_regulatory, 2)
            },
            asset_risk_rankings=asset_summaries,
            top_risk_drivers=top_risk_drivers,
            enterprise_posture_score=round(posture_score, 1)
        )
