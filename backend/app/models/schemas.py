from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class Asset(BaseModel):
    id: str
    name: str
    business_unit: str
    asset_type: str  # Server, Database, Cloud Service, Web Application, API Gateway, Network Switch
    criticality: str  # Tier 1 (Mission-Critical), Tier 2 (Business-Critical), Tier 3 (Support)
    criticality_weight: float = 1.0  # 1.0 to 3.0
    data_classification: str  # Confidential, Financial, PII, Public
    hourly_downtime_cost: float  # In INR
    records_count: int = 0
    replacement_cost: float = 0.0
    ip_or_endpoint: str
    cloud_provider: Optional[str] = None
    vulnerabilities_count: int = 0
    control_coverage_score: float = 0.7  # 0.0 to 1.0

class Vulnerability(BaseModel):
    id: str
    cve_id: str
    title: str
    severity: str  # Critical, High, Medium, Low
    cvss_score: float
    epss_score: float  # Exploit Prediction Scoring System probability 0-1
    affected_asset_id: str
    affected_asset_name: str
    exploit_available: bool = False
    in_cisa_kev: bool = False  # Known Exploited Vulnerability
    remediation_status: str = "Open"
    remediation_cost: float = 0.0  # In INR
    days_open: int = 15

class SecurityControl(BaseModel):
    id: str
    name: str
    category: str  # Identity & Access, Cloud Defense, Endpoint Security, Vulnerability Mgmt, Network, Detection
    description: str
    implementation_cost: float  # In INR
    annual_operational_cost: float  # In INR
    risk_reduction_percentage: float  # 5% to 45%
    framework_mappings: Dict[str, List[str]]  # e.g. {"NIST_CSF": ["PR.AC-1"], "RBI": ["G-3.1"], "SEBI": ["CSCRF-04"]}
    deployed: bool = False
    implementation_time_weeks: int = 4

class TelemetryEvent(BaseModel):
    id: str
    source: str  # SIEM, EDR, CSPM, IAM, VulnScanner
    severity: str
    event_type: str
    description: str
    asset_id: str
    timestamp: str
    metric_value: Optional[float] = None

class SimulationRequest(BaseModel):
    iterations: int = 10000
    threat_multiplier: float = 1.0  # 0.5 to 3.0
    control_uplift_percentage: float = 0.0  # 0 to 50%
    currency: str = "INR"  # INR or USD
    asset_id_filter: Optional[str] = None
    applied_control_ids: Optional[List[str]] = None
    patch_delay_days: int = 0

class LossDistributionPoint(BaseModel):
    loss_amount: float
    probability_exceeded: float
    percentile: float

class AssetRiskSummary(BaseModel):
    asset_id: str
    asset_name: str
    business_unit: str
    criticality: str
    expected_annual_loss: float
    value_at_risk_95: float
    risk_score: float  # 0 to 100
    top_vulnerability: str
    threat_event_frequency: float
    vulnerability_probability: float

class SimulationResult(BaseModel):
    expected_annual_loss: float  # EAL / ALE
    value_at_risk_90: float
    value_at_risk_95: float
    value_at_risk_99: float
    conditional_var_95: float  # CVaR / Expected Shortfall
    minimum_loss: float
    maximum_loss: float
    currency: str = "INR"
    iterations_run: int
    loss_exceedance_curve: List[LossDistributionPoint]
    loss_breakdown: Dict[str, float]  # Primary, Secondary, Regulatory, Reputational, Downtime
    asset_risk_rankings: List[AssetRiskSummary]
    top_risk_drivers: List[Dict[str, Any]]
    enterprise_posture_score: float

class OptimizationRequest(BaseModel):
    budget: float  # in INR or USD
    currency: str = "INR"
    risk_tolerance_threshold: Optional[float] = None
    preferred_categories: Optional[List[str]] = None

class SelectedControl(BaseModel):
    control: SecurityControl
    allocated_cost: float
    isolated_risk_reduction_inr: float
    rosi_percentage: float

class OptimizationResult(BaseModel):
    available_budget: float
    total_spent: float
    remaining_budget: float
    baseline_eal: float
    optimized_eal: float
    total_risk_reduction_inr: float
    overall_rosi_percentage: float
    selected_controls: List[SelectedControl]
    unselected_controls: List[SecurityControl]
    investment_vs_risk_curve: List[Dict[str, Any]]
    budget_zone: str  # Under-invested, Optimal Spend Zone, Diminishing Returns

class WhatIfRequest(BaseModel):
    scenario_type: str  # mfa_privileged, patch_delay, cloud_segmentation, ransomware_outbreak, custom
    patch_delay_days: int = 0
    enforce_mfa_all: bool = False
    deploy_edr_tier1: bool = False
    isolate_legacy_systems: bool = False
    custom_budget: Optional[float] = None

class WhatIfResult(BaseModel):
    scenario_name: str
    baseline_eal: float
    scenario_eal: float
    baseline_var_95: float
    scenario_var_95: float
    delta_eal: float
    delta_percentage: float
    executive_narrative: str
    key_drivers: List[str]
    suggested_actions: List[str]

class ComplianceItem(BaseModel):
    control_id: str
    framework: str  # ISO 27001, NIST CSF 2.0, CIS Controls, RBI, SEBI CSCRF
    title: str
    category: str
    status: str  # Compliant, Partially Compliant, Non-Compliant
    score_percentage: float
    associated_risk_inr: float
    evidence_telemetry: str
    remediation_action: str

class FrameworkScore(BaseModel):
    framework_name: str
    overall_compliance_percentage: float
    total_controls: int
    compliant_count: int
    gap_count: int
    financial_exposure_from_gaps: float
    category_scores: Dict[str, float]

class CopilotQueryRequest(BaseModel):
    query: str
    context_data: Optional[Dict[str, Any]] = None

class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    confidence: float
    suggested_followups: List[str]
    referenced_metrics: Dict[str, Any]
