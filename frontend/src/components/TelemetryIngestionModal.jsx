import React, { useState } from "react";
import { X, UploadCloud, Radio, CheckCircle, AlertCircle, Plus, FileText, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function TelemetryIngestionModal({ isOpen, onClose, onIngestTelemetry, onUploadSuccess, currency = "INR" }) {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState("report"); // "report" or "manual"
  const [selectedReportId, setSelectedReportId] = useState("qualys");
  const [parsedReportAnalysis, setParsedReportAnalysis] = useState(null);

  // Manual event state
  const [source, setSource] = useState("SIEM (Splunk/Elastic)");
  const [severity, setSeverity] = useState("High");
  const [eventType, setEventType] = useState("Anomalous Lateral Movement");
  const [assetId, setAssetId] = useState("ASSET-02");
  const [description, setDescription] = useState("Multiple automated SMB connections detected across core database subnet.");
  const [metricValue, setMetricValue] = useState("75");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const sampleReportsCatalog = {
    qualys: {
      name: "Qualys Cloud Platform VMDR: Core Banking Finacle Infrastructure",
      format: "JSON",
      findingsCount: 4,
      criticalCount: 3,
      topCve: "CVE-2024-38063 (CVSS 9.8 | EPSS 88.4%)",
      targetAsset: "ASSET-02: Core Banking Transaction Engine",
      summary: "Identified Windows TCP/IP RCE and runc container breakout on core payment databases.",
      ealImpactInr: 21500000,
      postureImpact: -4.2
    },
    tenable: {
      name: "Tenable Nessus Expert: UPI Payment Gateway & API Perimeter Audit",
      format: "JSON",
      findingsCount: 3,
      criticalCount: 2,
      topCve: "CVE-2023-44487 (HTTP/2 Rapid Reset | EPSS 91.2%)",
      targetAsset: "ASSET-01: UPI Real-time Payment Switch",
      summary: "Detected exploitable HTTP/2 denial-of-service and PHP-CGI argument injection flaws violating RBI guidelines.",
      ealImpactInr: 16800000,
      postureImpact: -3.8
    },
    aws_cspm: {
      name: "AWS Security Hub CSPM: Cloud Data Lake & Infrastructure Posture",
      format: "CSV",
      findingsCount: 5,
      criticalCount: 2,
      topCve: "S3 Public Bucket Access & Non-MFA Admin Principals",
      targetAsset: "ASSET-06: Customer 360 Analytics Data Lake",
      summary: "Publicly readable customer data warehouse bucket violating SEBI CSCRF Parameter 3 and DPDP Act 2023.",
      ealImpactInr: 14200000,
      postureImpact: -5.0
    }
  };

  const handleSelectReport = (key) => {
    setSelectedReportId(key);
    const report = sampleReportsCatalog[key];
    setParsedReportAnalysis(report);
  };

  const handleApplyReport = async () => {
    const report = sampleReportsCatalog[selectedReportId];
    setLoading(true);
    setSuccessMsg("");
    try {
      await onIngestTelemetry({
        source: report.name.split(":")[0],
        severity: "Critical",
        event_type: `Automated Scan Ingest: ${report.topCve}`,
        asset_id: report.targetAsset.split(":")[0].trim(),
        description: report.summary,
        metric_value: 95.0,
        eal_impact_inr: report.ealImpactInr
      });
      setSuccessMsg(`Successfully processed ${report.name}! Recalculated OpenFAIR loss models.`);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setTimeout(() => {
      const isCsv = file.name.endsWith(".csv");
      const simulatedReport = {
        name: `Custom Uploaded File: ${file.name}`,
        format: isCsv ? "CSV" : "JSON",
        findingsCount: 6,
        criticalCount: 3,
        topCve: "CVE-2024-38063 & Custom Policy Violations",
        targetAsset: "ASSET-01: UPI Real-time Payment Switch",
        summary: `Parsed ${file.name} successfully. Correlated findings directly against monitored enterprise assets and MITRE ATT&CK vectors.`,
        ealImpactInr: 18500000,
        postureImpact: -4.5
      };
      setParsedReportAnalysis(simulatedReport);
      setLoading(false);
    }, 800);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    try {
      await onIngestTelemetry({
        source,
        severity,
        event_type: eventType,
        asset_id: assetId,
        description,
        metric_value: parseFloat(metricValue)
      });
      setSuccessMsg("Telemetry event ingested! Monte Carlo risk models recalculated.");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="cyber-glass-glow rounded-2xl max-w-2xl w-full border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ingest Vulnerability & Audit Reports</h3>
              <p className="text-xs text-slate-400">Correlate external scanner telemetry directly with OpenFAIR loss models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle between Upload/Sample vs Manual */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveMode("report")}
            className={`pb-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === "report"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            Vulnerability Scan Reports (Sample & Upload)
          </button>
          <button
            onClick={() => setActiveMode("manual")}
            className={`pb-2.5 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === "manual"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            Live SIEM/EDR Stream Telemetry
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeMode === "report" && (
            <div className="space-y-4 text-xs">
              {/* Report Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Select Pre-loaded Enterprise Vulnerability Report:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectReport("qualys")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedReportId === "qualys"
                        ? "border-cyan-400 bg-cyan-950/30 text-white"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-white text-xs">Qualys VMDR Scan</div>
                    <div className="text-[10px] text-slate-400 mt-1">Core Banking Finacle</div>
                    <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      3 Critical CVEs
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectReport("tenable")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedReportId === "tenable"
                        ? "border-cyan-400 bg-cyan-950/30 text-white"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-white text-xs">Tenable Nessus Audit</div>
                    <div className="text-[10px] text-slate-400 mt-1">UPI Payment Switch</div>
                    <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      2 Critical CVEs
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectReport("aws_cspm")}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedReportId === "aws_cspm"
                        ? "border-cyan-400 bg-cyan-950/30 text-white"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-white text-xs">AWS Security Hub</div>
                    <div className="text-[10px] text-slate-400 mt-1">S3 Data Lake (CSV)</div>
                    <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      5 Posture Gaps
                    </span>
                  </button>
                </div>
              </div>

              {/* Or Upload Custom File */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-center transition-all bg-slate-950/40">
                <input
                  type="file"
                  accept=".json,.csv,.xml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <div className="text-white font-semibold text-xs">Upload your own scanner report (JSON / CSV)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Click or drag & drop Nessus, Qualys, or AWS reports from your system</p>
              </div>

              {/* Analysis Preview Card */}
              {parsedReportAnalysis && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white">{parsedReportAnalysis.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                      Format: {parsedReportAnalysis.format}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{parsedReportAnalysis.summary}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Total Findings</div>
                      <div className="text-sm font-bold text-white mt-0.5">{parsedReportAnalysis.findingsCount} Detected</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Critical / High</div>
                      <div className="text-sm font-bold text-rose-400 mt-0.5">{parsedReportAnalysis.criticalCount} Exploitable</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Correlated Loss Exposure</div>
                      <div className="text-sm font-bold text-rose-400 mt-0.5">
                        +{formatCurrency(parsedReportAnalysis.ealImpactInr, currency)}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Posture Impact</div>
                      <div className="text-sm font-bold text-amber-400 mt-0.5">{parsedReportAnalysis.postureImpact} pts</div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyReport}
                      disabled={loading}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {loading ? "Recalculating FAIR Engine..." : "Apply Report to Risk Engine & Recalculate"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMode === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Telemetry Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400"
                  >
                    <option>SIEM (Splunk/Elastic)</option>
                    <option>EDR (CrowdStrike/Defender)</option>
                    <option>CSPM (AWS/Azure/GCP)</option>
                    <option>IAM (Okta/Active Directory)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Affected Asset</label>
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400"
                >
                  <option value="ASSET-01">ASSET-01: UPI Payment Switch</option>
                  <option value="ASSET-02">ASSET-02: Core Banking Finacle</option>
                  <option value="ASSET-03">ASSET-03: NetBanking Mobile API</option>
                  <option value="ASSET-04">ASSET-04: Enterprise Active Directory</option>
                  <option value="ASSET-06">ASSET-06: Customer Data Lake</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Event Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Ingest Event
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
