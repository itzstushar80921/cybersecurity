// Rich default baseline data ensuring the platform works 100% reliably out of the box
// even before the live Python backend connects, preventing any ₹0 or empty screen errors.

export const defaultAssets = [
  {
    id: "ASSET-01",
    name: "UPI Real-time Payment Switch",
    business_unit: "Digital Payments & Retail",
    asset_type: "API Gateway & Switching Node",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 3.0,
    data_classification: "Financial",
    hourly_downtime_cost: 1500000.0,
    records_count: 45000000,
    replacement_cost: 35000000.0,
    ip_or_endpoint: "10.140.12.50 / api.payments.omnibank.in",
    cloud_provider: "AWS & On-Prem Hybrid",
    vulnerabilities_count: 3,
    control_coverage_score: 0.82
  },
  {
    id: "ASSET-02",
    name: "Core Banking Transaction Engine (Finacle)",
    business_unit: "Treasury & Core Operations",
    asset_type: "Database & Transaction Engine",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 3.0,
    data_classification: "Financial",
    hourly_downtime_cost: 2500000.0,
    records_count: 22000000,
    replacement_cost: 80000000.0,
    ip_or_endpoint: "10.140.2.10 / core-db.prod.internal",
    cloud_provider: "Private Data Center (Tier IV)",
    vulnerabilities_count: 4,
    control_coverage_score: 0.88
  },
  {
    id: "ASSET-03",
    name: "Retail NetBanking & Mobile API Cluster",
    business_unit: "Digital Banking",
    asset_type: "Kubernetes Microservices Cluster",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 2.8,
    data_classification: "PII & Financial",
    hourly_downtime_cost: 1200000.0,
    records_count: 18000000,
    replacement_cost: 25000000.0,
    ip_or_endpoint: "netbanking.omnibank.in / EKS-Cluster-01",
    cloud_provider: "AWS ap-south-1",
    vulnerabilities_count: 5,
    control_coverage_score: 0.74
  },
  {
    id: "ASSET-04",
    name: "Enterprise Active Directory & IdP (Okta/AD)",
    business_unit: "IT Infrastructure & Security",
    asset_type: "Identity & Access Management",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 3.0,
    data_classification: "Confidential",
    hourly_downtime_cost: 800000.0,
    records_count: 35000,
    replacement_cost: 15000000.0,
    ip_or_endpoint: "10.10.1.10 / idp.omnibank.in",
    cloud_provider: "Hybrid Azure AD",
    vulnerabilities_count: 2,
    control_coverage_score: 0.78
  },
  {
    id: "ASSET-05",
    name: "SWIFT Interbank Settlement Node",
    business_unit: "Global Markets & Treasury",
    asset_type: "Secured Appliance / Gateway",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 3.0,
    data_classification: "Financial",
    hourly_downtime_cost: 3000000.0,
    records_count: 500000,
    replacement_cost: 40000000.0,
    ip_or_endpoint: "10.200.1.5 (Isolated HSM Zone)",
    cloud_provider: "On-Premises Dedicated HSM",
    vulnerabilities_count: 1,
    control_coverage_score: 0.92
  },
  {
    id: "ASSET-06",
    name: "Customer 360 Analytics & Data Lake",
    business_unit: "Business Intelligence & Risk",
    asset_type: "Cloud Data Lake (S3 & Snowflake)",
    criticality: "Tier 1 (Mission-Critical)",
    criticality_weight: 2.6,
    data_classification: "PII & Financial",
    hourly_downtime_cost: 600000.0,
    records_count: 55000000,
    replacement_cost: 30000000.0,
    ip_or_endpoint: "s3://omnibank-datalake-prod-vault",
    cloud_provider: "AWS",
    vulnerabilities_count: 6,
    control_coverage_score: 0.68
  },
  {
    id: "ASSET-07",
    name: "Loan Origination & Credit Underwriting",
    business_unit: "Retail Lending",
    asset_type: "Web Application & AI Model Server",
    criticality: "Tier 2 (Business-Critical)",
    criticality_weight: 2.0,
    data_classification: "Financial",
    hourly_downtime_cost: 450000.0,
    records_count: 6500000,
    replacement_cost: 12000000.0,
    ip_or_endpoint: "credit.omnibank.in",
    cloud_provider: "GCP",
    vulnerabilities_count: 4,
    control_coverage_score: 0.71
  },
  {
    id: "ASSET-08",
    name: "Wealth & Securities Trading Portal",
    business_unit: "Capital Markets",
    asset_type: "High-Frequency Web & WebSocket Engine",
    criticality: "Tier 2 (Business-Critical)",
    criticality_weight: 2.2,
    data_classification: "Financial",
    hourly_downtime_cost: 900000.0,
    records_count: 2800000,
    replacement_cost: 18000000.0,
    ip_or_endpoint: "trade.omnicapital.in",
    cloud_provider: "AWS",
    vulnerabilities_count: 3,
    control_coverage_score: 0.80
  },
  {
    id: "ASSET-09",
    name: "Partner Open-Banking API Gateway",
    business_unit: "FinTech Partnerships",
    asset_type: "API Gateway (Kong / Apigee)",
    criticality: "Tier 2 (Business-Critical)",
    criticality_weight: 2.1,
    data_classification: "Financial",
    hourly_downtime_cost: 550000.0,
    records_count: 12000000,
    replacement_cost: 10000000.0,
    ip_or_endpoint: "api.partner.omnibank.in",
    cloud_provider: "AWS",
    vulnerabilities_count: 4,
    control_coverage_score: 0.75
  },
  {
    id: "ASSET-10",
    name: "Corporate HR & Employee Intranet",
    business_unit: "Human Resources & Admin",
    asset_type: "SaaS / Web Application",
    criticality: "Tier 3 (Support)",
    criticality_weight: 1.2,
    data_classification: "PII",
    hourly_downtime_cost: 120000.0,
    records_count: 25000,
    replacement_cost: 4000000.0,
    ip_or_endpoint: "people.omnibank.in",
    cloud_provider: "Azure",
    vulnerabilities_count: 2,
    control_coverage_score: 0.85
  },
  {
    id: "ASSET-11",
    name: "Customer Care CRM & Telephony Gateway",
    business_unit: "Customer Support",
    asset_type: "CRM Web Application & VoIP",
    criticality: "Tier 3 (Support)",
    criticality_weight: 1.3,
    data_classification: "PII",
    hourly_downtime_cost: 200000.0,
    records_count: 8000000,
    replacement_cost: 6000000.0,
    ip_or_endpoint: "support.omnibank.in",
    cloud_provider: "AWS",
    vulnerabilities_count: 3,
    control_coverage_score: 0.72
  },
  {
    id: "ASSET-12",
    name: "Internal CI/CD & Build Pipeline (Jenkins/GitLab)",
    business_unit: "DevSecOps & Engineering",
    asset_type: "Build & Deployment Infrastructure",
    criticality: "Tier 3 (Support)",
    criticality_weight: 1.5,
    data_classification: "Confidential",
    hourly_downtime_cost: 280000.0,
    records_count: 5000,
    replacement_cost: 5000000.0,
    ip_or_endpoint: "10.50.4.15 / gitlab.internal",
    cloud_provider: "Private Cloud",
    vulnerabilities_count: 5,
    control_coverage_score: 0.64
  }
];

export const defaultVulnerabilities = [
  {
    id: "VULN-001",
    cve_id: "CVE-2024-38063",
    title: "Windows TCP/IP Remote Code Execution",
    severity: "Critical",
    cvss_score: 9.8,
    epss_score: 0.88,
    affected_asset_id: "ASSET-04",
    affected_asset_name: "Enterprise Active Directory & IdP",
    exploit_available: true,
    in_cisa_kev: true,
    remediation_status: "Open",
    remediation_cost: 450000.0,
    days_open: 12
  },
  {
    id: "VULN-002",
    cve_id: "CVE-2023-44487",
    title: "HTTP/2 Rapid Reset Denial of Service",
    severity: "High",
    cvss_score: 7.5,
    epss_score: 0.91,
    affected_asset_id: "ASSET-01",
    affected_asset_name: "UPI Real-time Payment Switch",
    exploit_available: true,
    in_cisa_kev: true,
    remediation_status: "Open",
    remediation_cost: 300000.0,
    days_open: 48
  },
  {
    id: "VULN-003",
    cve_id: "CVE-2024-21626",
    title: "runc Container Breakout via File Descriptor Leak",
    severity: "Critical",
    cvss_score: 8.6,
    epss_score: 0.74,
    affected_asset_id: "ASSET-03",
    affected_asset_name: "Retail NetBanking & Mobile API Cluster",
    exploit_available: true,
    in_cisa_kev: false,
    remediation_status: "Open",
    remediation_cost: 600000.0,
    days_open: 21
  },
  {
    id: "VULN-004",
    cve_id: "CVE-2023-38606",
    title: "Oracle Finacle Core Banking Injection Vulnerability",
    severity: "Critical",
    cvss_score: 9.1,
    epss_score: 0.45,
    affected_asset_id: "ASSET-02",
    affected_asset_name: "Core Banking Transaction Engine",
    exploit_available: false,
    in_cisa_kev: false,
    remediation_status: "In Progress",
    remediation_cost: 1200000.0,
    days_open: 35
  },
  {
    id: "VULN-005",
    cve_id: "CVE-2024-27351",
    title: "AWS S3 Bucket Wildcard IAM Policy Misconfiguration",
    severity: "High",
    cvss_score: 8.2,
    epss_score: 0.62,
    affected_asset_id: "ASSET-06",
    affected_asset_name: "Customer 360 Analytics & Data Lake",
    exploit_available: true,
    in_cisa_kev: false,
    remediation_status: "Open",
    remediation_cost: 250000.0,
    days_open: 19
  }
];

export const defaultControls = [
  {
    id: "CTRL-01",
    name: "Phishing-Resistant FIDO2 MFA for Privileged Accounts",
    category: "Identity & Access",
    description: "Deploy hardware security keys (YubiKeys) and mandatory FIDO2 WebAuthn for all Domain Admins, Cloud Root, and Core Banking operators.",
    implementation_cost: 1500000.0,
    annual_operational_cost: 300000.0,
    risk_reduction_percentage: 28.5,
    framework_mappings: {
      NIST_CSF: ["PR.AC-1", "PR.AC-6"],
      RBI: ["Annex I - Section 3 (Access Control)", "Section 3.4 (MFA)"],
      SEBI: ["CSCRF - Parameter 2 (Access Governance)", "Control 2.3"]
    },
    deployed: false,
    implementation_time_weeks: 3
  },
  {
    id: "CTRL-02",
    name: "Automated Vulnerability Remediation & Patch SLA Orchestrator",
    category: "Vulnerability Mgmt",
    description: "Integrate automated patch testing and emergency zero-day patching pipeline to reduce MTTR from 45 days to <72 hours for CISA KEVs.",
    implementation_cost: 2200000.0,
    annual_operational_cost: 500000.0,
    risk_reduction_percentage: 32.0,
    framework_mappings: {
      NIST_CSF: ["PR.IP-12", "ID.RA-1"],
      RBI: ["Annex I - Section 5 (Patch Management)"],
      SEBI: ["CSCRF - Parameter 4 (Vulnerability Management)"]
    },
    deployed: false,
    implementation_time_weeks: 4
  },
  {
    id: "CTRL-03",
    name: "Next-Gen Cloud Security Posture Management (CSPM & CIEM)",
    category: "Cloud Defense",
    description: "Continuous real-time posture scanning, least-privilege IAM entitlement enforcement, and automated remediation of public cloud buckets.",
    implementation_cost: 1800000.0,
    annual_operational_cost: 400000.0,
    risk_reduction_percentage: 24.0,
    framework_mappings: {
      NIST_CSF: ["PR.AC-4", "PR.DS-1"],
      RBI: ["Annex II - Section 2 (Cloud Security Guidelines)"],
      SEBI: ["CSCRF - Parameter 3 (Cloud Data Protection)"]
    },
    deployed: false,
    implementation_time_weeks: 3
  },
  {
    id: "CTRL-04",
    name: "Micro-segmentation & Zero Trust Network Isolation for SWIFT/Core",
    category: "Network",
    description: "Implement software-defined host microsegmentation isolating SWIFT and Core Banking switches from corporate intranet and staging networks.",
    implementation_cost: 3500000.0,
    annual_operational_cost: 600000.0,
    risk_reduction_percentage: 38.0,
    framework_mappings: {
      NIST_CSF: ["PR.AC-5", "PR.PT-4"],
      RBI: ["Annex I - Section 4 (Network Security & SWIFT Isolation)"],
      SEBI: ["CSCRF - Parameter 5 (Network Perimeter & Segmentation)"]
    },
    deployed: false,
    implementation_time_weeks: 6
  },
  {
    id: "CTRL-05",
    name: "24x7 AI-Powered Managed SOC & MDR (Extended EDR Coverage)",
    category: "Detection",
    description: "Expand behavioral EDR with 24x7 threat hunting, memory inspection, and automated endpoint isolation across 100% of servers.",
    implementation_cost: 4000000.0,
    annual_operational_cost: 1200000.0,
    risk_reduction_percentage: 35.5,
    framework_mappings: {
      NIST_CSF: ["DE.AE-1", "DE.CM-1"],
      RBI: ["Annex I - Section 8 (Cyber SOC & Incident Response)"],
      SEBI: ["CSCRF - Parameter 6 (Continuous Monitoring & SOC)"]
    },
    deployed: false,
    implementation_time_weeks: 5
  }
];

export const defaultTelemetry = [
  {
    id: "TEL-001",
    source: "SIEM (Elastic/Sentinel)",
    severity: "High",
    event_type: "Excessive Failed Logins / Password Spray",
    description: "1,420 failed authentication attempts from 3 external IP subnets targeting Domain Controller admin accounts.",
    asset_id: "ASSET-04",
    timestamp: new Date().toISOString(),
    metric_value: 1420.0
  },
  {
    id: "TEL-002",
    source: "EDR (CrowdStrike)",
    severity: "Critical",
    event_type: "Suspicious PowerShell Process Spawning",
    description: "Unsigned script execution attempting LSASS memory dump detected on Staging Jenkins worker.",
    asset_id: "ASSET-12",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    metric_value: 95.0
  },
  {
    id: "TEL-003",
    source: "CSPM (AWS Security Hub)",
    severity: "High",
    event_type: "S3 Public Access Block Disabled",
    description: "Bucket 'omnibank-datalake-prod-vault' has permissive IAM cross-account access policy attached.",
    asset_id: "ASSET-06",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    metric_value: 85.0
  },
  {
    id: "TEL-004",
    source: "VulnScanner (Tenable)",
    severity: "Critical",
    event_type: "Active Zero-Day CISA KEV Match",
    description: "Host running vulnerable HTTP/2 stack susceptible to rapid reset denial of service.",
    asset_id: "ASSET-01",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    metric_value: 9.8
  }
];

export const defaultSimulation = {
  expected_annual_loss: 68450000.0, // ₹6.84 Crores
  value_at_risk_90: 124000000.0,
  value_at_risk_95: 158200000.0,   // ₹15.82 Crores
  value_at_risk_99: 215000000.0,
  conditional_var_95: 182400000.0,
  minimum_loss: 1800000.0,
  maximum_loss: 285000000.0,
  currency: "INR",
  iterations_run: 10000,
  enterprise_posture_score: 68.5,
  loss_exceedance_curve: [
    { loss_amount: 12000000, probability_exceeded: 0.90, percentile: 10 },
    { loss_amount: 28000000, probability_exceeded: 0.75, percentile: 25 },
    { loss_amount: 45000000, probability_exceeded: 0.60, percentile: 40 },
    { loss_amount: 58000000, probability_exceeded: 0.50, percentile: 50 },
    { loss_amount: 72000000, probability_exceeded: 0.40, percentile: 60 },
    { loss_amount: 95000000, probability_exceeded: 0.30, percentile: 70 },
    { loss_amount: 110000000, probability_exceeded: 0.25, percentile: 75 },
    { loss_amount: 124000000, probability_exceeded: 0.20, percentile: 80 },
    { loss_amount: 138000000, probability_exceeded: 0.15, percentile: 85 },
    { loss_amount: 146000000, probability_exceeded: 0.10, percentile: 90 },
    { loss_amount: 158200000, probability_exceeded: 0.05, percentile: 95 },
    { loss_amount: 185000000, probability_exceeded: 0.025, percentile: 97.5 },
    { loss_amount: 215000000, probability_exceeded: 0.01, percentile: 99 }
  ],
  loss_breakdown: {
    "Business Downtime": 28500000.0,
    "Incident Response & Forensics": 12400000.0,
    "Regulatory Penalties (RBI/SEBI)": 15800000.0,
    "Reputational & Customer Churn": 11750000.0
  },
  asset_risk_rankings: [
    {
      asset_id: "ASSET-02",
      asset_name: "Core Banking Transaction Engine (Finacle)",
      business_unit: "Treasury & Core Operations",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 21500000.0,
      value_at_risk_95: 52000000.0,
      risk_score: 92.5,
      top_vulnerability: "CVE-2023-38606 (Critical)",
      threat_event_frequency: 7.2,
      vulnerability_probability: 0.28
    },
    {
      asset_id: "ASSET-01",
      asset_name: "UPI Real-time Payment Switch",
      business_unit: "Digital Payments & Retail",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 16800000.0,
      value_at_risk_95: 41000000.0,
      risk_score: 84.0,
      top_vulnerability: "CVE-2023-44487 (High)",
      threat_event_frequency: 18.9,
      vulnerability_probability: 0.32
    },
    {
      asset_id: "ASSET-03",
      asset_name: "Retail NetBanking & Mobile API Cluster",
      business_unit: "Digital Banking",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 11200000.0,
      value_at_risk_95: 28500000.0,
      risk_score: 76.5,
      top_vulnerability: "CVE-2024-21626 (Critical)",
      threat_event_frequency: 12.6,
      vulnerability_probability: 0.24
    },
    {
      asset_id: "ASSET-04",
      asset_name: "Enterprise Active Directory & IdP (Okta/AD)",
      business_unit: "IT Infrastructure & Security",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 8400000.0,
      value_at_risk_95: 19800000.0,
      risk_score: 68.0,
      top_vulnerability: "CVE-2024-38063 (Critical)",
      threat_event_frequency: 7.2,
      vulnerability_probability: 0.22
    },
    {
      asset_id: "ASSET-06",
      asset_name: "Customer 360 Analytics & Data Lake",
      business_unit: "Business Intelligence & Risk",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 5800000.0,
      value_at_risk_95: 14200000.0,
      risk_score: 55.0,
      top_vulnerability: "CVE-2024-27351 (High)",
      threat_event_frequency: 6.4,
      vulnerability_probability: 0.21
    },
    {
      asset_id: "ASSET-05",
      asset_name: "SWIFT Interbank Settlement Node",
      business_unit: "Global Markets & Treasury",
      criticality: "Tier 1 (Mission-Critical)",
      expected_annual_loss: 4750000.0,
      value_at_risk_95: 12000000.0,
      risk_score: 49.0,
      top_vulnerability: "CVE-2023-48795 (Medium)",
      threat_event_frequency: 5.4,
      vulnerability_probability: 0.12
    }
  ],
  top_risk_drivers: [
    {
      driver: "Exploitable Remote Code Execution Vulnerabilities",
      contribution_percentage: 34.2,
      impact_eal_inr: 23409900.0,
      remedy: "Automated patch orchestration for CISA KEV CVEs"
    },
    {
      driver: "Excessive Cloud IAM & Public S3 Permissions",
      contribution_percentage: 25.8,
      impact_eal_inr: 17660100.0,
      remedy: "Next-Gen CSPM & Least Privilege Access Enforcement"
    },
    {
      driver: "Privileged Admin Accounts Lacking Hardware MFA",
      contribution_percentage: 22.0,
      impact_eal_inr: 15059000.0,
      remedy: "Phishing-resistant FIDO2 WebAuthn keys"
    },
    {
      driver: "Unsegmented Core Banking Network & SWIFT Node",
      contribution_percentage: 18.0,
      impact_eal_inr: 12321000.0,
      remedy: "Zero Trust host microsegmentation"
    }
  ]
};

export const defaultOverview = {
  expected_annual_loss: defaultSimulation.expected_annual_loss,
  value_at_risk_95: defaultSimulation.value_at_risk_95,
  conditional_var_95: defaultSimulation.conditional_var_95,
  enterprise_posture_score: defaultSimulation.enterprise_posture_score,
  active_assets_count: defaultAssets.length,
  total_vulnerabilities_count: defaultVulnerabilities.length,
  critical_vulnerabilities_count: defaultVulnerabilities.filter(v => v.severity === "Critical").length,
  monthly_trend: [
    { month: "Apr 2026", eal_inr: 85500000.0, var95_inr: 192000000.0, posture_score: 58 },
    { month: "May 2026", eal_inr: 80700000.0, var95_inr: 181900000.0, posture_score: 62 },
    { month: "Jun 2026", eal_inr: 76600000.0, var95_inr: 174000000.0, posture_score: 65 },
    { month: "Jul 2026", eal_inr: 73900000.0, var95_inr: 167600000.0, posture_score: 67 },
    { month: "Aug 2026", eal_inr: 71100000.0, var95_inr: 161300000.0, posture_score: 70 },
    { month: "Sep 2026", eal_inr: 68450000.0, var95_inr: 158200000.0, posture_score: 68.5 }
  ],
  loss_breakdown: defaultSimulation.loss_breakdown,
  top_risk_drivers: defaultSimulation.top_risk_drivers,
  top_asset: defaultSimulation.asset_risk_rankings[0],
  default_budget: 10000000.0,
  default_risk_reduction: 38500000.0,
  default_rosi: 185.2
};

export const defaultOptimization = {
  available_budget: 10000000.0, // ₹1 Crore
  total_spent: 9500000.0,       // ₹95 Lakhs
  remaining_budget: 500000.0,   // ₹5 Lakhs
  baseline_eal: 68450000.0,
  optimized_eal: 29950000.0,
  total_risk_reduction_inr: 38500000.0,
  overall_rosi_percentage: 185.2,
  budget_zone: "Optimal Spend Zone (Maximum Marginal ROSI)",
  selected_controls: [
    {
      control: defaultControls[0],
      allocated_cost: 1500000.0,
      isolated_risk_reduction_inr: 19508250.0,
      rosi_percentage: 1200.5
    },
    {
      control: defaultControls[1],
      allocated_cost: 2200000.0,
      isolated_risk_reduction_inr: 21904000.0,
      rosi_percentage: 895.6
    },
    {
      control: defaultControls[2],
      allocated_cost: 1800000.0,
      isolated_risk_reduction_inr: 16428000.0,
      rosi_percentage: 812.7
    },
    {
      control: defaultControls[3],
      allocated_cost: 3500000.0,
      isolated_risk_reduction_inr: 26011000.0,
      rosi_percentage: 643.2
    }
  ],
  unselected_controls: [defaultControls[4]],
  investment_vs_risk_curve: [
    { budget_spend_inr: 0, actual_cost_inr: 0, risk_reduction_inr: 0, residual_eal_inr: 68450000, rosi_pct: 0, zone: "Under-invested" },
    { budget_spend_inr: 1500000, actual_cost_inr: 1500000, risk_reduction_inr: 19508250, residual_eal_inr: 48941750, rosi_pct: 1200.5, zone: "Under-invested" },
    { budget_spend_inr: 3000000, actual_cost_inr: 1500000, risk_reduction_inr: 19508250, residual_eal_inr: 48941750, rosi_pct: 1200.5, zone: "Under-invested" },
    { budget_spend_inr: 4500000, actual_cost_inr: 3700000, risk_reduction_inr: 31200000, residual_eal_inr: 37250000, rosi_pct: 743.2, zone: "Optimal Spend" },
    { budget_spend_inr: 6000000, actual_cost_inr: 5500000, risk_reduction_inr: 34100000, residual_eal_inr: 34350000, rosi_pct: 520.0, zone: "Optimal Spend" },
    { budget_spend_inr: 8000000, actual_cost_inr: 7200000, risk_reduction_inr: 36800000, residual_eal_inr: 31650000, rosi_pct: 411.1, zone: "Optimal Spend" },
    { budget_spend_inr: 10000000, actual_cost_inr: 9500000, risk_reduction_inr: 38500000, residual_eal_inr: 29950000, rosi_pct: 185.2, zone: "Optimal Spend" },
    { budget_spend_inr: 13000000, actual_cost_inr: 12500000, risk_reduction_inr: 40200000, residual_eal_inr: 28250000, rosi_pct: 221.6, zone: "Diminishing Returns" },
    { budget_spend_inr: 16000000, actual_cost_inr: 15000000, risk_reduction_inr: 41500000, residual_eal_inr: 26950000, rosi_pct: 176.7, zone: "Diminishing Returns" },
    { budget_spend_inr: 20000000, actual_cost_inr: 18000000, risk_reduction_inr: 42200000, residual_eal_inr: 26250000, rosi_pct: 134.4, zone: "Diminishing Returns" }
  ]
};

export const defaultCompliance = {
  framework_scores: [
    {
      framework_name: "RBI Cyber Security Framework",
      overall_compliance_percentage: 74.5,
      total_controls: 4,
      compliant_count: 2,
      gap_count: 2,
      financial_exposure_from_gaps: 36500000.0,
      category_scores: {
        "Access Control & Identity (Annex I)": 65.0,
        "Network Security (Annex I - Sec 4)": 40.0,
        "Continuous Monitoring & SOC (Annex I - Sec 8)": 68.0,
        "Vulnerability Management (Annex I - Sec 5)": 55.0
      }
    },
    {
      framework_name: "SEBI CSCRF",
      overall_compliance_percentage: 67.0,
      total_controls: 3,
      compliant_count: 1,
      gap_count: 2,
      financial_exposure_from_gaps: 29500000.0,
      category_scores: {
        "Parameter 3 (Cloud Data Protection)": 45.0,
        "Parameter 7 (API Security)": 60.0,
        "Parameter 8 (Cyber Resilience & Disaster Recovery)": 58.0
      }
    },
    {
      framework_name: "NIST Cybersecurity Framework 2.0",
      overall_compliance_percentage: 78.5,
      total_controls: 3,
      compliant_count: 2,
      gap_count: 1,
      financial_exposure_from_gaps: 27000000.0,
      category_scores: {
        "Protect (PR)": 63.5,
        "Detect (DE)": 78.0
      }
    },
    {
      framework_name: "ISO/IEC 27001:2022",
      overall_compliance_percentage: 72.0,
      total_controls: 2,
      compliant_count: 1,
      gap_count: 1,
      financial_exposure_from_gaps: 23500000.0,
      category_scores: {
        "Access Control": 70.0,
        "Operations Security": 58.0
      }
    },
    {
      framework_name: "CIS Controls v8",
      overall_compliance_percentage: 76.0,
      total_controls: 2,
      compliant_count: 1,
      gap_count: 1,
      financial_exposure_from_gaps: 19000000.0,
      category_scores: {
        "Data Protection": 64.0,
        "Access Control Management": 72.0
      }
    }
  ],
  compliance_items: [
    {
      control_id: "RBI-CSF-01",
      framework: "RBI Cyber Security Framework",
      title: "Mandatory Multi-Factor Authentication (MFA) for Administrative Access",
      category: "Access Control & Identity (Annex I)",
      status: "Non-Compliant",
      score_percentage: 35.0,
      associated_risk_inr: 14500000.0,
      evidence_telemetry: "IAM Audit: 14 domain/system admin accounts still lack FIDO2 hardware token enforcement.",
      remediation_action: "Deploy Phishing-Resistant FIDO2 WebAuthn keys for all privileged admins."
    },
    {
      control_id: "RBI-CSF-02",
      framework: "RBI Cyber Security Framework",
      title: "Isolation of SWIFT Infrastructure & Database Micro-segmentation",
      category: "Network Security (Annex I - Sec 4)",
      status: "Non-Compliant",
      score_percentage: 40.0,
      associated_risk_inr: 22000000.0,
      evidence_telemetry: "VLAN audit shows SWIFT terminal shares routing gateway with corporate testing subnets.",
      remediation_action: "Enforce Zero Trust microsegmentation and air-gapped HSM network boundary."
    },
    {
      control_id: "SEBI-CSCRF-01",
      framework: "SEBI CSCRF",
      title: "Continuous Cloud Posture Management & Least Privilege Entitlements",
      category: "Parameter 3 (Cloud Data Protection)",
      status: "Non-Compliant",
      score_percentage: 45.0,
      associated_risk_inr: 16000000.0,
      evidence_telemetry: "CSPM detected S3 bucket 'omnibank-datalake-prod-vault' with wildcard cross-account IAM role.",
      remediation_action: "Deploy Next-Gen CSPM & CIEM with auto-remediation policies."
    }
  ]
};

export const defaultScenarioResult = {
  scenario_name: "Enforce Phishing-Resistant MFA on All Privileged Accounts",
  baseline_eal: 68450000.0,
  scenario_eal: 48941750.0,
  baseline_var_95: 158200000.0,
  scenario_var_95: 116100000.0,
  delta_eal: -19508250.0,
  delta_percentage: -28.5,
  executive_narrative: "Enforcing hardware-based FIDO2 MFA on all Active Directory, Okta, and cloud admin accounts compresses enterprise credential theft susceptibility by 28.5%. This reduces Expected Annual Loss by ₹1.95 Crores for an investment of only ₹15 Lakhs (ROSI: 1200%).",
  key_drivers: [
    "Neutralizes credential stuffing & password spray attacks targeting domain controllers",
    "Closes primary audit deficiency under RBI Cyber Security Framework Annex I - Sec 3",
    "Eliminates SMS-OTP interception and SIM swap attack vectors"
  ],
  suggested_actions: [
    "Procure and distribute 250 FIDO2 hardware tokens (YubiKeys)",
    "Enforce Conditional Access policy requiring hardware token for Cloud Admin & Core DB roles",
    "Disable legacy basic authentication protocols across Microsoft 365 / AD"
  ]
};
