from typing import List, Dict
from ..models.schemas import Asset, Vulnerability, SecurityControl, TelemetryEvent

# Enterprise Assets: "OmniBank & Capital"
SAMPLE_ASSETS: List[Asset] = [
    Asset(
        id="ASSET-01",
        name="UPI Real-time Payment Switch",
        business_unit="Digital Payments & Retail",
        asset_type="API Gateway & Switching Node",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=3.0,
        data_classification="Financial",
        hourly_downtime_cost=1500000.0,  # ₹15 Lakhs/hour
        records_count=45000000,
        replacement_cost=35000000.0,
        ip_or_endpoint="10.140.12.50 / api.payments.omnibank.in",
        cloud_provider="AWS & On-Prem Hybrid",
        vulnerabilities_count=3,
        control_coverage_score=0.82
    ),
    Asset(
        id="ASSET-02",
        name="Core Banking Transaction Engine (Finacle)",
        business_unit="Treasury & Core Operations",
        asset_type="Database & Transaction Engine",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=3.0,
        data_classification="Financial",
        hourly_downtime_cost=2500000.0,  # ₹25 Lakhs/hour
        records_count=22000000,
        replacement_cost=80000000.0,
        ip_or_endpoint="10.140.2.10 / core-db.prod.internal",
        cloud_provider="Private Data Center (Tier IV)",
        vulnerabilities_count=4,
        control_coverage_score=0.88
    ),
    Asset(
        id="ASSET-03",
        name="Retail NetBanking & Mobile API Cluster",
        business_unit="Digital Banking",
        asset_type="Kubernetes Microservices Cluster",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=2.8,
        data_classification="PII & Financial",
        hourly_downtime_cost=1200000.0,  # ₹12 Lakhs/hour
        records_count=18000000,
        replacement_cost=25000000.0,
        ip_or_endpoint="netbanking.omnibank.in / EKS-Cluster-01",
        cloud_provider="AWS ap-south-1",
        vulnerabilities_count=5,
        control_coverage_score=0.74
    ),
    Asset(
        id="ASSET-04",
        name="Enterprise Active Directory & IdP (Okta/AD)",
        business_unit="IT Infrastructure & Security",
        asset_type="Identity & Access Management",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=3.0,
        data_classification="Confidential",
        hourly_downtime_cost=800000.0,
        records_count=35000,
        replacement_cost=15000000.0,
        ip_or_endpoint="10.10.1.10 / idp.omnibank.in",
        cloud_provider="Hybrid Azure AD",
        vulnerabilities_count=2,
        control_coverage_score=0.78
    ),
    Asset(
        id="ASSET-05",
        name="SWIFT Interbank Settlement Node",
        business_unit="Global Markets & Treasury",
        asset_type="Secured Appliance / Gateway",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=3.0,
        data_classification="Financial",
        hourly_downtime_cost=3000000.0,  # ₹30 Lakhs/hour
        records_count=500000,
        replacement_cost=40000000.0,
        ip_or_endpoint="10.200.1.5 (Isolated HSM Zone)",
        cloud_provider="On-Premises Dedicated HSM",
        vulnerabilities_count=1,
        control_coverage_score=0.92
    ),
    Asset(
        id="ASSET-06",
        name="Customer 360 Analytics & Data Lake",
        business_unit="Business Intelligence & Risk",
        asset_type="Cloud Data Lake (S3 & Snowflake)",
        criticality="Tier 1 (Mission-Critical)",
        criticality_weight=2.6,
        data_classification="PII & Financial",
        hourly_downtime_cost=600000.0,
        records_count=55000000,
        replacement_cost=30000000.0,
        ip_or_endpoint="s3://omnibank-datalake-prod-vault",
        cloud_provider="AWS",
        vulnerabilities_count=6,
        control_coverage_score=0.68
    ),
    Asset(
        id="ASSET-07",
        name="Loan Origination & Credit Underwriting",
        business_unit="Retail Lending",
        asset_type="Web Application & AI Model Server",
        criticality="Tier 2 (Business-Critical)",
        criticality_weight=2.0,
        data_classification="Financial",
        hourly_downtime_cost=450000.0,
        records_count=6500000,
        replacement_cost=12000000.0,
        ip_or_endpoint="credit.omnibank.in",
        cloud_provider="GCP",
        vulnerabilities_count=4,
        control_coverage_score=0.71
    ),
    Asset(
        id="ASSET-08",
        name="Wealth & Securities Trading Portal",
        business_unit="Capital Markets",
        asset_type="High-Frequency Web & WebSocket Engine",
        criticality="Tier 2 (Business-Critical)",
        criticality_weight=2.2,
        data_classification="Financial",
        hourly_downtime_cost=900000.0,
        records_count=2800000,
        replacement_cost=18000000.0,
        ip_or_endpoint="trade.omnicapital.in",
        cloud_provider="AWS",
        vulnerabilities_count=3,
        control_coverage_score=0.80
    ),
    Asset(
        id="ASSET-09",
        name="Partner Open-Banking API Gateway",
        business_unit="FinTech Partnerships",
        asset_type="API Gateway (Kong / Apigee)",
        criticality="Tier 2 (Business-Critical)",
        criticality_weight=2.1,
        data_classification="Financial",
        hourly_downtime_cost=550000.0,
        records_count=12000000,
        replacement_cost=10000000.0,
        ip_or_endpoint="api.partner.omnibank.in",
        cloud_provider="AWS",
        vulnerabilities_count=4,
        control_coverage_score=0.75
    ),
    Asset(
        id="ASSET-10",
        name="Corporate HR & Employee Intranet",
        business_unit="Human Resources & Admin",
        asset_type="SaaS / Web Application",
        criticality="Tier 3 (Support)",
        criticality_weight=1.2,
        data_classification="PII",
        hourly_downtime_cost=120000.0,
        records_count=25000,
        replacement_cost=4000000.0,
        ip_or_endpoint="people.omnibank.in",
        cloud_provider="Azure",
        vulnerabilities_count=2,
        control_coverage_score=0.85
    ),
    Asset(
        id="ASSET-11",
        name="Customer Care CRM & Telephony Gateway",
        business_unit="Customer Support",
        asset_type="CRM Web Application & VoIP",
        criticality="Tier 3 (Support)",
        criticality_weight=1.3,
        data_classification="PII",
        hourly_downtime_cost=200000.0,
        records_count=8000000,
        replacement_cost=6000000.0,
        ip_or_endpoint="support.omnibank.in",
        cloud_provider="AWS",
        vulnerabilities_count=3,
        control_coverage_score=0.72
    ),
    Asset(
        id="ASSET-12",
        name="Internal CI/CD & Build Pipeline (Jenkins/GitLab)",
        business_unit="DevSecOps & Engineering",
        asset_type="Build & Deployment Infrastructure",
        criticality="Tier 3 (Support)",
        criticality_weight=1.5,
        data_classification="Confidential",
        hourly_downtime_cost=280000.0,
        records_count=5000,
        replacement_cost=5000000.0,
        ip_or_endpoint="10.50.4.15 / gitlab.internal",
        cloud_provider="Private Cloud",
        vulnerabilities_count=5,
        control_coverage_score=0.64
    ),
]

# Vulnerability Register with CVSS & EPSS
SAMPLE_VULNERABILITIES: List[Vulnerability] = [
    Vulnerability(
        id="VULN-001",
        cve_id="CVE-2024-38063",
        title="Windows TCP/IP Remote Code Execution",
        severity="Critical",
        cvss_score=9.8,
        epss_score=0.88,
        affected_asset_id="ASSET-04",
        affected_asset_name="Enterprise Active Directory & IdP",
        exploit_available=True,
        in_cisa_kev=True,
        remediation_status="Open",
        remediation_cost=450000.0,
        days_open=12
    ),
    Vulnerability(
        id="VULN-002",
        cve_id="CVE-2023-44487",
        title="HTTP/2 Rapid Reset Denial of Service",
        severity="High",
        cvss_score=7.5,
        epss_score=0.91,
        affected_asset_id="ASSET-01",
        affected_asset_name="UPI Real-time Payment Switch",
        exploit_available=True,
        in_cisa_kev=True,
        remediation_status="Open",
        remediation_cost=300000.0,
        days_open=48
    ),
    Vulnerability(
        id="VULN-003",
        cve_id="CVE-2024-21626",
        title="runc Container Breakout via File Descriptor Leak",
        severity="Critical",
        cvss_score=8.6,
        epss_score=0.74,
        affected_asset_id="ASSET-03",
        affected_asset_name="Retail NetBanking & Mobile API Cluster",
        exploit_available=True,
        in_cisa_kev=False,
        remediation_status="Open",
        remediation_cost=600000.0,
        days_open=21
    ),
    Vulnerability(
        id="VULN-004",
        cve_id="CVE-2023-38606",
        title="Oracle Finacle Core Banking Injection Vulnerability",
        severity="Critical",
        cvss_score=9.1,
        epss_score=0.45,
        affected_asset_id="ASSET-02",
        affected_asset_name="Core Banking Transaction Engine",
        exploit_available=False,
        in_cisa_kev=False,
        remediation_status="In Progress",
        remediation_cost=1200000.0,
        days_open=35
    ),
    Vulnerability(
        id="VULN-005",
        cve_id="CVE-2024-27351",
        title="AWS S3 Bucket Wildcard IAM Policy Misconfiguration",
        severity="High",
        cvss_score=8.2,
        epss_score=0.62,
        affected_asset_id="ASSET-06",
        affected_asset_name="Customer 360 Analytics & Data Lake",
        exploit_available=True,
        in_cisa_kev=False,
        remediation_status="Open",
        remediation_cost=250000.0,
        days_open=19
    ),
    Vulnerability(
        id="VULN-006",
        cve_id="CVE-2024-23897",
        title="Jenkins CLI Arbitrary File Read (RCE vector)",
        severity="Critical",
        cvss_score=9.8,
        epss_score=0.94,
        affected_asset_id="ASSET-12",
        affected_asset_name="Internal CI/CD & Build Pipeline",
        exploit_available=True,
        in_cisa_kev=True,
        remediation_status="Open",
        remediation_cost=200000.0,
        days_open=64
    ),
    Vulnerability(
        id="VULN-007",
        cve_id="CVE-2024-4577",
        title="PHP-CGI Argument Injection RCE",
        severity="Critical",
        cvss_score=9.8,
        epss_score=0.89,
        affected_asset_id="ASSET-09",
        affected_asset_name="Partner Open-Banking API Gateway",
        exploit_available=True,
        in_cisa_kev=True,
        remediation_status="Open",
        remediation_cost=350000.0,
        days_open=14
    ),
    Vulnerability(
        id="VULN-008",
        cve_id="CVE-2023-48795",
        title="Terrapin SSH Protocol Flaw (Prefix Truncation)",
        severity="Medium",
        cvss_score=5.9,
        epss_score=0.18,
        affected_asset_id="ASSET-05",
        affected_asset_name="SWIFT Interbank Settlement Node",
        exploit_available=False,
        in_cisa_kev=False,
        remediation_status="Open",
        remediation_cost=180000.0,
        days_open=80
    ),
    Vulnerability(
        id="VULN-009",
        cve_id="CVE-2024-6387",
        title="regreSSHion OpenSSH Signal Handler RCE",
        severity="High",
        cvss_score=8.1,
        epss_score=0.55,
        affected_asset_id="ASSET-07",
        affected_asset_name="Loan Origination & Credit Underwriting",
        exploit_available=True,
        in_cisa_kev=False,
        remediation_status="Open",
        remediation_cost=400000.0,
        days_open=28
    ),
]

# Security Controls Catalog (for Optimization & Knapsack Solver)
SAMPLE_SECURITY_CONTROLS: List[SecurityControl] = [
    SecurityControl(
        id="CTRL-01",
        name="Phishing-Resistant FIDO2 MFA for Privileged Accounts",
        category="Identity & Access",
        description="Deploy hardware security keys (YubiKeys) and mandatory FIDO2 WebAuthn for all Domain Admins, Cloud Root, and Core Banking operators.",
        implementation_cost=1500000.0,  # ₹15 Lakhs
        annual_operational_cost=300000.0,
        risk_reduction_percentage=28.5,
        framework_mappings={
            "NIST_CSF": ["PR.AC-1", "PR.AC-6"],
            "RBI": ["Annex I - Section 3 (Access Control)", "Section 3.4 (MFA)"],
            "SEBI": ["CSCRF - Parameter 2 (Access Governance)", "Control 2.3"],
            "ISO_27001": ["A.9.4.2", "A.9.4.3"],
            "CIS_CONTROLS": ["CIS 6.3", "CIS 6.5"]
        },
        deployed=False,
        implementation_time_weeks=3
    ),
    SecurityControl(
        id="CTRL-02",
        name="Automated Vulnerability Remediation & Patch SLA Orchestrator",
        category="Vulnerability Mgmt",
        description="Integrate automated patch testing and emergency zero-day patching pipeline to reduce MTTR from 45 days to <72 hours for CISA KEVs.",
        implementation_cost=2200000.0,  # ₹22 Lakhs
        annual_operational_cost=500000.0,
        risk_reduction_percentage=32.0,
        framework_mappings={
            "NIST_CSF": ["PR.IP-12", "ID.RA-1"],
            "RBI": ["Annex I - Section 5 (Patch Management)"],
            "SEBI": ["CSCRF - Parameter 4 (Vulnerability Management)"],
            "ISO_27001": ["A.12.6.1"],
            "CIS_CONTROLS": ["CIS 7.4", "CIS 7.7"]
        },
        deployed=False,
        implementation_time_weeks=4
    ),
    SecurityControl(
        id="CTRL-03",
        name="Next-Gen Cloud Security Posture Management (CSPM & CIEM)",
        category="Cloud Defense",
        description="Continuous real-time posture scanning, least-privilege IAM entitlement enforcement, and automated remediation of public cloud buckets.",
        implementation_cost=1800000.0,  # ₹18 Lakhs
        annual_operational_cost=400000.0,
        risk_reduction_percentage=24.0,
        framework_mappings={
            "NIST_CSF": ["PR.AC-4", "PR.DS-1"],
            "RBI": ["Annex II - Section 2 (Cloud Security Guidelines)"],
            "SEBI": ["CSCRF - Parameter 3 (Cloud Data Protection)"],
            "ISO_27001": ["A.13.1.3", "A.18.1.3"],
            "CIS_CONTROLS": ["CIS 3.3", "CIS 12.2"]
        },
        deployed=False,
        implementation_time_weeks=3
    ),
    SecurityControl(
        id="CTRL-04",
        name="Micro-segmentation & Zero Trust Network Isolation for SWIFT/Core",
        category="Network",
        description="Implement software-defined host microsegmentation isolating SWIFT and Core Banking switches from corporate intranet and staging networks.",
        implementation_cost=3500000.0,  # ₹35 Lakhs
        annual_operational_cost=600000.0,
        risk_reduction_percentage=38.0,
        framework_mappings={
            "NIST_CSF": ["PR.AC-5", "PR.PT-4"],
            "RBI": ["Annex I - Section 4 (Network Security & SWIFT Isolation)"],
            "SEBI": ["CSCRF - Parameter 5 (Network Perimeter & Segmentation)"],
            "ISO_27001": ["A.13.1.1", "A.13.1.2"],
            "CIS_CONTROLS": ["CIS 12.1", "CIS 13.4"]
        },
        deployed=False,
        implementation_time_weeks=6
    ),
    SecurityControl(
        id="CTRL-05",
        name="24x7 AI-Powered Managed SOC & MDR (Extended EDR Coverage)",
        category="Detection",
        description="Expand behavioral EDR with 24x7 threat hunting, memory inspection, and automated endpoint isolation across 100% of servers.",
        implementation_cost=4000000.0,  # ₹40 Lakhs
        annual_operational_cost=1200000.0,
        risk_reduction_percentage=35.5,
        framework_mappings={
            "NIST_CSF": ["DE.AE-1", "DE.CM-1", "RS.RP-1"],
            "RBI": ["Annex I - Section 8 (Cyber SOC & Incident Response)"],
            "SEBI": ["CSCRF - Parameter 6 (Continuous Monitoring & SOC)"],
            "ISO_27001": ["A.12.4.1", "A.16.1.2"],
            "CIS_CONTROLS": ["CIS 8.5", "CIS 10.1"]
        },
        deployed=False,
        implementation_time_weeks=5
    ),
    SecurityControl(
        id="CTRL-06",
        name="API Threat Shield & Bot Mitigation for Payment Gateway",
        category="Application Defense",
        description="Deploy inline AI API behavioral inspection, OAuth token hijacking prevention, and volumetric DDoS shield on UPI endpoints.",
        implementation_cost=2500000.0,  # ₹25 Lakhs
        annual_operational_cost=450000.0,
        risk_reduction_percentage=26.0,
        framework_mappings={
            "NIST_CSF": ["PR.DS-5", "DE.CM-7"],
            "RBI": ["Annex I - Section 7 (Application Security & API Controls)"],
            "SEBI": ["CSCRF - Parameter 7 (API Security Standards)"],
            "ISO_27001": ["A.14.2.5"],
            "CIS_CONTROLS": ["CIS 16.1", "CIS 16.4"]
        },
        deployed=False,
        implementation_time_weeks=3
    ),
    SecurityControl(
        id="CTRL-07",
        name="Immutable Air-Gapped Ransomware Backups & Rapid Recovery",
        category="Recovery & Resilience",
        description="WORM (Write Once Read Many) cloud object storage with cryptographic immutability and automated 2-hour failover verification for Core DB.",
        implementation_cost=2800000.0,  # ₹28 Lakhs
        annual_operational_cost=550000.0,
        risk_reduction_percentage=29.0,
        framework_mappings={
            "NIST_CSF": ["RC.RP-1", "PR.IP-4"],
            "RBI": ["Annex I - Section 10 (Disaster Recovery & Backup Management)"],
            "SEBI": ["CSCRF - Parameter 8 (Business Continuity & Cyber Resilience)"],
            "ISO_27001": ["A.12.3.1", "A.17.1.1"],
            "CIS_CONTROLS": ["CIS 11.1", "CIS 11.4"]
        },
        deployed=False,
        implementation_time_weeks=4
    ),
    SecurityControl(
        id="CTRL-08",
        name="Data Loss Prevention (DLP) & Tokenization for PII/Cardholder Data",
        category="Data Protection",
        description="Format-preserving encryption and inline DLP sensors preventing exfiltration of customer account numbers and Aadhaar/PAN data.",
        implementation_cost=2000000.0,  # ₹20 Lakhs
        annual_operational_cost=380000.0,
        risk_reduction_percentage=22.0,
        framework_mappings={
            "NIST_CSF": ["PR.DS-1", "PR.DS-2"],
            "RBI": ["Annex I - Section 6 (Customer Data Protection & Privacy)"],
            "SEBI": ["CSCRF - Parameter 3 (Data Classification & Masking)"],
            "ISO_27001": ["A.8.2.1", "A.10.1.1"],
            "CIS_CONTROLS": ["CIS 3.1", "CIS 3.4"]
        },
        deployed=False,
        implementation_time_weeks=4
    ),
]

# Telemetry Streams
SAMPLE_TELEMETRY: List[TelemetryEvent] = [
    TelemetryEvent(
        id="TEL-001",
        source="SIEM (Elastic/Sentinel)",
        severity="High",
        event_type="Excessive Failed Logins / Password Spray",
        description="1,420 failed authentication attempts from 3 external IP subnets targeting Domain Controller admin accounts.",
        asset_id="ASSET-04",
        timestamp="2026-09-14T17:42:10Z",
        metric_value=1420.0
    ),
    TelemetryEvent(
        id="TEL-002",
        source="EDR (CrowdStrike)",
        severity="Critical",
        event_type="Suspicious PowerShell Process Spawning",
        description="Unsigned script execution attempting LSASS memory dump detected on Staging Jenkins worker.",
        asset_id="ASSET-12",
        timestamp="2026-09-14T17:35:04Z",
        metric_value=95.0
    ),
    TelemetryEvent(
        id="TEL-003",
        source="CSPM (AWS Security Hub)",
        severity="High",
        event_type="S3 Public Access Block Disabled",
        description="Bucket 'omnibank-datalake-prod-vault' has permissive IAM cross-account access policy attached.",
        asset_id="ASSET-06",
        timestamp="2026-09-14T16:15:22Z",
        metric_value=85.0
    ),
    TelemetryEvent(
        id="TEL-004",
        source="VulnScanner (Tenable)",
        severity="Critical",
        event_type="Active Zero-Day CISA KEV Match",
        description="Host running vulnerable HTTP/2 stack susceptible to rapid reset denial of service.",
        asset_id="ASSET-01",
        timestamp="2026-09-14T15:00:00Z",
        metric_value=9.8
    ),
    TelemetryEvent(
        id="TEL-005",
        source="IAM Audit (Okta)",
        severity="Medium",
        event_type="Privileged Accounts Missing MFA",
        description="14 system administrator accounts do not have hardware token MFA enforced.",
        asset_id="ASSET-04",
        timestamp="2026-09-14T14:20:00Z",
        metric_value=14.0
    ),
]
