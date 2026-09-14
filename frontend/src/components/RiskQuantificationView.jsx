import React, { useState } from "react";
import {
  Activity,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Database,
  Radio,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { formatCurrency, getRiskBadgeColor, getSeverityBadgeColor } from "../utils/formatters";

export default function RiskQuantificationView({
  simulation,
  telemetry,
  assets,
  currency,
  onRunSimulation,
  loadingSimulation
}) {
  const [threatMultiplier, setThreatMultiplier] = useState(1.0);
  const [iterations, setIterations] = useState(10000);
  const [patchDelayDays, setPatchDelayDays] = useState(0);

  const handleSimulate = () => {
    onRunSimulation({
      threat_multiplier: parseFloat(threatMultiplier),
      iterations: parseInt(iterations),
      patch_delay_days: parseInt(patchDelayDays),
      currency: currency
    });
  };

  const handleReset = () => {
    setThreatMultiplier(1.0);
    setIterations(10000);
    setPatchDelayDays(0);
    onRunSimulation({
      threat_multiplier: 1.0,
      iterations: 10000,
      patch_delay_days: 0,
      currency: currency
    });
  };

  const lecData = (simulation?.loss_exceedance_curve || []).map((point) => ({
    loss: point.loss_amount,
    probability: point.probability_exceeded * 100, // percentage
    percentile: point.percentile
  }));

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Controls */}
      <div className="cyber-glass-glow rounded-2xl p-6 border-cyan-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              OpenFAIR Quantitative Modeling Engine
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Stochastic Monte Carlo Risk Engine
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulates {iterations.toLocaleString()} stochastic annual loss scenarios by convolving Threat Event Frequencies (Poisson) with Loss Magnitudes (Beta-PERT) across 12 enterprise assets.
            </p>
          </div>

          {/* Interactive Parameters Bar */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Threat Multiplier */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex-1 min-w-[170px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Threat Multiplier:</span>
                <span className="font-bold text-cyan-300">{threatMultiplier}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={threatMultiplier}
                onChange={(e) => setThreatMultiplier(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Patch Delay */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex-1 min-w-[170px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Remediation Delay:</span>
                <span className="font-bold text-amber-300">+{patchDelayDays}d</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={patchDelayDays}
                onChange={(e) => setPatchDelayDays(e.target.value)}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Run Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulate}
                disabled={loadingSimulation}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingSimulation ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                Run Monte Carlo
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                title="Reset Parameters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Result Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cyber-glass rounded-xl p-4 border border-cyan-500/20">
          <div className="text-xs text-slate-400">Simulated Mean EAL</div>
          <div className="text-xl lg:text-2xl font-black text-cyan-300 mt-1">
            {formatCurrency(simulation?.expected_annual_loss, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Expected Annual Loss</div>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-rose-500/20">
          <div className="text-xs text-slate-400">Value at Risk (95%)</div>
          <div className="text-xl lg:text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(simulation?.value_at_risk_95, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">1-in-20 year loss event</div>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-indigo-500/20">
          <div className="text-xs text-slate-400">Value at Risk (99%)</div>
          <div className="text-xl lg:text-2xl font-black text-indigo-300 mt-1">
            {formatCurrency(simulation?.value_at_risk_99, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">1-in-100 year loss event</div>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-emerald-500/20">
          <div className="text-xs text-slate-400">CVaR (Expected Shortfall)</div>
          <div className="text-xl lg:text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(simulation?.conditional_var_95, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Mean loss exceeding 95% VaR</div>
        </div>
      </div>

      {/* Loss Exceedance Curve (LEC) Chart */}
      <div className="cyber-glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">Loss Exceedance Curve (LEC)</h3>
            <p className="text-xs text-slate-400">
              Probability that enterprise financial loss will exceed any given monetary threshold in a 1-year horizon
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            OpenFAIR Standard ISO/IEC 27005 Compliant
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lecData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="loss"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => formatCurrency(v, currency)}
                label={{ value: "Financial Loss Threshold (₹)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Probability of Exceedance", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="cyber-glass p-3 rounded-xl border border-cyan-500/40 text-xs shadow-2xl space-y-1">
                        <p className="text-cyan-400 font-bold">Percentile: {data.percentile}th</p>
                        <p className="text-white">Loss Amount: {formatCurrency(data.loss, currency)}</p>
                        <p className="text-rose-400 font-semibold">Exceedance Probability: {data.probability.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0284c7" }}
                activeDot={{ r: 7, fill: "#38bdf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Criticality & Risk Quantification Table */}
      <div className="cyber-glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Asset Criticality & Exposure Matrix</h3>
            <p className="text-xs text-slate-400">
              Technical security telemetry correlated with business criticality, records count, and downtime impact
            </p>
          </div>
          <span className="text-xs text-slate-400">{assets?.length || 12} Monitored Assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Business Unit</th>
                <th className="py-3 px-4">Criticality Tier</th>
                <th className="py-3 px-4">Top Vulnerability</th>
                <th className="py-3 px-4">Attack Freq (TEF)</th>
                <th className="py-3 px-4">Susceptibility (VUL)</th>
                <th className="py-3 px-4">Expected Loss (EAL)</th>
                <th className="py-3 px-4">VaR (95%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {simulation?.asset_risk_rankings?.map((asset, i) => (
                <tr key={asset.asset_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      {asset.asset_name}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{asset.business_unit}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        asset.criticality.includes("Tier 1")
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : asset.criticality.includes("Tier 2")
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      }`}
                    >
                      {asset.criticality.split(" ")[0]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-amber-300">{asset.top_vulnerability}</td>
                  <td className="py-3.5 px-4 font-mono">{asset.threat_event_frequency} / yr</td>
                  <td className="py-3.5 px-4 font-mono">{(asset.vulnerability_probability * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 font-bold text-white">{formatCurrency(asset.expected_annual_loss, currency)}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">{formatCurrency(asset.value_at_risk_95, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Ingested Telemetry Feed */}
      <div className="cyber-glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Real-Time Ingested Security Telemetry</h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">Streaming Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {telemetry?.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400">{t.source}</span>
                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getSeverityBadgeColor(t.severity)}`}>
                  {t.severity}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{t.event_type}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <span>Target: {t.asset_id}</span>
                <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
