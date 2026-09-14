import React, { useState } from "react";
import {
  Sliders,
  ShieldCheck,
  Clock,
  Skull,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function ScenarioSimulator({ currency, onRunScenario, scenarioResult, loadingScenario }) {
  const [selectedScenario, setSelectedScenario] = useState("mfa_privileged");
  const [patchDelayDays, setPatchDelayDays] = useState(30);

  const handleSelectScenario = (type) => {
    setSelectedScenario(type);
    onRunScenario({
      scenario_type: type,
      patch_delay_days: type === "patch_delay" ? patchDelayDays : 0,
      currency: currency
    });
  };

  const handlePatchDelayChange = (days) => {
    setPatchDelayDays(days);
    if (selectedScenario === "patch_delay") {
      onRunScenario({
        scenario_type: "patch_delay",
        patch_delay_days: days,
        currency: currency
      });
    }
  };

  const scenarios = [
    {
      id: "mfa_privileged",
      title: "Enforce Phishing-Resistant MFA",
      description: "Mandate hardware FIDO2 keys (YubiKeys) for 100% of domain and cloud admins.",
      icon: ShieldCheck,
      color: "emerald"
    },
    {
      id: "patch_delay",
      title: "Delay Vulnerability Patching",
      description: "Model the financial risk impact of delaying patch cycles by 30 to 90 days.",
      icon: Clock,
      color: "amber"
    },
    {
      id: "ransomware_outbreak",
      title: "Ransomware Outbreak on Tier 1",
      description: "Simulate a double-extortion ransomware attack hitting Core Banking Finacle DB.",
      icon: Skull,
      color: "rose"
    },
    {
      id: "combined_triad",
      title: "Strategic Defense Package",
      description: "Simultaneously deploy MFA, Automated Patch Orchestration & Micro-segmentation.",
      icon: Zap,
      color: "cyan"
    }
  ];

  const isRiskIncrease = (scenarioResult?.delta_eal || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cyber-glass-glow rounded-2xl p-6 border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          Interactive "What-If" Scenario Simulation
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Executive Decision Support & Threat Modeling
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Evaluate the financial exposure consequences of strategic policy decisions, postponed patch remediation cycles, or targeted adversary campaigns before committing capital.
        </p>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`p-5 rounded-2xl cyber-glass cursor-pointer transition-all border ${
                isSelected
                  ? "border-cyan-400 cyber-glass-glow ring-2 ring-cyan-400/30"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    sc.color === "emerald"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : sc.color === "amber"
                      ? "bg-amber-500/20 text-amber-400"
                      : sc.color === "rose"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <h3 className="text-base font-bold text-white mb-1">{sc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>
            </div>
          );
        })}
      </div>

      {/* Special Slider for Patch Delay Scenario */}
      {selectedScenario === "patch_delay" && (
        <div className="cyber-glass rounded-2xl p-5 border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Adjust Patch Cycle Delay Duration:
            </span>
            <span className="text-lg font-black text-amber-400">+{patchDelayDays} Days Delay</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={patchDelayDays}
            onChange={(e) => handlePatchDelayChange(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>+10 Days (Minimal Aging)</span>
            <span>+30 Days (SEBI SLA Breach)</span>
            <span>+60 Days (High Exploit Risk)</span>
            <span>+90 Days (Critical Vulnerability)</span>
          </div>
        </div>
      )}

      {/* Scenario Output Card */}
      {scenarioResult && (
        <div className="cyber-glass-glow rounded-2xl p-6 border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Simulation Results</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{scenarioResult.scenario_name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 ${
                  isRiskIncrease
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {isRiskIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isRiskIncrease ? "+" : ""}
                  {scenarioResult.delta_percentage}% EAL Impact
                </span>
              </div>
            </div>
          </div>

          {/* Before vs. After Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Baseline Expected Annual Loss</div>
              <div className="text-xl font-bold text-slate-300 mt-1">
                {formatCurrency(scenarioResult.baseline_eal, currency)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Status Quo Operations</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Simulated Scenario EAL</div>
              <div
                className={`text-xl font-black mt-1 ${
                  isRiskIncrease ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {formatCurrency(scenarioResult.scenario_eal, currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Delta: {formatCurrency(scenarioResult.delta_eal, currency)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Simulated 95% Value at Risk (VaR)</div>
              <div className="text-xl font-bold text-rose-300 mt-1">
                {formatCurrency(scenarioResult.scenario_var_95, currency)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Baseline VaR: {formatCurrency(scenarioResult.baseline_var_95, currency)}
              </div>
            </div>
          </div>

          {/* Executive Narrative */}
          <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Executive AI Synthesis
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {scenarioResult.executive_narrative}
            </p>
          </div>

          {/* Key Drivers & Suggested Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Underlying Technical Drivers
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scenarioResult.key_drivers?.map((driver, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Actionable Remediation Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scenarioResult.suggested_actions?.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
