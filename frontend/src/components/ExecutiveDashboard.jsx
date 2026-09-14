import React from "react";
import {
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Zap,
  DollarSign,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell
} from "recharts";
import { formatCurrency, getRiskBadgeColor } from "../utils/formatters";

export default function ExecutiveDashboard({ overview, currency, onOpenReport, onNavigateTab }) {
  if (!overview) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mr-3 text-cyan-400" />
        <span>Loading Executive Telemetry & Risk Quantifications...</span>
      </div>
    );
  }

  const {
    expected_annual_loss,
    value_at_risk_95,
    conditional_var_95,
    enterprise_posture_score,
    active_assets_count,
    critical_vulnerabilities_count,
    monthly_trend,
    loss_breakdown,
    top_risk_drivers,
    top_asset,
    default_risk_reduction,
    default_rosi
  } = overview;

  const breakdownData = Object.entries(loss_breakdown || {}).map(([key, val]) => ({
    name: key,
    amount: val
  }));

  const COLORS = ["#38bdf8", "#818cf8", "#f43f5e", "#fbbf24"];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for CISO */}
      <div className="cyber-glass-glow rounded-2xl p-5 border-l-4 border-l-cyan-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-wide">Continuous Quantitative Risk Telemetry Active</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Ingestion
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Correlating 12 Tier 1-3 enterprise assets, 9 active CVEs, and multi-source SIEM/EDR/CSPM telemetry against the OpenFAIR framework.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab("optimizer")}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
          >
            <DollarSign className="w-4 h-4" />
            Optimize Spend
          </button>
          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 rounded-xl cyber-glass hover:bg-slate-800/80 text-cyan-300 font-semibold text-sm border border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
          >
            <FileText className="w-4 h-4" />
            Audit Report
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: EAL */}
        <div className="cyber-glass rounded-2xl p-5 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expected Annual Loss (EAL)</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(expected_annual_loss, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <ArrowDownRight className="w-4 h-4" />
            <span>-20% vs Q1 baseline</span>
            <span className="text-slate-500 ml-auto">FAIR Median</span>
          </div>
        </div>

        {/* KPI 2: VaR 95% */}
        <div className="cyber-glass rounded-2xl p-5 hover:border-rose-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">95% Value at Risk (VaR)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 tracking-tight">
            {formatCurrency(value_at_risk_95, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>CVaR (Expected Shortfall):</span>
            <span className="font-semibold text-rose-300">{formatCurrency(conditional_var_95, currency)}</span>
          </div>
        </div>

        {/* KPI 3: Posture Score */}
        <div className="cyber-glass rounded-2xl p-5 hover:border-emerald-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Posture Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {enterprise_posture_score}
            </div>
            <span className="text-sm text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${enterprise_posture_score}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Highest Single Exposure */}
        <div className="cyber-glass rounded-2xl p-5 hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Loss Contributor</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-white truncate" title={top_asset?.asset_name}>
            {top_asset?.asset_name}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">{top_asset?.business_unit}</span>
            <span className="text-xs font-bold text-rose-400">
              {formatCurrency(top_asset?.expected_annual_loss, currency)} EAL
            </span>
          </div>
        </div>
      </div>

      {/* 2 Main Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 cols) */}
        <div className="cyber-glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Financial Cyber Risk Exposure Trend</h3>
              <p className="text-xs text-slate-400">Monthly evolution of EAL vs 95th Percentile Value at Risk</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-400" />
                <span className="text-slate-300">Expected Annual Loss (EAL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span className="text-slate-300">95% VaR Exposure</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="varGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(val) => formatCurrency(val, currency)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="cyber-glass p-3 rounded-xl border border-slate-700 text-xs shadow-2xl space-y-1">
                          <p className="font-bold text-white mb-1">{label}</p>
                          <p className="text-cyan-300">EAL: {formatCurrency(payload[0].value, currency)}</p>
                          <p className="text-rose-400">95% VaR: {formatCurrency(payload[1].value, currency)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="eal_inr" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#ealGrad)" />
                <Area type="monotone" dataKey="var95_inr" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#varGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss Component Breakdown (1 col) */}
        <div className="cyber-glass rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Loss Impact Decomposition</h3>
            <p className="text-xs text-slate-400 mb-4">FAIR Primary & Secondary Loss Allocation</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(v) => formatCurrency(v, currency)}
                  />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fill: "#cbd5e1", fontSize: 11 }} width={110} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="cyber-glass p-2.5 rounded-lg border border-slate-700 text-xs shadow-xl">
                            <span className="font-semibold text-white">{payload[0].payload.name}: </span>
                            <span className="text-cyan-400 font-bold">{formatCurrency(payload[0].value, currency)}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Critical Regulatory Ceiling:</span>
            <span className="text-rose-400 font-bold">DPDP Act (₹250 Cr max)</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Risk Drivers & Strategic Investment Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Risk Drivers (2 cols) */}
        <div className="cyber-glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Top Technical Risk Drivers</h3>
              <p className="text-xs text-slate-400">Technical telemetry correlated directly to monetary loss contribution</p>
            </div>
            <span className="text-xs font-semibold text-cyan-400 cursor-pointer hover:underline" onClick={() => onNavigateTab("quantification")}>
              View All Telemetry →
            </span>
          </div>
          <div className="space-y-3">
            {top_risk_drivers?.map((driver, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{driver.driver}</span>
                  </div>
                  <p className="text-xs text-slate-400 ml-7">
                    <span className="text-slate-500">Remedy:</span> {driver.remedy}
                  </p>
                </div>
                <div className="text-right sm:min-w-[140px] ml-7 sm:ml-0">
                  <div className="text-sm font-bold text-rose-400">
                    {formatCurrency(driver.impact_eal_inr, currency)}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-medium">
                    {driver.contribution_percentage}% of total EAL
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Investment Opportunity (1 col) */}
        <div className="cyber-glass-glow rounded-2xl p-6 flex flex-col justify-between border-cyan-500/30">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              Investment Recommendation
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Maximize Spend Efficiency</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the 0/1 Knapsack optimization algorithm, allocating authorized budget delivers maximum risk reduction before hitting the diminishing returns frontier.
            </p>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Potential Risk Reduction</div>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(default_risk_reduction, currency)} / yr
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Projected Portfolio ROSI</div>
                <div className="text-xl font-bold text-cyan-400 mt-0.5">
                  {default_rosi?.toFixed(1)}% Return
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("optimizer")}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch Investment Simulator
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
