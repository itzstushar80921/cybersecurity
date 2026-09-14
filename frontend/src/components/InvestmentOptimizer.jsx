import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  Clock,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { formatCurrency, formatFullNumber } from "../utils/formatters";

export default function InvestmentOptimizer({
  optimization,
  controls,
  currency,
  onRunOptimization,
  loadingOptimization
}) {
  const [budget, setBudget] = useState(10000000); // Default ₹1 Crore

  const handleBudgetChange = (val) => {
    setBudget(val);
  };

  const handleApplyBudget = () => {
    onRunOptimization({
      budget: parseFloat(budget),
      currency: currency
    });
  };

  const presets = [
    { label: "₹25 Lakhs", value: 2500000 },
    { label: "₹50 Lakhs", value: 5000000 },
    { label: "₹1 Crore", value: 10000000 },
    { label: "₹1.5 Crores", value: 15000000 },
    { label: "₹2 Crores", value: 20000000 }
  ];

  const curveData = optimization?.investment_vs_risk_curve || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Dynamic Budget Slider */}
      <div className="cyber-glass-glow rounded-2xl p-6 border-cyan-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              Mathematical Investment Optimization (0/1 Knapsack)
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Cybersecurity Capital Allocation & ROSI Engine
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Solves the combinatorial 0/1 Knapsack problem to select the highest-leverage security controls that maximize enterprise risk reduction (ΔEAL) under explicit budget constraints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-right min-w-[220px]">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Current Spend Zone</span>
            <div className="text-base font-bold text-cyan-300 mt-1">
              {optimization?.budget_zone || "Optimal Spend Zone"}
            </div>
          </div>
        </div>

        {/* Interactive Budget Control */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400">Target Budget Ceiling: </span>
              <span className="text-xl font-black text-cyan-400 ml-2">
                {formatCurrency(budget, currency)}
              </span>
              <span className="text-xs text-slate-500 ml-2">({formatFullNumber(budget, currency)})</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setBudget(p.value);
                    onRunOptimization({ budget: p.value, currency: currency });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    budget === p.value
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000000"
              max="20000000"
              step="500000"
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <button
              onClick={handleApplyBudget}
              disabled={loadingOptimization}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {loadingOptimization ? "Calculating..." : "Optimize Portfolio"}
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Scorecard: 4 Key Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-glass rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Portfolio Spend</div>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(optimization?.total_spent, currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Remaining: <span className="text-slate-300">{formatCurrency(optimization?.remaining_budget, currency)}</span>
          </div>
        </div>

        <div className="cyber-glass rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Risk Reduction (ΔALE)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(optimization?.total_risk_reduction_inr, currency)}
          </div>
          <div className="text-xs text-emerald-400/80 mt-1">Direct annualized savings</div>
        </div>

        <div className="cyber-glass rounded-xl p-4">
          <div className="text-xs text-slate-400">Optimized Residual EAL</div>
          <div className="text-2xl font-black text-cyan-300 mt-1">
            {formatCurrency(optimization?.optimized_eal, currency)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            From: <span className="line-through text-slate-500">{formatCurrency(optimization?.baseline_eal, currency)}</span>
          </div>
        </div>

        <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30">
          <div className="text-xs text-slate-400">Portfolio ROSI (Return)</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            +{optimization?.overall_rosi_percentage?.toFixed(1)}%
          </div>
          <div className="text-xs text-cyan-300/80 mt-1">Return on Security Investment</div>
        </div>
      </div>

      {/* Spend vs. Risk Reduction Pareto Frontier Curve */}
      <div className="cyber-glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">Investment vs. Risk Reduction Curve (Pareto Frontier)</h3>
            <p className="text-xs text-slate-400">
              Visualizes diminishing returns across spend levels to identify optimal investment zones for board approval
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Optimal Spend Zone (₹45L - ₹1Cr)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="riskRedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="budget_spend_inr"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => formatCurrency(v, currency)}
                label={{ value: "Budget Allocated (₹)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(v) => formatCurrency(v, currency)}
                label={{ value: "Risk Reduction (₹)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="cyber-glass p-3 rounded-xl border border-slate-700 text-xs shadow-2xl space-y-1">
                        <p className="font-bold text-white">Spend: {formatCurrency(data.budget_spend_inr, currency)}</p>
                        <p className="text-emerald-400">Risk Reduction: {formatCurrency(data.risk_reduction_inr, currency)}</p>
                        <p className="text-cyan-300">Residual EAL: {formatCurrency(data.residual_eal_inr, currency)}</p>
                        <p className="text-amber-400 font-semibold">ROSI: +{data.rosi_pct}% ({data.zone})</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine x={budget} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: "Your Budget", fill: "#38bdf8", fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="risk_reduction_inr"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskRedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected vs. Unselected Controls Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Controls */}
        <div className="cyber-glass rounded-2xl p-6 border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Recommended Controls to Deploy</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">
              {optimization?.selected_controls?.length || 0} Selected
            </span>
          </div>

          <div className="space-y-3">
            {optimization?.selected_controls?.map((sel) => (
              <div key={sel.control.id} className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-white text-sm">{sel.control.name}</span>
                  <span className="text-xs font-extrabold text-emerald-400 whitespace-nowrap">
                    ROSI: +{sel.rosi_percentage}%
                  </span>
                </div>
                <p className="text-xs text-slate-300">{sel.control.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Cost: <strong className="text-white">{formatCurrency(sel.allocated_cost, currency)}</strong></span>
                  <span className="text-slate-400">Risk Reduction: <strong className="text-emerald-400">{formatCurrency(sel.isolated_risk_reduction_inr, currency)}</strong></span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {sel.control.implementation_time_weeks} wks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unselected Controls */}
        <div className="cyber-glass rounded-2xl p-6 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Deficit / Deferred Controls</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {optimization?.unselected_controls?.length || 0} Excluded by Budget
            </span>
          </div>

          <div className="space-y-3">
            {optimization?.unselected_controls?.map((ctrl) => (
              <div key={ctrl.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-200 text-sm">{ctrl.name}</span>
                  <span className="text-xs font-bold text-slate-400">
                    {formatCurrency(ctrl.implementation_cost, currency)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{ctrl.description}</p>
                <div className="text-[11px] text-amber-400/80">
                  Requires additional {formatCurrency(ctrl.implementation_cost - (optimization?.remaining_budget || 0), currency)} budget to authorize
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
