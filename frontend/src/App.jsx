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
  Cpu
} from "lucide-react";

import ExecutiveDashboard from "./components/ExecutiveDashboard";
import RiskQuantificationView from "./components/RiskQuantificationView";
import InvestmentOptimizer from "./components/InvestmentOptimizer";
import ScenarioSimulator from "./components/ScenarioSimulator";
import ComplianceMatrix from "./components/ComplianceMatrix";
import AiRiskCopilot from "./components/AiRiskCopilot";
import TelemetryIngestionModal from "./components/TelemetryIngestionModal";
import BoardReportModal from "./components/BoardReportModal";

// Support dynamic backend URL from Vercel environment variables (VITE_API_BASE)
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "") || (
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000/api"
    : "/api"
);

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currency, setCurrency] = useState("INR"); // "INR" or "USD"

  // Data states
  const [overview, setOverview] = useState(null);
  const [assets, setAssets] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [controls, setControls] = useState([]);
  const [simulation, setSimulation] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [scenarioResult, setScenarioResult] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Loading states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [loadingOptimization, setLoadingOptimization] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState(false);

  // Modals
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Fetch initial baseline data from FastAPI backend
  const fetchAllData = async () => {
    try {
      const [ovRes, asRes, telRes, ctrlRes, compRes, simRes, optRes] = await Promise.all([
        fetch(`${API_BASE}/overview`).then((r) => r.json()),
        fetch(`${API_BASE}/assets`).then((r) => r.json()),
        fetch(`${API_BASE}/telemetry`).then((r) => r.json()),
        fetch(`${API_BASE}/controls`).then((r) => r.json()),
        fetch(`${API_BASE}/compliance`).then((r) => r.json()),
        fetch(`${API_BASE}/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iterations: 10000, currency })
        }).then((r) => r.json()),
        fetch(`${API_BASE}/optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ budget: 10000000, currency })
        }).then((r) => r.json())
      ]);

      setOverview(ovRes);
      setAssets(asRes);
      setTelemetry(telRes);
      setControls(ctrlRes);
      setComplianceData(compRes);
      setSimulation(simRes);
      setOptimization(optRes);

      // Default scenario (MFA)
      const scRes = await fetch(`${API_BASE}/scenarios/what-if`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_type: "mfa_privileged", currency })
      }).then((r) => r.json());
      setScenarioResult(scRes);
    } catch (err) {
      console.error("Backend connection error:", err);
    } finally {
      setLoadingInitial(false);
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
      }).then((r) => r.json());
      setSimulation(res);
    } catch (err) {
      console.error("Simulation error:", err);
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
      }).then((r) => r.json());
      setOptimization(res);
    } catch (err) {
      console.error("Optimization error:", err);
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
      }).then((r) => r.json());
      setScenarioResult(res);
    } catch (err) {
      console.error("Scenario error:", err);
    } finally {
      setLoadingScenario(false);
    }
  };

  // Query AI Copilot
  const handleQueryCopilot = async (queryText) => {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText })
    });
    return res.json();
  };

  // Ingest Telemetry
  const handleIngestTelemetry = async (payload) => {
    const res = await fetch(`${API_BASE}/telemetry/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchAllData();
    return data;
  };

  // Open Board Report
  const handleOpenReport = async () => {
    try {
      const res = await fetch(`${API_BASE}/report/data`).then((r) => r.json());
      setReportData(res);
      setIsReportOpen(true);
    } catch (err) {
      console.error("Report fetch error:", err);
    }
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
              <span className="hidden md:inline">Ingest Telemetry</span>
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
