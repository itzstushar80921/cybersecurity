import math
import numpy as np
from typing import Dict, Any, List
from ..models.schemas import Asset, Vulnerability

class FAIRQuantificationEngine:
    """
    OpenFAIR (Factor Analysis of Information Risk) calculation engine.
    Computes:
      - TEF (Threat Event Frequency)
      - VUL (Vulnerability / Susceptibility)
      - LEF (Loss Event Frequency)
      - LM (Loss Magnitude: Primary + Secondary)
    """

    @staticmethod
    def calculate_tef(asset: Asset, threat_multiplier: float = 1.0) -> float:
        """
        Calculates Threat Event Frequency (events/year).
        Based on exposure (public vs internal), asset criticality, and external threat multiplier.
        """
        base_tef = 4.0  # Base attempts per year for an enterprise asset
        
        # Internet-facing assets experience significantly higher probe/attack frequency
        is_public = any(keyword in asset.ip_or_endpoint.lower() for keyword in ["api.", "netbanking", "trade.", "people.", "support."])
        if is_public:
            base_tef *= 3.5
            
        # Criticality tier multiplier
        if "Tier 1" in asset.criticality:
            base_tef *= 1.8
        elif "Tier 2" in asset.criticality:
            base_tef *= 1.2
            
        return max(0.5, round(base_tef * threat_multiplier, 2))

    @staticmethod
    def calculate_vulnerability(
        asset: Asset,
        vulnerabilities: List[Vulnerability],
        control_uplift: float = 0.0,
        patch_delay_days: int = 0
    ) -> float:
        """
        Calculates probability (0.0 to 1.0) that a threat event succeeds.
        VUL = f(CVSS, EPSS, Exploit Maturity, Defense Controls, Patch Aging).
        """
        asset_vulns = [v for v in vulnerabilities if v.affected_asset_id == asset.id]
        
        if not asset_vulns:
            # Baseline susceptibility without known CVEs
            base_vuln = 0.08
        else:
            # Aggregate severity using probabilistic union: 1 - prod(1 - p_i)
            # p_i combines CVSS normalized and EPSS
            individual_probs = []
            for v in asset_vulns:
                # EPSS is empirical exploit probability in the wild (0 to 1)
                # CVSS normalized (0 to 1)
                cvss_norm = v.cvss_score / 10.0
                epss = v.epss_score
                
                # Weight EPSS heavily if exploit is in CISA KEV or in the wild
                prob = 0.4 * cvss_norm + 0.6 * epss
                if v.in_cisa_kev:
                    prob = min(0.95, prob * 1.35)
                elif v.exploit_available:
                    prob = min(0.90, prob * 1.2)
                individual_probs.append(prob)
                
            # Probabilistic union of vulnerabilities
            combined_prob = 1.0 - math.prod(1.0 - p for p in individual_probs)
            base_vuln = min(0.92, max(0.12, combined_prob))

        # Aging penalty: delayed remediation increases vulnerability window
        if patch_delay_days > 0:
            aging_factor = 1.0 + min(0.60, (patch_delay_days / 30.0) * 0.18)
            base_vuln = min(0.98, base_vuln * aging_factor)

        # Control effectiveness mitigates vulnerability
        effective_controls = min(0.95, asset.control_coverage_score + control_uplift)
        final_vuln = base_vuln * (1.0 - (0.75 * effective_controls))
        
        return max(0.02, min(0.95, round(final_vuln, 4)))

    @staticmethod
    def estimate_loss_parameters(asset: Asset) -> Dict[str, float]:
        """
        Computes Loss Magnitude parameters (min, mode, max in INR) for Beta-PERT / LogNormal distribution.
        Decomposes into:
          - Primary Loss: Downtime business loss + IR triage + Asset recovery
          - Secondary Loss: Regulatory penalties (RBI/SEBI/DPDP) + Reputational churn + Customer notification
        """
        # Downtime loss estimation (typically 4 to 48 hours for an enterprise incident)
        min_downtime_hours = 2.0 if "Tier 1" in asset.criticality else 1.0
        mode_downtime_hours = 8.0 if "Tier 1" in asset.criticality else 4.0
        max_downtime_hours = 36.0 if "Tier 1" in asset.criticality else 18.0

        min_primary = (min_downtime_hours * asset.hourly_downtime_cost) + (0.05 * asset.replacement_cost)
        mode_primary = (mode_downtime_hours * asset.hourly_downtime_cost) + (0.20 * asset.replacement_cost)
        max_primary = (max_downtime_hours * asset.hourly_downtime_cost) + (0.80 * asset.replacement_cost)

        # Secondary Loss: Regulatory fines + Privacy breach notification + Customer churn
        # DPDP Act 2023 penalties up to ₹250 Crores, RBI fines up to ₹5-10 Crores for systemic outages
        records = asset.records_count
        if records > 1000000 and asset.data_classification in ["Financial", "PII"]:
            min_secondary = 5000000.0   # ₹50 Lakhs
            mode_secondary = 25000000.0  # ₹2.5 Crores
            max_secondary = 120000000.0  # ₹12 Crores
        elif records > 100000:
            min_secondary = 1500000.0
            mode_secondary = 8000000.0
            max_secondary = 35000000.0
        else:
            min_secondary = 300000.0
            mode_secondary = 2000000.0
            max_secondary = 8000000.0

        total_min = min_primary + min_secondary
        total_mode = mode_primary + mode_secondary
        total_max = max_primary + max_secondary

        return {
            "min_loss": total_min,
            "mode_loss": total_mode,
            "max_loss": total_max,
            "primary_mode": mode_primary,
            "secondary_mode": mode_secondary,
            "downtime_mode": mode_downtime_hours * asset.hourly_downtime_cost
        }
