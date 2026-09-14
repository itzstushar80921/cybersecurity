import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function ComplianceMatrix({ complianceData, currency }) {
  const [selectedFramework, setSelectedFramework] = useState("RBI Cyber Security Framework");

  const frameworks = complianceData?.framework_scores || [];
  const items = complianceData?.compliance_items || [];

  const activeFw = frameworks.find((f) => f.framework_name === selectedFramework) || frameworks[0];
  const filteredItems = items.filter((it) => it.framework === selectedFramework);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cyber-glass-glow rounded-2xl p-6 border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          Regulatory & Security Governance Crosswalk
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Automated Compliance & Audit Posture
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Continuous telemetry mapping against premier statutory regulations including RBI Cyber Security Guidelines, SEBI CSCRF, NIST CSF 2.0, ISO/IEC 27001:2022, and CIS Controls v8.
        </p>
      </div>

      {/* Framework Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {frameworks.map((fw) => {
          const isSelected = selectedFramework === fw.framework_name;
          return (
            <div
              key={fw.framework_name}
              onClick={() => setSelectedFramework(fw.framework_name)}
              className={`p-4 rounded-xl cyber-glass cursor-pointer transition-all border ${
                isSelected
                  ? "border-cyan-400 cyber-glass-glow ring-2 ring-cyan-400/30"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-bold text-slate-400 truncate" title={fw.framework_name}>
                {fw.framework_name}
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-white">{fw.overall_compliance_percentage}%</span>
                <span className="text-xs text-slate-500">score</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    fw.overall_compliance_percentage >= 80
                      ? "bg-emerald-400"
                      : fw.overall_compliance_percentage >= 60
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                  style={{ width: `${fw.overall_compliance_percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                <span>{fw.compliant_count}/{fw.total_controls} Passed</span>
                <span className="text-rose-400 font-semibold">{fw.gap_count} Gaps</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Framework Deep Dive */}
      {activeFw && (
        <div className="cyber-glass rounded-2xl p-6 border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Framework Focus</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{activeFw.framework_name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400">Financial Exposure from Gaps</div>
                <div className="text-lg font-black text-rose-400">
                  {formatCurrency(activeFw.financial_exposure_from_gaps, currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Domain Category Maturity
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(activeFw.category_scores || {}).map(([cat, score]) => (
                <div key={cat} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold truncate pr-2" title={cat}>{cat}</span>
                    <span className="font-bold text-white">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${score >= 70 ? "bg-emerald-400" : score >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Control Findings Register */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Control Telemetry & Audit Findings Register
            </h4>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.control_id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.status === "Compliant"
                      ? "bg-slate-900/40 border-emerald-500/20"
                      : item.status === "Partially Compliant"
                      ? "bg-slate-900/60 border-amber-500/20"
                      : "bg-slate-900/80 border-rose-500/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{item.control_id}</span>
                      <span className="text-sm font-bold text-white">{item.title}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        item.status === "Compliant"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : item.status === "Partially Compliant"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {item.status} ({item.score_percentage}%)
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mt-2 space-y-1">
                    <div>
                      <span className="text-slate-500">Live Telemetry Evidence: </span>
                      <span className="text-slate-200">{item.evidence_telemetry}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-semibold">Recommended Remediation: </span>
                      <span className="text-cyan-200">{item.remediation_action}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span>Category: {item.category}</span>
                    {item.associated_risk_inr > 0 && (
                      <span className="text-rose-400 font-bold">
                        Associated Financial Risk: {formatCurrency(item.associated_risk_inr, currency)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
