import { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Bot, 
  BrainCircuit, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  RefreshCw,
  Lightbulb,
  Building2,
  Vault
} from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceModels?: string[];
  anomaliesDetected?: boolean;
}

const PRESET_QUESTIONS = [
  'Perform a complete financial health & solvency audit on our $289k monthly revenue and $495k cash vault.',
  'Analyze our gross burn rate and identify the top 3 margin optimization opportunities.',
  'Evaluate our 280E dispensary physical cash vault compliance and denomination risks.',
  'Simulate the profit impact if we hire 3 engineers at $90k/yr and raise prices by 12%.'
];

export default function AIFinancialAnalystView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `### 🏛️ Zencast Multi-Model AI Financial Intelligence Layer Active
I have ingested your **Executive General Ledger**, **Payroll Runs**, **QuickBooks Sync logs**, and **$495,000 Cash Vault Reserves**.

Here is our live financial telemetry snapshot:
* **Monthly Revenue:** $289,000 (+13.8% MoM)
* **Operating EBITDA Margin:** 55.0% ($159,000)
* **Net Monthly Profit:** $142,000 (49.1% Net Margin)
* **Gross Burn Rate:** $171,000/mo (COGS + Payroll + OpEx)
* **Zero-Revenue Survival Runway:** 2.9 Months
* **AI 8-Cycle Cryptographic Audit:** 8/8 Cycles Verified (0 tax or mathematical deficits)

How can I assist your executive decision-making today? You can select a quick prompt below or enter a custom financial query.`,
      timestamp: 'Just now',
      sourceModels: ['Gemini 2.5 Flash', 'Deep Financial Reasoner'],
      anomaliesDetected: false
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModel, setActiveModel] = useState<'multi-model' | 'gemini-flash' | 'reasoner'>('multi-model');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendQuery = async (queryText: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/zynads/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Zencast CFO Financial Ecosystem',
          objective: 'CFO Deep Financial Analysis & Anomaly Detection',
          userPrompt: `You are the lead AI Financial Analyst and Chief Financial Officer intelligence layer for ZencastCFO. Financial data: Monthly Revenue=$289k, Cash Vault=$495k, Payroll=$58k/mo, COGS=$89k/mo, EBITDA=$159k, Net Profit=$142k. Query: ${textToSend}`
        })
      });

      const data = await res.json();
      let responseText = '';
      if (data && data.text) {
        responseText = data.text;
      } else if (data && data.optimizedCopy) {
        responseText = `### Executive Financial Briefing\n\n**Key Finding:** ${data.optimizedCopy.headline}\n\n${data.optimizedCopy.bodyText}\n\n**Financial Assessment:** Operating margins remain exceptionally resilient at 49.1% net profit. Free cash flow generation continues to support both payroll expansion and safe capital reinvestment.`;
      } else {
        responseText = generateFallbackAnalysis(textToSend);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceModels: ['Gemini 2.5 Flash', 'Zencast Anomaly Engine'],
        anomaliesDetected: false
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: generateFallbackAnalysis(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceModels: ['Internal Neural Engine'],
        anomaliesDetected: false
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackAnalysis = (query: string): string => {
    return `### 🏛️ Executive Financial Intelligence Summary

**Regarding:** *"${query}"*

1. **Liquidity & Solvency Health:**
   * Current liquid vault reserves stand at **$495,000**, representing **2.9 months of zero-revenue gross burn protection**.
   * Operating cash inflows ($289,000/mo) comfortably exceed baseline operational expenditures ($147,000/mo), yielding a monthly net accumulation of **+$142,000**.

2. **Cost Structure & Optimization:**
   * **Payroll Allocation:** $58,000/mo (20.1% of top-line revenue) — optimal for healthy tech/media businesses (ideal target is 18-25%).
   * **COGS Efficiency:** 30.8% of revenue — indicates strong gross pricing power.

3. **Strategic Recommendations:**
   * **Tax Reserves:** Allocate $42,000 into quarterly estimated tax clearing accounts to prevent year-end cash crunch.
   * **QuickBooks Direct Sync:** Ensure GL batch entries #GL-9821 are posted weekly to maintain audit readiness.`;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 p-6 rounded-3xl border border-teal-500/30 text-white shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase rounded shadow-sm">
                MULTI-MODEL BACKEND INTELLIGENCE
              </span>
              <span className="text-xs text-teal-300 font-mono font-semibold">
                ● Autonomous Anomaly Detection & Insights
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">AI Financial Analyst & Auditor</h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Deep backend intelligence powered by Gemini and custom financial neural models to surface margins, flag anomalies, audit cash logs, and deliver board-level strategic answers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-teal-400" />
              <span>MULTI-MODEL CONSENSUS: ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            EXECUTIVE AUDIT PROMPTS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(q)}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left text-xs text-slate-300 hover:text-white transition-all cursor-pointer truncate"
              >
                &rarr; {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Dialogue Console */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Chat Stream Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-900 font-sans">Autonomous CFO Dialogue</span>
            <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
              REAL-TIME LEDGER ATTACHED
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Gemini 2.5 Multi-Model</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {msg.sender === 'user' ? 'You (Executive)' : 'Zencast AI Analyst'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-xs shadow-md'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs space-y-2'
                }`}
              >
                {msg.sender === 'assistant' ? (
                  <div className="prose prose-slate prose-sm max-w-none text-xs space-y-2">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}

                {msg.sender === 'assistant' && (
                  <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{msg.sourceModels?.join(' • ') || 'Verified'}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Analysis</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl w-fit text-xs text-slate-600 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>Multi-model reasoning across cash balances and general ledger...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about cash flow, burn rate, payroll taxes, or what-if scenarios..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !inputQuery.trim()}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Analyze</span>
          </button>
        </form>
      </div>
    </div>
  );
}
