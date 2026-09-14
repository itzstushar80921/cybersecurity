# CyberQuant-AI™: Continuous Cyber Risk Quantification & Investment Optimization Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![OpenFAIR Compliant](https://img.shields.io/badge/Standard-OpenFAIR%20ISO%2FIEC%2027005-orange.svg)](https://www.opengroup.org/certifications/risk-analysis)
[![Regulatory Frameworks](https://img.shields.io/badge/Compliance-RBI%20%7C%20SEBI%20CSCRF%20%7C%20NIST%20CSF%20%7C%20ISO%2027001-green.svg)](#compliance-framework-crosswalk)

---

## 📌 Executive Overview

In enterprise cybersecurity, risk is predominantly communicated in coarse qualitative terms: *"Low"*, *"Medium"*, or *"High"*. These subjective categories fail to express the **financial impact** of cyber threats, paralyzing boards, CISOs, and risk committees when deciding how to allocate limited security budgets.

**CyberQuant-AI™** solves this problem by providing an autonomous, cloud-ready cyber risk quantification and capital optimization platform that:
1. **Continuously quantifies cyber risk in monetary terms** (Expected Annual Loss, 95% Value at Risk) by correlating real-time technical security telemetry (Vulnerability scanners, SIEM, IAM, EDR, CSPM) with business asset criticality and control effectiveness.
2. **Optimizes security investments under explicit budget constraints** using a 0/1 Knapsack optimization algorithm to maximize annualized risk reduction ($\Delta \text{ALE}$) and compute Return on Security Investment (ROSI).
3. **Simulates "What-If" scenarios** (e.g., impact of postponing patch remediation by 30 days, or enforcing FIDO2 MFA on privileged accounts).
4. **Delivers built-in crosswalks to Indian and Global frameworks**:
   - **RBI Cyber Security Framework** (Annex I & II for Commercial Banks/NBFCs)
   - **SEBI CSCRF** (Cybersecurity and Cyber Resilience Framework for Regulated Entities)
   - **NIST Cybersecurity Framework 2.0**
   - **ISO/IEC 27001:2022**
   - **CIS Critical Security Controls v8**
5. **Empowers non-technical board members** with an interactive **AI Risk Copilot** and one-click printable Board Audit Reports.

---

## 🏗️ Architecture & Mathematical Foundation

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA TELEMETRY INGESTION                        │
│  [CVE / EPSS Scans]   [SIEM Alerts]   [EDR Agents]   [CSPM Findings]   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FAIR QUANTIFICATION ENGINE                         │
│  • Threat Event Frequency (TEF): Poisson Modeling                      │
│  • Vulnerability Susceptibility (VUL): CVSS v3.1 + EPSS + Controls     │
│  • Loss Magnitude (LM): Primary (Downtime/IR) + Secondary (Fines/Loss) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MONTE CARLO STOCHASTIC SIMULATOR                     │
│  • 10,000 Stochastic Iterations                                        │
│  • Computes: EAL (Expected Annual Loss), VaR 95%, VaR 99%, CVaR        │
│  • Loss Exceedance Probability Curve (P(Loss > X))                     │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌─────────────────────────────────────┐  ┌───────────────────────────────┐
│     0/1 KNAPSACK OPTIMIZER          │  │     REGULATORY CROSSWALK      │
│  • Maximize: Σ (ΔEAL_i)             │  │  • RBI Cyber Security         │
│  • Subject to: Σ (Cost_i) <= Budget │  │  • SEBI CSCRF                 │
│  • Pareto Spend Frontier & ROSI %   │  │  • NIST CSF 2.0 | ISO 27001   │
└───────────────────┬─────────────────┘  └───────────────┬───────────────┘
                    │                                    │
                    └─────────────────┬──────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 EXECUTIVE CISO DASHBOARD & AI COPILOT                  │
│  • Dual Currency: INR (₹ Lakhs/Crores) & USD ($)                       │
│  • What-If Threat Simulator & Printable Board Audit Report             │
└────────────────────────────────────────────────────────────────────────┘
```

### Mathematical Formulas

#### 1. OpenFAIR Loss Modeling
- **Loss Event Frequency (LEF)**:
  $$\text{LEF} = \text{TEF} \times \text{VUL}$$
- **Vulnerability Probability (VUL)**:
  $$\text{VUL} = \left[ 1 - \prod_{i} (1 - P_i) \right] \times \text{Aging\_Factor} \times (1 - 0.75 \times \text{Control\_Score})$$
  *where $P_i = 0.4 \times \frac{\text{CVSS}}{10} + 0.6 \times \text{EPSS}$*.

#### 2. Loss Magnitude Decomposition
$$\text{Loss Magnitude} = \text{Primary Loss} + \text{Secondary Loss}$$
- **Primary Loss**: $(\text{Downtime Hours} \times \text{Hourly Revenue Loss}) + \text{Incident Response/Triage}$
- **Secondary Loss**: $\text{Statutory Fines (RBI/SEBI/DPDP)} + \text{Customer Churn} + \text{Legal Defense}$

#### 3. 0/1 Knapsack Investment Optimization
Given candidate controls $i \in \{1, \dots, n\}$, implementation cost $C_i$, and risk reduction $\Delta \text{EAL}_i$:
$$\max \sum_{i=1}^{n} x_i \cdot \Delta \text{EAL}_i \quad \text{s.t.} \quad \sum_{i=1}^{n} x_i \cdot C_i \le \text{Budget}, \quad x_i \in \{0, 1\}$$

#### 4. Return on Security Investment (ROSI)
$$\text{ROSI} = \frac{\Delta \text{ALE} - \text{Solution Cost}}{\text{Solution Cost}} \times 100\%$$

---

## 🚀 Quick Start & Launch Instructions

### Option 1: One-Click Launch (Recommended)
Double-click:
```bash
start_all.bat
```
This automatically launches both the FastAPI backend and the React frontend in separate windows.

### Option 2: Manual Start

#### 1. Start Backend:
```bash
cd backend
..\venv\Scripts\python.exe run.py
```
- Server URL: `http://127.0.0.1:8000`
- Interactive OpenAPI / Swagger Docs: `http://127.0.0.1:8000/docs`

#### 2. Start Frontend:
```bash
cd frontend
npm run dev
```
- Dashboard URL: `http://localhost:5173`

---

## 🧪 Verification & Automated Testing

To run the full unit test suite:
```bash
cd backend
..\venv\Scripts\python.exe -m unittest tests.test_risk_engine
```
Tests verify:
- FAIR TEF and vulnerability probability calculations
- Monte Carlo convergence, 95% VaR, 99% VaR, and Loss Exceedance distributions
- 0/1 Knapsack optimizer budget enforcement and ROSI calculations
- Multi-framework compliance scoring (RBI, SEBI, NIST, ISO, CIS)
- AI Risk Copilot natural language processing and metric referencing

---

## 📊 Core Platform Features

| Tab | Feature | Description |
|---|---|---|
| **Executive Overview** | CISO Financial KPIs | Expected Annual Loss (EAL), 95% VaR, CVaR, Posture Score (0-100), 6-month exposure trend, and loss breakdown. |
| **FAIR Monte Carlo** | Stochastic Engine | Run 10,000 stochastic trials, visualize the Loss Exceedance Curve (P(Loss > X)), inspect the 12-asset criticality matrix, and stream live security telemetry. |
| **Capital Optimizer** | 0/1 Knapsack Solver | Dynamic budget slider (₹10 Lakhs to ₹2 Crores), Spend vs. Risk Reduction Pareto frontier curve, ROSI calculations, and recommended control packages. |
| **What-If Simulator** | Threat & Policy Modeling | Interactive sliders to model patch remediation delays (0-90 days), privileged MFA enforcement, and targeted ransomware outbreaks. |
| **Regulatory Matrix** | Compliance Crosswalk | Live mapping to RBI Cyber Security Framework, SEBI CSCRF, NIST CSF 2.0, ISO 27001, and CIS Controls v8 with gap risk quantifications. |
| **AI Risk Copilot** | Natural Language Q&A | Context-aware CISO AI Copilot that translates complex telemetry into board-level monetary answers and strategic follow-ups. |
| **Board Audit Report** | One-Click PDF/Print | Audit-ready, boardroom-presentable executive summary document with sign-off blocks and strategic recommendations. |

---

## 🔒 Regulated Entity Sample Dataset

Pre-loaded with a realistic financial enterprise model (**OmniBank & Capital Ltd.**):
- **12 Assets**: UPI Real-time Payment Switch, Core Banking Finacle Engine, NetBanking Microservices, Active Directory IdP, SWIFT Settlement Node, Customer Financial Data Lake, etc.
- **Active CVEs**: Windows TCP/IP RCE (CVE-2024-38063), HTTP/2 Rapid Reset (CVE-2023-44487), runc breakout (CVE-2024-21626), Jenkins RCE (CVE-2024-23897), and more.
- **Candidate Controls**: FIDO2 MFA, Automated Patch Orchestrator, Next-Gen CSPM, Zero Trust Micro-segmentation, AI MDR SOC, API Shield, Immutable Backups, and DLP.
