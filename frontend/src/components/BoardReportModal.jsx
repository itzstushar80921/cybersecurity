import React from "react";
import { X, Printer, ShieldCheck, FileText, Check, AlertTriangle, Building, DollarSign } from "lucide-react";
import { formatCurrency, formatFullNumber } from "../utils/formatters";

export default function BoardReportModal({ isOpen, onClose, reportData, currency }) {
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Actions Bar (hidden in print) */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Board & Regulatory Audit Report Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 space-y-6 print:p-0 print:space-y-4 font-sans text-xs sm:text-sm">
          {/* Header */}
          <div className="border-b-2 border-cyan-500 pb-4 flex items-start justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
                {reportData.institution_name}
              </div>
              <div className="text-cyan-400 font-bold text-sm mt-0.5 print:text-cyan-700">
                Board Risk Committee — Quantitative Cyber Exposure & Investment Audit
              </div>
              <div className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Scope: {reportData.scope} | Engine: {reportData.generated_by}
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Date: {reportData.report_date}</div>
              <div className="font-mono mt-1 text-[11px]">Ref: CQ-AUDIT-2026-Q3</div>
              <div className="mt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 print:border-black print:text-black">
                  CONFIDENTIAL
                </span>
              </div>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              1. Executive Quantitative Risk Summary
            </h3>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed text-xs">
              This audit report translates technical cybersecurity telemetry from across enterprise core banking, payment switches, and cloud data repositories into monetary exposure metrics in accordance with the OpenFAIR ISO/IEC 27005 standard.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-slate-50">
                <div className="text-[11px] text-slate-400 print:text-slate-600">Expected Annual Loss (EAL)</div>
                <div className="text-lg font-black text-white print:text-black mt-0.5">
                  {formatCurrency(reportData.eal_inr, currency)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-slate-50">
                <div className="text-[11px] text-slate-400 print:text-slate-600">95% Value at Risk (VaR)</div>
                <div className="text-lg font-black text-rose-400 print:text-rose-700 mt-0.5">
                  {formatCurrency(reportData.var_95_inr, currency)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-slate-50">
                <div className="text-[11px] text-slate-400 print:text-slate-600">99% Tail Risk (VaR 99)</div>
                <div className="text-lg font-black text-indigo-300 print:text-indigo-800 mt-0.5">
                  {formatCurrency(reportData.var_99_inr, currency)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-slate-50">
                <div className="text-[11px] text-slate-400 print:text-slate-600">Security Posture Score</div>
                <div className="text-lg font-black text-emerald-400 print:text-emerald-700 mt-0.5">
                  {reportData.posture_score} / 100
                </div>
              </div>
            </div>
          </div>

          {/* 2. Top Assets at Risk */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              2. Top Enterprise Assets by Financial Exposure
            </h3>
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead className="bg-slate-950 text-slate-400 print:bg-slate-100 print:text-black">
                <tr>
                  <th className="p-2 border-b border-slate-800">Asset Name</th>
                  <th className="p-2 border-b border-slate-800">Business Unit</th>
                  <th className="p-2 border-b border-slate-800">Tier</th>
                  <th className="p-2 border-b border-slate-800">Top Vulnerability</th>
                  <th className="p-2 border-b border-slate-800">Expected Loss (EAL)</th>
                  <th className="p-2 border-b border-slate-800">95% VaR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {reportData.top_assets?.map((a) => (
                  <tr key={a.asset_id}>
                    <td className="p-2 font-semibold text-white print:text-black">{a.asset_name}</td>
                    <td className="p-2 text-slate-400 print:text-slate-600">{a.business_unit}</td>
                    <td className="p-2">{a.criticality.split(" ")[0]}</td>
                    <td className="p-2 font-mono text-amber-300 print:text-amber-700">{a.top_vulnerability}</td>
                    <td className="p-2 font-bold text-white print:text-black">{formatCurrency(a.expected_annual_loss, currency)}</td>
                    <td className="p-2 font-bold text-rose-400 print:text-rose-700">{formatCurrency(a.value_at_risk_95, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Regulatory Framework Scores */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              3. Statutory Framework & Compliance Posture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {reportData.framework_scores?.map((fw) => (
                <div key={fw.framework_name} className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-slate-50">
                  <div className="font-bold text-white print:text-black text-xs">{fw.framework_name}</div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span>Compliance: <strong className="text-cyan-400 print:text-black">{fw.overall_compliance_percentage}%</strong></span>
                    <span className="text-rose-400 print:text-rose-700">{fw.gap_count} Audit Gaps</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Gap Risk Exposure: {formatCurrency(fw.financial_exposure_from_gaps, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Optimized Capital Investment Allocation */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 pb-1">
              4. Board-Recommended Security Investment Portfolio
            </h3>
            <p className="text-xs text-slate-300 print:text-slate-700">
              Under an authorized budget ceiling of <strong>{formatCurrency(reportData.total_budget, currency)}</strong>, the 0/1 Knapsack optimization algorithm recommends allocating <strong>{formatCurrency(reportData.total_spend, currency)}</strong> across the following controls to achieve <strong>{formatCurrency(reportData.projected_risk_reduction, currency)}</strong> in annual risk reduction (ROSI: <strong>{reportData.projected_rosi?.toFixed(1)}%</strong>):
            </p>

            <div className="space-y-2 pt-1">
              {reportData.selected_investments?.map((sel) => (
                <div key={sel.control.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 print:border-slate-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white print:text-black">{sel.control.name}</span>
                    <div className="text-[11px] text-slate-400 print:text-slate-600">{sel.control.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-cyan-400 print:text-black">{formatCurrency(sel.allocated_cost, currency)}</div>
                    <div className="text-[11px] text-emerald-400 print:text-emerald-700">ROSI: +{sel.rosi_percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-400 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="h-10 border-b border-slate-700 print:border-slate-400" />
              <div className="mt-1 font-bold text-slate-300 print:text-black">Chief Information Security Officer (CISO)</div>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700 print:border-slate-400" />
              <div className="mt-1 font-bold text-slate-300 print:text-black">Chief Risk Officer (CRO)</div>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700 print:border-slate-400" />
              <div className="mt-1 font-bold text-slate-300 print:text-black">Chair, Board Risk Committee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
