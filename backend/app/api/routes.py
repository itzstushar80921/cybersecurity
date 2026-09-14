from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict, Any, Optional
import json

from ..models.schemas import (
    Asset, Vulnerability, SecurityControl, TelemetryEvent,
    SimulationRequest, SimulationResult,
    OptimizationRequest, OptimizationResult,
    WhatIfRequest, WhatIfResult,
    ComplianceItem, FrameworkScore,
    CopilotQueryRequest, CopilotQueryResponse
)
from ..data.sample_enterprise import (
    SAMPLE_ASSETS, SAMPLE_VULNERABILITIES, SAMPLE_SECURITY_CONTROLS, SAMPLE_TELEMETRY
)
from ..core.monte_carlo import MonteCarloSimulator
from ..core.optimizer import SecurityInvestmentOptimizer
from ..core.compliance import ComplianceCrosswalkEngine
from ..core.copilot import AIRiskCopilot

router = APIRouter(prefix="/api")

# State holders (in-memory for demo / live mutations)
CURRENT_ASSETS = list(SAMPLE_ASSETS)
CURRENT_VULNS = list(SAMPLE_VULNERABILITIES)
CURRENT_CONTROLS = list(SAMPLE_SECURITY_CONTROLS)
CURRENT_TELEMETRY = list(SAMPLE_TELEMETRY)

# Cached baseline simulation
BASELINE_SIMULATION = MonteCarloSimulator.run_simulation(
    CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS, SimulationRequest(iterations=10000)
)
BASELINE_OPTIMIZATION = SecurityInvestmentOptimizer.optimize_investments(
    BASELINE_SIMULATION.expected_annual_loss,
    CURRENT_CONTROLS,
    OptimizationRequest(budget=10000000.0)  # Default ₹1 Crore
)

@router.get("/overview")
def get_overview():
    """Returns top-level executive KPIs, trends, and summary metrics."""
    global BASELINE_SIMULATION, BASELINE_OPTIMIZATION
    
    # 6-month synthetic trend data
    monthly_trend = [
        {"month": "Apr 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss * 1.25, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95 * 1.22, 2), "posture_score": 58},
        {"month": "May 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss * 1.18, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95 * 1.15, 2), "posture_score": 62},
        {"month": "Jun 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss * 1.12, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95 * 1.10, 2), "posture_score": 65},
        {"month": "Jul 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss * 1.08, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95 * 1.06, 2), "posture_score": 67},
        {"month": "Aug 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss * 1.04, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95 * 1.02, 2), "posture_score": 70},
        {"month": "Sep 2026", "eal_inr": round(BASELINE_SIMULATION.expected_annual_loss, 2), "var95_inr": round(BASELINE_SIMULATION.value_at_risk_95, 2), "posture_score": BASELINE_SIMULATION.enterprise_posture_score}
    ]

    fw_scores = ComplianceCrosswalkEngine.get_framework_scores()

    return {
        "expected_annual_loss": BASELINE_SIMULATION.expected_annual_loss,
        "value_at_risk_95": BASELINE_SIMULATION.value_at_risk_95,
        "conditional_var_95": BASELINE_SIMULATION.conditional_var_95,
        "enterprise_posture_score": BASELINE_SIMULATION.enterprise_posture_score,
        "active_assets_count": len(CURRENT_ASSETS),
        "total_vulnerabilities_count": len(CURRENT_VULNS),
        "critical_vulnerabilities_count": sum(1 for v in CURRENT_VULNS if v.severity == "Critical"),
        "monthly_trend": monthly_trend,
        "loss_breakdown": BASELINE_SIMULATION.loss_breakdown,
        "top_risk_drivers": BASELINE_SIMULATION.top_risk_drivers,
        "top_asset": BASELINE_SIMULATION.asset_risk_rankings[0],
        "compliance_summary": fw_scores,
        "default_budget": BASELINE_OPTIMIZATION.available_budget,
        "default_risk_reduction": BASELINE_OPTIMIZATION.total_risk_reduction_inr,
        "default_rosi": BASELINE_OPTIMIZATION.overall_rosi_percentage
    }

@router.get("/assets", response_model=List[Asset])
def get_assets():
    return CURRENT_ASSETS

@router.get("/vulnerabilities", response_model=List[Vulnerability])
def get_vulnerabilities():
    return CURRENT_VULNS

@router.get("/controls", response_model=List[SecurityControl])
def get_controls():
    return CURRENT_CONTROLS

@router.get("/telemetry", response_model=List[TelemetryEvent])
def get_telemetry():
    return CURRENT_TELEMETRY

@router.post("/simulate", response_model=SimulationResult)
def run_simulation(request: SimulationRequest):
    return MonteCarloSimulator.run_simulation(
        CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS, request
    )

@router.post("/optimize", response_model=OptimizationResult)
def optimize_investments(request: OptimizationRequest):
    global BASELINE_SIMULATION
    return SecurityInvestmentOptimizer.optimize_investments(
        BASELINE_SIMULATION.expected_annual_loss,
        CURRENT_CONTROLS,
        request
    )

@router.post("/scenarios/what-if", response_model=WhatIfResult)
def run_what_if_scenario(req: WhatIfRequest):
    global BASELINE_SIMULATION
    base_eal = BASELINE_SIMULATION.expected_annual_loss
    base_var95 = BASELINE_SIMULATION.value_at_risk_95
    
    if req.scenario_type == "mfa_privileged" or req.enforce_mfa_all:
        # Enforce MFA across all privileged accounts (CTRL-01)
        sim = MonteCarloSimulator.run_simulation(
            CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS,
            SimulationRequest(iterations=10000, applied_control_ids=["CTRL-01"])
        )
        scenario_name = "Enforce Phishing-Resistant MFA on All Privileged Accounts"
        scenario_eal = sim.expected_annual_loss
        scenario_var95 = sim.value_at_risk_95
        delta_eal = scenario_eal - base_eal
        delta_pct = (delta_eal / base_eal) * 100.0
        narrative = (
            f"Enforcing hardware-based FIDO2 MFA on all Active Directory, Okta, and cloud admin accounts "
            f"compresses enterprise credential theft susceptibility by 28.5%. This reduces Expected Annual Loss "
            f"by ₹{abs(delta_eal):,.2f} ({abs(delta_pct):.1f}% reduction) for an investment of only ₹15 Lakhs."
        )
        drivers = [
            "Neutralizes credential stuffing & password spray attacks targeting domain controllers",
            "Closes primary audit deficiency under RBI Cyber Security Framework Annex I - Sec 3",
            "Eliminates SMS-OTP interception and SIM swap attack vectors"
        ]
        actions = [
            "Procure and distribute 250 FIDO2 hardware tokens (YubiKeys)",
            "Enforce Conditional Access policy requiring hardware token for Cloud Admin & Core DB roles",
            "Disable legacy basic authentication protocols across Microsoft 365 / AD"
        ]

    elif req.scenario_type == "patch_delay" or req.patch_delay_days > 0:
        days = req.patch_delay_days if req.patch_delay_days > 0 else 30
        sim = MonteCarloSimulator.run_simulation(
            CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS,
            SimulationRequest(iterations=10000, patch_delay_days=days)
        )
        scenario_name = f"Delay Vulnerability Patch Remediation by {days} Days"
        scenario_eal = sim.expected_annual_loss
        scenario_var95 = sim.value_at_risk_95
        delta_eal = scenario_eal - base_eal
        delta_pct = (delta_eal / base_eal) * 100.0
        narrative = (
            f"Postponing remediation of high/critical vulnerabilities by {days} days exponentially expands the attacker exploitation window. "
            f"Enterprise Expected Annual Loss increases by +₹{delta_eal:,.2f} (+{delta_pct:.1f}% surge) and Value at Risk (95%) "
            f"spikes by +₹{scenario_var95 - base_var95:,.2f}."
        )
        drivers = [
            f"EPSS exploit probability compounds over {days} days for active CVEs like CVE-2024-38063 and CVE-2023-44487",
            "Increased likelihood of automated ransomware scanner discovery on perimeter endpoints",
            "Breach of SEBI CSCRF 72-hour critical vulnerability remediation SLA, attracting regulatory scrutiny"
        ]
        actions = [
            "Establish an Emergency Change Advisory Board (CAB) for zero-day vulnerabilities",
            "Implement automated virtual patching at WAF and IPS boundaries during testing cycles",
            "Mandate automated staging regression testing to authorize patch pushes within 48 hours"
        ]

    elif req.scenario_type == "ransomware_outbreak":
        # Simulate ransomware on Core Banking & UPI
        threat_mult = 2.4
        sim = MonteCarloSimulator.run_simulation(
            CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS,
            SimulationRequest(iterations=10000, threat_multiplier=threat_mult)
        )
        scenario_name = "Targeted Ransomware Outbreak on Tier 1 Infrastructure"
        scenario_eal = sim.expected_annual_loss
        scenario_var95 = sim.value_at_risk_95
        delta_eal = scenario_eal - base_eal
        delta_pct = (delta_eal / base_eal) * 100.0
        narrative = (
            f"Under a coordinated ransomware attack targeting Core Banking and UPI switching nodes, financial exposure "
            f"surges to an EAL of ₹{scenario_eal:,.2f} (+{delta_pct:.1f}%) and catastrophic 95% Value at Risk of ₹{scenario_var95:,.2f}. "
            f"Primary loss drivers are ₹25 Lakhs/hour downtime and RBI statutory systemic outage sanctions."
        )
        drivers = [
            "Unsegmented lateral movement path from staging CI/CD to Core DB subnet",
            "Lack of immutable WORM air-gapped backup copies prolongs recovery from hours to weeks",
            "Extortion demands and DPDP Act penalties for data exfiltration"
        ]
        actions = [
            "Deploy CTRL-04 (Host Micro-segmentation for Core Banking)",
            "Deploy CTRL-07 (Immutable Air-Gapped Ransomware Backups)",
            "Execute tabletop disaster recovery failover drill quarterly"
        ]

    else:
        # Combined optimal controls scenario
        sim = MonteCarloSimulator.run_simulation(
            CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS,
            SimulationRequest(iterations=10000, applied_control_ids=["CTRL-01", "CTRL-02", "CTRL-04"])
        )
        scenario_name = "Strategic Defense Package (MFA + Automated Patching + Micro-segmentation)"
        scenario_eal = sim.expected_annual_loss
        scenario_var95 = sim.value_at_risk_95
        delta_eal = scenario_eal - base_eal
        delta_pct = (delta_eal / base_eal) * 100.0
        narrative = (
            f"Deploying the combined triad of Phishing-Resistant MFA, Automated Patch Orchestration, and Zero Trust Micro-segmentation "
            f"reduces total enterprise cyber risk by ₹{abs(delta_eal):,.2f} ({abs(delta_pct):.1f}% reduction). "
            f"Delivers an aggregated portfolio ROSI of 142.6%."
        )
        drivers = [
            "Eliminates 85% of credential and lateral movement attack vectors",
            "Compresses MTTR to <48 hours for external vulnerabilities",
            "Achieves 94% compliance across RBI and SEBI cybersecurity frameworks"
        ]
        actions = [
            "Approve capital expenditure allocation of ₹72 Lakhs across FY26-27",
            "Initiate phased rollout starting with UPI Payment Switch and Active Directory",
            "Present risk reduction trajectory at upcoming Board Risk Committee meeting"
        ]

    return WhatIfResult(
        scenario_name=scenario_name,
        baseline_eal=round(base_eal, 2),
        scenario_eal=round(scenario_eal, 2),
        baseline_var_95=round(base_var95, 2),
        scenario_var_95=round(scenario_var95, 2),
        delta_eal=round(delta_eal, 2),
        delta_percentage=round(delta_pct, 1),
        executive_narrative=narrative,
        key_drivers=drivers,
        suggested_actions=actions
    )

@router.get("/compliance")
def get_compliance():
    scores = ComplianceCrosswalkEngine.get_framework_scores()
    items = ComplianceCrosswalkEngine.get_compliance_register()
    return {
        "framework_scores": scores,
        "compliance_items": items
    }

@router.post("/copilot/query", response_model=CopilotQueryResponse)
def query_copilot(req: CopilotQueryRequest):
    global BASELINE_SIMULATION, BASELINE_OPTIMIZATION
    scores = ComplianceCrosswalkEngine.get_framework_scores()
    return AIRiskCopilot.answer_query(
        req.query, BASELINE_SIMULATION, BASELINE_OPTIMIZATION, scores
    )

@router.post("/telemetry/ingest")
async def ingest_telemetry(payload: Dict[str, Any]):
    """Ingests custom telemetry findings or scanner reports."""
    global BASELINE_SIMULATION, BASELINE_OPTIMIZATION
    
    # Process event
    event = TelemetryEvent(
        id=f"TEL-{len(CURRENT_TELEMETRY) + 1:03d}",
        source=payload.get("source", "API Ingestion"),
        severity=payload.get("severity", "High"),
        event_type=payload.get("event_type", "External Telemetry Stream"),
        description=payload.get("description", "Telemetry ingested via REST API"),
        asset_id=payload.get("asset_id", "ASSET-01"),
        timestamp="2026-09-14T18:00:00Z",
        metric_value=float(payload.get("metric_value", 50.0))
    )
    CURRENT_TELEMETRY.insert(0, event)
    
    # Recalculate baseline
    BASELINE_SIMULATION = MonteCarloSimulator.run_simulation(
        CURRENT_ASSETS, CURRENT_VULNS, CURRENT_CONTROLS, SimulationRequest(iterations=10000)
    )
    BASELINE_OPTIMIZATION = SecurityInvestmentOptimizer.optimize_investments(
        BASELINE_SIMULATION.expected_annual_loss,
        CURRENT_CONTROLS,
        OptimizationRequest(budget=10000000.0)
    )

    return {
        "status": "success",
        "message": f"Successfully ingested event {event.id}",
        "new_eal": BASELINE_SIMULATION.expected_annual_loss,
        "new_posture_score": BASELINE_SIMULATION.enterprise_posture_score
    }

@router.get("/report/data")
def get_report_data():
    """Returns formatted data package for printing/exporting the Board-Ready Executive Report."""
    global BASELINE_SIMULATION, BASELINE_OPTIMIZATION
    scores = ComplianceCrosswalkEngine.get_framework_scores()
    items = ComplianceCrosswalkEngine.get_compliance_register()
    
    return {
        "institution_name": "OmniBank & Capital Ltd.",
        "report_date": "September 14, 2026",
        "generated_by": "CyberQuant-AI™ Autonomous Risk Engine",
        "scope": "Enterprise ICT Infrastructure, Cloud & Core Banking",
        "eal_inr": BASELINE_SIMULATION.expected_annual_loss,
        "var_95_inr": BASELINE_SIMULATION.value_at_risk_95,
        "var_99_inr": BASELINE_SIMULATION.value_at_risk_99,
        "cvar_95_inr": BASELINE_SIMULATION.conditional_var_95,
        "posture_score": BASELINE_SIMULATION.enterprise_posture_score,
        "loss_breakdown": BASELINE_SIMULATION.loss_breakdown,
        "top_assets": BASELINE_SIMULATION.asset_risk_rankings[:5],
        "top_risk_drivers": BASELINE_SIMULATION.top_risk_drivers,
        "framework_scores": scores,
        "selected_investments": BASELINE_OPTIMIZATION.selected_controls,
        "total_budget": BASELINE_OPTIMIZATION.available_budget,
        "total_spend": BASELINE_OPTIMIZATION.total_spent,
        "projected_risk_reduction": BASELINE_OPTIMIZATION.total_risk_reduction_inr,
        "projected_rosi": BASELINE_OPTIMIZATION.overall_rosi_percentage
    }
