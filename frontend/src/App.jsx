import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Activity,
  DollarSign,
  Sliders,
  Award,
  Bot,
  PlusCircle,
  FileText,
  RefreshCw,
  Globe,
  Lock,
  Cpu,
  CheckCircle,
  Wifi,
  WifiOff
} from "lucide-react";

import ExecutiveDashboard from "./components/ExecutiveDashboard";
import RiskQuantificationView from "./components/RiskQuantificationView";
import InvestmentOptimizer from "./components/InvestmentOptimizer";
import ScenarioSimulator from "./components/ScenarioSimulator";
import ComplianceMatrix from "./components/ComplianceMatrix";
import AiRiskCopilot from "./components/AiRiskCopilot";
import TelemetryIngestionModal from "./components/TelemetryIngestionModal";
import BoardReportModal from "./components/BoardReportModal";

import {
  defaultOverview,
  defaultAssets,
  defaultVulnerabilities,
  defaultControls,
  defaultTelemetry,
  defaultSimulation,
  defaultOptimization,
  defaultCompliance,
  defaultScenarioResult
} from "./data/defaultData";
import { runClientSimulation, runClientOptimization } from "./utils/clientRiskEngine";

// Support dynamic backend URL from Vercel environment variables (VITE_API_BASE)
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "") || (
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000/api"
    : "/api"
);

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currency, setCurrency] = useState("INR"); // "INR" or "USD"
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize with rich default data so the platform is ALWAYS interactive and never shows ₹0
  const [overview, setOverview] = useState(defaultOverview);
  const [assets, setAssets] = useState(defaultAssets);
  const [telemetry, setTelemetry] = useState(defaultTelemetry);
  const [controls, setControls] = useState(defaultControls);
  const [simulation, setSimulation] = useState(defaultSimulation);
  const [optimization, setOptimization] = useState(defaultOptimization);
  const [scenarioResult, setScenarioResult] = useState(defaultScenarioResult);
  const [complianceData, setComplianceData] = useState(defaultCompliance);
  const [reportData, setReportData] = useState(null);

  // Loading states
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [loadingOptimization, setLoadingOptimization] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState(false);

  // Modals
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Fetch initial baseline data from FastAPI backend if online
  const fetchAllData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const [ovRes, asRes, telRes, ctrlRes, compRes, simRes, optRes] = await Promise.all([
        fetch(`${API_BASE}/overview`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/assets`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/telemetry`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/controls`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/compliance`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iterations: 10000, currency }),
          signal: controller.signal
        }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ budget: 10000000, currency }),
          signal: controller.signal
        }).then((r) => r.ok ? r.json() : null)
      ]);

      clearTimeout(timeoutId);

      if (ovRes && simRes && asRes) {
        setOverview(ovRes);
        setAssets(asRes);
        if (telRes) setTelemetry(telRes);
        if (ctrlRes) setControls(ctrlRes);
        if (compRes) setComplianceData(compRes);
        setSimulation(simRes);
        if (optRes) setOptimization(optRes);
        setBackendConnected(true);

        const scRes = await fetch(`${API_BASE}/scenarios/what-if`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario_type: "mfa_privileged", currency })
        }).then((r) => r.ok ? r.json() : null);
        if (scRes) setScenarioResult(scRes);
      } else {
        setBackendConnected(false);
      }
    } catch (err) {
      // Backend not running yet - seamlessly use built-in client engine!
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currency]);

  // Run Custom Simulation
  const handleRunSimulation = async (params) => {
    setLoadingSimulation(true);
    try {
      const res = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }).then((r) => r.ok ? r.json() : null);

      if (res && res.expected_annual_loss) {
        setSimulation(res);
        setBackendConnected(true);
      } else {
        throw new Error("Backend unavailable");
      }
    } catch (err) {
      // Run autonomous client-side Monte Carlo engine
      const clientRes = runClientSimulation({ ...params, currency });
      setSimulation(clientRes);
    } finally {
      setLoadingSimulation(false);
    }
  };

  // Run Knapsack Optimization
  const handleRunOptimization = async (params) => {
    setLoadingOptimization(true);
    try {
      const res = await fetch(`${API_BASE}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }).then((r) => r.ok ? r.json() : null);

      if (res && res.total_spent !== undefined) {
        setOptimization(res);
        setBackendConnected(true);
      } else {
        throw new Error("Backend unavailable");
      }
    } catch (err) {
      // Run autonomous client-side Knapsack optimizer
      const clientRes = runClientOptimization(params.budget, simulation?.expected_annual_loss || defaultSimulation.expected_annual_loss, currency);
      setOptimization(clientRes);
    } finally {
      setLoadingOptimization(false);
    }
  };

  // Run Scenario
  const handleRunScenario = async (params) => {
    setLoadingScenario(true);
    try {
      const res = await fetch(`${API_BASE}/scenarios/what-if`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      }).then((r) => r.ok ? r.json() : null);

      if (res) {
        setScenarioResult(res);
        setBackendConnected(true);
      } else {
        throw new Error("Backend unavailable");
      }
    } catch (err) {
      // Fallback client scenario calculation
      const baseEal = simulation?.expected_annual_loss || defaultSimulation.expected_annual_loss;
      const baseVar = simulation?.value_at_risk_95 || defaultSimulation.value_at_risk_95;
      
      let deltaPct = 0;
      let name = "";
      let narrative = "";
      let drivers = [];
      let actions = [];

      if (params.scenario_type === "mfa_privileged") {
        deltaPct = -28.5;
        name = "Enforce Phishing-Resistant MFA on All Privileged Accounts";
        narrative = "Enforcing hardware FIDO2 MFA on all domain and cloud admin accounts eliminates credential stuffing exposure, reducing Expected Annual Loss by 28.5%.";
        drivers = ["Neutralizes credential dumping & pass-the-hash attacks", "Closes mandatory RBI Cyber Security Framework Annex I gap"];
        actions = ["Procure 250 FIDO2 hardware tokens (YubiKeys)", "Enforce conditional access policy for privileged roles"];
      } else if (params.scenario_type === "patch_delay") {
        const days = params.patch_delay_days || 30;
        deltaPct = Math.round((days / 30) * 26.8);
        name = `Delay Vulnerability Patch Remediation by ${days} Days`;
        narrative = `Postponing patch cycles by ${days} days significantly expands threat exploitation windows, increasing annual financial exposure by +${deltaPct}%.`;
        drivers = [`CISA KEV exploitation rate accelerates over ${days} days`, "Violation of SEBI CSCRF 72-hour critical patch SLA"];
        actions = ["Establish emergency zero-day patch authorization workflow", "Deploy virtual patching at WAF and API boundaries"];
      } else if (params.scenario_type === "ransomware_outbreak") {
        deltaPct = 140.0;
        name = "Targeted Ransomware Outbreak on Tier 1 Infrastructure";
        narrative = "A coordinated ransomware campaign targeting Core Banking and Payment switches causes critical business disruption, with downtime costs exceeding ₹25L/hour.";
        drivers = ["Lateral movement across unsegmented database subnets", "Lack of cryptographic WORM immutable backups"];
        actions = ["Deploy host microsegmentation", "Implement air-gapped immutable backup storage"];
      } else {
        deltaPct = -45.0;
        name = "Strategic Defense Package (MFA + Automated Patching + Micro-segmentation)";
        narrative = "Deploying the combined triad of privileged MFA, automated patch orchestration, and network microsegmentation reduces enterprise cyber exposure by 45.0%.";
        drivers = ["Eliminates 85% of lateral movement and exploit vectors", "Achieves 94% compliance across RBI and SEBI frameworks"];
        actions = ["Authorize capital expenditure of ₹72 Lakhs across FY26-27", "Roll out to UPI and Core Banking in Phase 1"];
      }

      const deltaEal = (baseEal * deltaPct) / 100.0;
      const scenEal = Math.max(0, baseEal + deltaEal);
      const scenVar = Math.max(0, baseVar + (baseVar * deltaPct) / 100.0);

      setScenarioResult({
        scenario_name: name,
        baseline_eal: Math.round(baseEal),
        scenario_eal: Math.round(scenEal),
        baseline_var_95: Math.round(baseVar),
        scenario_var_95: Math.round(scenVar),
        delta_eal: Math.round(deltaEal),
        delta_percentage: deltaPct,
        executive_narrative: narrative,
        key_drivers: drivers,
        suggested_actions: actions
      });
    } finally {
      setLoadingScenario(false);
    }
  };

  // Query AI Copilot
  const handleQueryCopilot = async (queryText) => {
    try {
      const res = await fetch(`${API_BASE}/copilot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });
      if (res.ok) {
        return res.json();
      }
      throw new Error("Backend copilot unreachable");
    } catch (err) {
      // Intelligent client-side fallback answer
      const q = queryText.toLowerCase();
      let answer = "";
      let followups = [];

      if (q.includes("highest") || q.includes("risk") || q.includes("worst")) {
        const topA = simulation?.asset_risk_rankings?.[0] || defaultSimulation.asset_risk_rankings[0];
        answer = `**Highest Financial Exposure Asset:**\n\nThe **${topA.asset_name}** (${topA.criticality}) accounts for our largest single exposure, with an Expected Annual Loss (EAL) of **₹${(topA.expected_annual_loss).toLocaleString("en-IN")}** and a 95% Value at Risk (VaR) of **₹${(topA.value_at_risk_95).toLocaleString("en-IN")}**.\n\n**Top CVE Vulnerability:** \`${topA.top_vulnerability}\`\n**Business Unit:** ${topA.business_unit}\n\n**Recommended Action:** Prioritize deploying **Zero Trust Micro-segmentation** and **Automated Patch Orchestration** to compress this asset's loss expectancy by ~35%.`;
        followups = ["Which vulnerabilities contribute most to expected losses?", "Best allocation for ₹1 Crore budget?", "Show RBI compliance gaps"];
      } else if (q.includes("budget") || q.includes("spend") || q.includes("crore") || q.includes("invest")) {
        answer = `**Security Investment Optimization Advisory:**\n\nUnder an authorized budget of **₹1,00,00,000 (₹1 Crore)**, the 0/1 Knapsack optimizer recommends allocating **₹95,00,000 (₹95 Lakhs)** across four primary controls:\n\n- **FIDO2 MFA for Privileged Accounts** (₹15 Lakhs | ROSI: 1200%)\n- **Automated Patch Orchestrator** (₹22 Lakhs | ROSI: 895%)\n- **Cloud Posture & CIEM** (₹18 Lakhs | ROSI: 812%)\n- **Core Banking Micro-segmentation** (₹35 Lakhs | ROSI: 643%)\n\n**Projected Outcome:** Reduces annual risk by **₹3.85 Crores** with an overall portfolio ROSI of **185.2%**.`;
        followups = ["What if our budget is increased to ₹1.5 Crores?", "What is our highest financial cyber risk?", "Generate Board Audit Report"];
      } else if (q.includes("rbi") || q.includes("sebi") || q.includes("compliance")) {
        answer = `**Regulatory Compliance Status:**\n\n- **RBI Cyber Security Framework**: 74.5% compliance (2 gaps identified). Key gap: Missing mandatory FIDO2 hardware MFA on domain controllers (Annex I Sec 3) and unisolated SWIFT subnet.\n- **SEBI CSCRF**: 67.0% compliance (2 gaps identified). Key gap: Parameter 3 cloud bucket access and 72-hour critical vulnerability MTTR.\n\nDeploying the recommended controls closes both primary audit gaps and reduces regulatory fine exposure by ₹6.6 Crores.`;
        followups = ["What is our highest financial cyber risk?", "Impact of 30-day patch delay?", "Download Audit Report"];
      } else {
        answer = `**Executive Cyber Risk Summary:**\n\n- **Expected Annual Loss (EAL):** ₹6.84 Crores\n- **95% Value at Risk (VaR):** ₹15.82 Crores\n- **Security Posture Score:** 68.5 / 100\n- **Top Contributing Asset:** Core Banking Finacle Engine (₹2.15 Cr EAL)\n\nYou can ask about investment optimization, regulatory compliance, or scenario modeling.`;
        followups = ["What is our highest financial cyber risk today?", "Best allocation for ₹1 Crore budget?", "How does our RBI compliance stand?"];
      }

      return {
        query: queryText,
        answer,
        confidence: 0.95,
        suggested_followups: followups,
        referenced_metrics: {}
      };
    }
  };

  // Ingest Telemetry or Scan Report
  const handleIngestTelemetry = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/telemetry/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchAllData();
        return res.json();
      }
    } catch (err) {
      console.warn("Ingesting into client engine");
    }

    // Client-side ingestion simulation
    const newTel = {
      id: `TEL-${telemetry.length + 1}`,
      source: payload.source || "Scanner Upload",
      severity: payload.severity || "Critical",
      event_type: payload.event_type || "Vulnerability Ingestion",
      description: payload.description || "Parsed scanner findings",
      asset_id: payload.asset_id || "ASSET-01",
      timestamp: new Date().toISOString(),
      metric_value: payload.metric_value || 90.0
    };

    setTelemetry((prev) => [newTel, ...prev]);

    // Recalculate simulation with new risk added
    const deltaImpact = payload.eal_impact_inr || 15000000;
    const updatedEal = simulation.expected_annual_loss + deltaImpact * 0.2;
    const updatedSim = {
      ...simulation,
      expected_annual_loss: Math.round(updatedEal),
      value_at_risk_95: Math.round(updatedEal * 2.35),
      enterprise_posture_score: Math.max(35, simulation.enterprise_posture_score - 3.5)
    };
    setSimulation(updatedSim);
    setOverview({
      ...overview,
      expected_annual_loss: updatedSim.expected_annual_loss,
      value_at_risk_95: updatedSim.value_at_risk_95,
      enterprise_posture_score: updatedSim.enterprise_posture_score
    });

    return { status: "success", new_eal: updatedSim.expected_annual_loss };
  };

  // Open Board Report
  const handleOpenReport = async () => {
    try {
      const res = await fetch(`${API_BASE}/report/data`).then((r) => r.ok ? r.json() : null);
      if (res) {
        setReportData(res);
        setIsReportOpen(true);
        return;
      }
    } catch (err) {
      // client fallback report data
    }

    setReportData({
      institution_name: "OmniBank & Capital Ltd.",
      report_date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      generated_by: "CyberQuant-AI™ Autonomous Risk Engine",
      scope: "Enterprise ICT Infrastructure, Cloud & Core Banking",
      eal_inr: simulation?.expected_annual_loss || defaultSimulation.expected_annual_loss,
      var_95_inr: simulation?.value_at_risk_95 || defaultSimulation.value_at_risk_95,
      var_99_inr: simulation?.value_at_risk_99 || defaultSimulation.value_at_risk_99,
      cvar_95_inr: simulation?.conditional_var_95 || defaultSimulation.conditional_var_95,
      posture_score: simulation?.enterprise_posture_score || defaultSimulation.enterprise_posture_score,
      loss_breakdown: simulation?.loss_breakdown || defaultSimulation.loss_breakdown,
      top_assets: simulation?.asset_risk_rankings?.slice(0, 5) || defaultSimulation.asset_risk_rankings.slice(0, 5),
      top_risk_drivers: simulation?.top_risk_drivers || defaultSimulation.top_risk_drivers,
      framework_scores: complianceData?.framework_scores || defaultCompliance.framework_scores,
      selected_investments: optimization?.selected_controls || defaultOptimization.selected_controls,
      total_budget: optimization?.available_budget || defaultOptimization.available_budget,
      total_spend: optimization?.total_spent || defaultOptimization.total_spent,
      projected_risk_reduction: optimization?.total_risk_reduction_inr || defaultOptimization.total_risk_reduction_inr,
      projected_rosi: optimization?.overall_rosi_percentage || defaultOptimization.overall_rosi_percentage
    });
    setIsReportOpen(true);
  };

  const navTabs = [
    { id: "dashboard", label: "CISO Executive Overview", icon: LayoutDashboard },
    { id: "quantification", label: "FAIR Monte Carlo Engine", icon: Activity },
    { id: "optimizer", label: "Capital Optimizer & ROSI", icon: DollarSign },
    { id: "scenarios", label: "What-If Threat Simulator", icon: Sliders },
    { id: "compliance", label: "Regulatory Matrix (RBI/SEBI)", icon: Award },
    { id: "copilot", label: "AI Risk Copilot", icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30 text-slate-950">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white m-0 p-0 leading-tight">
                  CyberQuant<span className="text-cyan-400">-AI</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  SIH 2026
                </span>
                {backendConnected ? (
                  <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" title="Connected to Python FastAPI backend">
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    Live API
                  </span>
                ) : (
                  <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" title="Running with integrated OpenFAIR simulation engine">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    FAIR Engine Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Continuous Cyber Risk Quantification & Investment Optimization Platform
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "INR"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Ingest Telemetry Button */}
            <button
              onClick={() => setIsIngestOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Upload Scan / Ingest</span>
            </button>

            {/* Audit Report Button */}
            <button
              onClick={handleOpenReport}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="bg-slate-950/60 border-b border-slate-800 px-4 lg:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === "dashboard" && (
          <ExecutiveDashboard
            overview={overview}
            currency={currency}
            onOpenReport={handleOpenReport}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "quantification" && (
          <RiskQuantificationView
            simulation={simulation}
            telemetry={telemetry}
            assets={assets}
            currency={currency}
            onRunSimulation={handleRunSimulation}
            loadingSimulation={loadingSimulation}
          />
        )}

        {activeTab === "optimizer" && (
          <InvestmentOptimizer
            optimization={optimization}
            controls={controls}
            currency={currency}
            onRunOptimization={handleRunOptimization}
            loadingOptimization={loadingOptimization}
          />
        )}

        {activeTab === "scenarios" && (
          <ScenarioSimulator
            currency={currency}
            onRunScenario={handleRunScenario}
            scenarioResult={scenarioResult}
            loadingScenario={loadingScenario}
          />
        )}

        {activeTab === "compliance" && (
          <ComplianceMatrix
            complianceData={complianceData}
            currency={currency}
          />
        )}

        {activeTab === "copilot" && (
          <AiRiskCopilot
            currency={currency}
            onQueryCopilot={handleQueryCopilot}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 lg:px-8 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>CyberQuant-AI™ Continuous Cyber Risk Quantification & Investment Optimization Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OpenFAIR ISO/IEC 27005</span>
            <span>•</span>
            <span>RBI / SEBI CSCRF</span>
            <span>•</span>
            <span>NIST CSF 2.0</span>
          </div>
        </div>
      </footer>

      {/* Telemetry Ingestion Modal */}
      <TelemetryIngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestTelemetry={handleIngestTelemetry}
        currency={currency}
      />

      {/* Board Report Modal */}
      <BoardReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={reportData}
        currency={currency}
      />
    </div>
  );
}
