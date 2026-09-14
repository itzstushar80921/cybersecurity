from typing import List, Dict, Any
from ..models.schemas import ComplianceItem, FrameworkScore, SecurityControl

class ComplianceCrosswalkEngine:
    """
    Automated Regulatory & Framework Compliance Crosswalk Engine.
    Evaluates security posture and telemetry against:
      - RBI Cyber Security Framework (Annex I & II)
      - SEBI CSCRF (Cybersecurity and Cyber Resilience Framework)
      - NIST Cybersecurity Framework 2.0
      - ISO/IEC 27001:2022
      - CIS Controls v8
    Ties non-compliance gaps directly to quantified financial exposure.
    """

    @classmethod
    def get_compliance_register(cls, deployed_control_ids: List[str] = None) -> List[ComplianceItem]:
        deployed_ids = set(deployed_control_ids or [])
        
        items = [
            # RBI Cyber Security Framework
            ComplianceItem(
                control_id="RBI-CSF-01",
                framework="RBI Cyber Security Framework",
                title="Mandatory Multi-Factor Authentication (MFA) for Administrative Access",
                category="Access Control & Identity (Annex I)",
                status="Compliant" if "CTRL-01" in deployed_ids else "Non-Compliant",
                score_percentage=100.0 if "CTRL-01" in deployed_ids else 35.0,
                associated_risk_inr=14500000.0 if "CTRL-01" not in deployed_ids else 0.0,
                evidence_telemetry="IAM Audit: 14 domain/system admin accounts still lack FIDO2 hardware token enforcement.",
                remediation_action="Deploy Phishing-Resistant FIDO2 WebAuthn keys for all privileged admins."
            ),
            ComplianceItem(
                control_id="RBI-CSF-02",
                framework="RBI Cyber Security Framework",
                title="Isolation of SWIFT Infrastructure & Database Micro-segmentation",
                category="Network Security (Annex I - Sec 4)",
                status="Compliant" if "CTRL-04" in deployed_ids else "Non-Compliant",
                score_percentage=100.0 if "CTRL-04" in deployed_ids else 40.0,
                associated_risk_inr=22000000.0 if "CTRL-04" not in deployed_ids else 0.0,
                evidence_telemetry="VLAN audit shows SWIFT terminal shares routing gateway with corporate testing subnets.",
                remediation_action="Enforce Zero Trust microsegmentation and air-gapped HSM network boundary."
            ),
            ComplianceItem(
                control_id="RBI-CSF-03",
                framework="RBI Cyber Security Framework",
                title="Continuous 24x7 Cyber SOC and Real-time Incident Telemetry",
                category="Continuous Monitoring & SOC (Annex I - Sec 8)",
                status="Compliant" if "CTRL-05" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-05" in deployed_ids else 68.0,
                associated_risk_inr=11000000.0 if "CTRL-05" not in deployed_ids else 0.0,
                evidence_telemetry="EDR coverage is 76% across enterprise servers; staging workers lack automated containment.",
                remediation_action="Expand AI-powered Managed SOC & MDR to 100% of internal & cloud hosts."
            ),
            ComplianceItem(
                control_id="RBI-CSF-04",
                framework="RBI Cyber Security Framework",
                title="Patch Management SLA for High & Critical Vulnerabilities",
                category="Vulnerability Management (Annex I - Sec 5)",
                status="Compliant" if "CTRL-02" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-02" in deployed_ids else 55.0,
                associated_risk_inr=18500000.0 if "CTRL-02" not in deployed_ids else 0.0,
                evidence_telemetry="Mean Time to Remediate (MTTR) for CISA KEV CVEs currently averages 38 days vs RBI 72-hr target.",
                remediation_action="Implement automated patch orchestrator and emergency change advisory pipeline."
            ),

            # SEBI CSCRF
            ComplianceItem(
                control_id="SEBI-CSCRF-01",
                framework="SEBI CSCRF",
                title="Continuous Cloud Posture Management & Least Privilege Entitlements",
                category="Parameter 3 (Cloud Data Protection)",
                status="Compliant" if "CTRL-03" in deployed_ids else "Non-Compliant",
                score_percentage=100.0 if "CTRL-03" in deployed_ids else 45.0,
                associated_risk_inr=16000000.0 if "CTRL-03" not in deployed_ids else 0.0,
                evidence_telemetry="CSPM detected S3 bucket 'omnibank-datalake-prod-vault' with wildcard cross-account IAM role.",
                remediation_action="Deploy Next-Gen CSPM & CIEM with auto-remediation policies."
            ),
            ComplianceItem(
                control_id="SEBI-CSCRF-02",
                framework="SEBI CSCRF",
                title="API Security Standards & Rate-Limiting for Trading/Payment Endpoints",
                category="Parameter 7 (API Security)",
                status="Compliant" if "CTRL-06" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-06" in deployed_ids else 60.0,
                associated_risk_inr=13500000.0 if "CTRL-06" not in deployed_ids else 0.0,
                evidence_telemetry="HTTP/2 Rapid Reset vulnerability (CVE-2023-44487) active on public UPI gateway node.",
                remediation_action="Deploy inline AI API threat shield and volumetric DDoS protection."
            ),
            ComplianceItem(
                control_id="SEBI-CSCRF-03",
                framework="SEBI CSCRF",
                title="Air-Gapped Immutable Backups & Cyber Recovery Drills",
                category="Parameter 8 (Cyber Resilience & Disaster Recovery)",
                status="Compliant" if "CTRL-07" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-07" in deployed_ids else 58.0,
                associated_risk_inr=19000000.0 if "CTRL-07" not in deployed_ids else 0.0,
                evidence_telemetry="Backups for Core DB are replicated but lack WORM cryptographic immutability against ransomware.",
                remediation_action="Implement immutable air-gapped cloud storage with automated 2-hr failover drills."
            ),

            # NIST CSF 2.0
            ComplianceItem(
                control_id="NIST-PR.AC-1",
                framework="NIST Cybersecurity Framework 2.0",
                title="Identities and Credentials Management (PR.AC-1)",
                category="Protect (PR)",
                status="Compliant" if "CTRL-01" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-01" in deployed_ids else 65.0,
                associated_risk_inr=12000000.0 if "CTRL-01" not in deployed_ids else 0.0,
                evidence_telemetry="Password spray detection on Active Directory without automated step-up MFA.",
                remediation_action="Enforce continuous conditional access and FIDO2 authentication."
            ),
            ComplianceItem(
                control_id="NIST-PR.DS-1",
                framework="NIST Cybersecurity Framework 2.0",
                title="Data-at-Rest & In-Transit Cryptographic Protection (PR.DS-1)",
                category="Protect (PR)",
                status="Compliant" if "CTRL-08" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-08" in deployed_ids else 62.0,
                associated_risk_inr=15000000.0 if "CTRL-08" not in deployed_ids else 0.0,
                evidence_telemetry="Unencrypted PII discovered in transient analytics tables.",
                remediation_action="Implement format-preserving tokenization and inline DLP."
            ),
            ComplianceItem(
                control_id="NIST-DE.AE-1",
                framework="NIST Cybersecurity Framework 2.0",
                title="Anomalies and Events Detection Baseline (DE.AE-1)",
                category="Detect (DE)",
                status="Compliant" if "CTRL-05" in deployed_ids else "Compliant",
                score_percentage=100.0 if "CTRL-05" in deployed_ids else 78.0,
                associated_risk_inr=6000000.0 if "CTRL-05" not in deployed_ids else 0.0,
                evidence_telemetry="SIEM correlates 85% of perimeter syslogs; endpoint process memory telemetry incomplete.",
                remediation_action="Integrate EDR endpoint memory analysis with central SIEM."
            ),

            # ISO/IEC 27001:2022
            ComplianceItem(
                control_id="ISO-A.9.4.2",
                framework="ISO/IEC 27001:2022",
                title="Secure Log-on Procedures (Annex A.9.4.2)",
                category="Access Control",
                status="Compliant" if "CTRL-01" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-01" in deployed_ids else 70.0,
                associated_risk_inr=9500000.0 if "CTRL-01" not in deployed_ids else 0.0,
                evidence_telemetry="Privileged accounts accept SMS OTP fallback susceptible to SIM swap.",
                remediation_action="Eliminate SMS OTP for administrative portals; enforce hardware tokens."
            ),
            ComplianceItem(
                control_id="ISO-A.12.6.1",
                framework="ISO/IEC 27001:2022",
                title="Management of Technical Vulnerabilities (Annex A.12.6.1)",
                category="Operations Security",
                status="Compliant" if "CTRL-02" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-02" in deployed_ids else 58.0,
                associated_risk_inr=14000000.0 if "CTRL-02" not in deployed_ids else 0.0,
                evidence_telemetry="5 critical RCE vulnerabilities open for >20 days across production clusters.",
                remediation_action="Enforce weekly automated patching cycle and automated regression verification."
            ),

            # CIS Controls v8
            ComplianceItem(
                control_id="CIS-3.3",
                framework="CIS Controls v8",
                title="Configure Data Access Control Lists (CIS 3.3)",
                category="Data Protection",
                status="Compliant" if "CTRL-03" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-03" in deployed_ids else 64.0,
                associated_risk_inr=8000000.0 if "CTRL-03" not in deployed_ids else 0.0,
                evidence_telemetry="Over-permissioned cloud service account keys detected in production environment.",
                remediation_action="Audit and prune stale IAM roles using automated CIEM scanner."
            ),
            ComplianceItem(
                control_id="CIS-6.3",
                framework="CIS Controls v8",
                title="Require MFA for Externally-Exposed Applications (CIS 6.3)",
                category="Access Control Management",
                status="Compliant" if "CTRL-01" in deployed_ids else "Partially Compliant",
                score_percentage=100.0 if "CTRL-01" in deployed_ids else 72.0,
                associated_risk_inr=11000000.0 if "CTRL-01" not in deployed_ids else 0.0,
                evidence_telemetry="External staging web console accessed with single-factor password.",
                remediation_action="Place all external consoles behind Zero Trust Identity-Aware Proxy."
            ),
        ]
        return items

    @classmethod
    def get_framework_scores(cls, deployed_control_ids: List[str] = None) -> List[FrameworkScore]:
        items = cls.get_compliance_register(deployed_control_ids)
        framework_groups: Dict[str, List[ComplianceItem]] = {}
        
        for item in items:
            framework_groups.setdefault(item.framework, []).append(item)
            
        scores: List[FrameworkScore] = []
        for fw_name, fw_items in framework_groups.items():
            total = len(fw_items)
            compliant = sum(1 for x in fw_items if x.status == "Compliant")
            gaps = total - compliant
            overall_pct = sum(x.score_percentage for x in fw_items) / total
            financial_gap = sum(x.associated_risk_inr for x in fw_items)
            
            # Category level breakdowns
            cat_scores: Dict[str, float] = {}
            cat_counts: Dict[str, int] = {}
            for x in fw_items:
                cat_scores[x.category] = cat_scores.get(x.category, 0.0) + x.score_percentage
                cat_counts[x.category] = cat_counts.get(x.category, 0) + 1
            for cat in cat_scores:
                cat_scores[cat] = round(cat_scores[cat] / cat_counts[cat], 1)

            scores.append(
                FrameworkScore(
                    framework_name=fw_name,
                    overall_compliance_percentage=round(overall_pct, 1),
                    total_controls=total,
                    compliant_count=compliant,
                    gap_count=gaps,
                    financial_exposure_from_gaps=round(financial_gap, 2),
                    category_scores=cat_scores
                )
            )

        return scores
