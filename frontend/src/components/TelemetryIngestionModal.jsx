import React, { useState } from "react";
import { X, UploadCloud, Radio, CheckCircle, AlertCircle, Plus, RefreshCw } from "lucide-react";

export default function TelemetryIngestionModal({ isOpen, onClose, onIngestTelemetry, onUploadSuccess }) {
  if (!isOpen) return null;

  const [source, setSource] = useState("SIEM (Splunk/Elastic)");
  const [severity, setSeverity] = useState("High");
  const [eventType, setEventType] = useState("Anomalous Lateral Movement");
  const [assetId, setAssetId] = useState("ASSET-02");
  const [description, setDescription] = useState("Multiple automated SMB connections detected across core database subnet.");
  const [metricValue, setMetricValue] = useState("75");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
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

  const handleSimulateScanUpload = () => {
    setLoading(true);
    setTimeout(async () => {
      await onIngestTelemetry({
        source: "Tenable/Qualys Scanner",
        severity: "Critical",
        event_type: "Automated Scan: 3 New Critical CVEs Identified",
        asset_id: "ASSET-01",
        description: "Bulk vulnerability scan completed: CVE-2024-38063 and CVE-2024-4577 updated with live EPSS scores.",
        metric_value: 98.0
      });
      setLoading(false);
      setSuccessMsg("Vulnerability report processed! Ingested 3 new CVEs into FAIR engine.");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="cyber-glass-glow rounded-2xl max-w-xl w-full border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ingest Security Telemetry & Scans</h3>
              <p className="text-xs text-slate-400">Feed live security findings into the FAIR Monte Carlo pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Upload Scan Option */}
          <div className="p-4 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/10 text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
            <div className="text-xs font-bold text-white">Upload Vulnerability Scan Report (JSON / CSV / XML)</div>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Supports Nessus, Qualys, Rapid7, AWS Security Hub, or Microsoft Defender export formats.
            </p>
            <button
              onClick={handleSimulateScanUpload}
              disabled={loading}
              className="mt-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing Scan..." : "Simulate Automated Scanner Feed Ingest"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider justify-center">
            <span>— OR Manual Telemetry Event Ingest —</span>
          </div>

          {/* Manual Ingestion Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                  <option>VulnScanner (Tenable/Qualys)</option>
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
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  <option value="ASSET-05">ASSET-05: SWIFT Gateway</option>
                  <option value="ASSET-06">ASSET-06: Customer Data Lake</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Metric / Velocity Score</label>
                <input
                  type="number"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Event Type</label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Technical Finding Description</label>
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
                Ingest & Recalculate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
