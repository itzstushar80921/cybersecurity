import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  CornerDownLeft,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Clock
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function AiRiskCopilot({ currency, onQueryCopilot }) {
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: (
        "Hello! I am your **CyberQuant-AI™ Executive Risk Copilot**.\n\n" +
        "I continuously translate low-level technical security telemetry (CVEs, SIEM events, EDR alerts, CSPM findings) " +
        "into **monetary cyber exposure**, **ROSI metrics**, and **regulatory compliance guidance**.\n\n" +
        "You can ask me questions in plain business English or select one of the suggested prompts below."
      ),
      metrics: null,
      followups: [
        "What is our highest financial cyber risk today?",
        "What is the best investment allocation for a ₹1 Crore budget?",
        "How does our RBI Cyber Security Framework compliance stand?",
        "What happens if patch remediation is delayed by 30 days?"
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await onQueryCopilot(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.answer,
          metrics: res.referenced_metrics,
          followups: res.suggested_followups
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an error retrieving live risk data. Please ensure the backend server is running on port 8000.",
          metrics: null,
          followups: ["What is our highest financial cyber risk today?"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "What is our highest financial cyber risk today?",
    "Best allocation for ₹1 Crore budget?",
    "How does our RBI compliance stand?",
    "Impact of 30-day patch delay?"
  ];

  return (
    <div className="cyber-glass rounded-2xl border-cyan-500/30 flex flex-col h-[760px] overflow-hidden">
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">CyberQuant-AI™ Decision Copilot</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ground Truth FAIR
              </span>
            </div>
            <p className="text-xs text-slate-400">Natural Language CISO & Board Intelligence</p>
          </div>
        </div>
      </div>

      {/* Message Chat Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-cyan-600 text-white font-medium rounded-tr-none shadow-lg shadow-cyan-600/20"
                  : "cyber-glass border border-slate-700/80 text-slate-200 rounded-tl-none space-y-3"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {m.text.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="mb-2 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>

              {/* Follow-up suggestions */}
              {m.followups && m.followups.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Suggested Inquiries:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.followups.map((f, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSend(f)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium border border-cyan-500/20 transition-all cursor-pointer text-left"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="cyber-glass p-3 rounded-2xl rounded-tl-none border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Analyzing Monte Carlo distributions and synthesizing risk recommendation...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips above input */}
      <div className="px-5 py-2 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 whitespace-nowrap">Suggested:</span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sp)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 whitespace-nowrap cursor-pointer transition-all"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'What is our worst-case cyber loss?', 'Optimal controls for ₹75L?')..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
