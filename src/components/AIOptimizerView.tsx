import { useState } from 'react';
import { Sparkles, Megaphone, Send, Copy, Check, Lightbulb, Target, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';

export default function AIOptimizerView() {
  const [productName, setProductName] = useState('ZynAds Growth Engine');
  const [platform, setPlatform] = useState('Meta & Google Ads');
  const [objective, setObjective] = useState('Conversions');
  const [budget, setBudget] = useState('250');
  const [targetAudience, setTargetAudience] = useState('E-commerce Founders & Digital Marketers');
  const [userPrompt, setUserPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setIsLoading(true);
    setResultText(null);

    try {
      const res = await fetch('/api/zynads/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          platform,
          objective,
          budget,
          targetAudience,
          userPrompt
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setResultText(data.text);
      } else {
        setResultText('Failed to generate ad strategy. Please verify server connection.');
      }
    } catch (err) {
      setResultText('Network error when requesting AI ad optimization.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-800/80 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/30 rounded-lg text-indigo-300">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">ZynAds AI Copilot</span>
        </div>
        <h2 className="text-2xl font-bold font-sans tracking-tight">AI Copy & Campaign Strategy Generator</h2>
        <p className="text-xs text-slate-300 max-w-2xl">
          Instantly generate viral ad headlines, high-converting copy variants, audience interest clusters, and budget bidding rules optimized for Meta, Google, TikTok, and LinkedIn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Campaign Parameters</h3>

          <form onSubmit={handleOptimize} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product / Brand / Offer Name *</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. ZynAds Software"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ad Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Meta (FB & IG)">Meta (FB & IG)</option>
                  <option value="Google Search & Display">Google Search & Display</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="LinkedIn B2B">LinkedIn B2B</option>
                  <option value="Omnichannel (All Networks)">Omnichannel (All)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Goal</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Direct Sales & Conversions">Conversions</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Website Traffic">Website Traffic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Daily Budget ($)</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience Notes</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Demographics, interests..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Specific Prompt / Niche Details (Optional)</label>
              <textarea
                rows={2}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Focus on high ROI, quick implementation, and 20% discount offer..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run AI Strategy Optimizer
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Output Output Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 min-h-[400px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" /> AI Optimization Strategy Output
              </h3>
              {resultText && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Strategy</>}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Analyzing ad algorithms and writing high-converting headlines...</p>
              </div>
            ) : resultText ? (
              <div className="prose prose-slate prose-sm max-w-none text-xs leading-relaxed space-y-2 text-slate-700">
                <Markdown>{resultText}</Markdown>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 text-slate-400">
                <Sparkles className="w-8 h-8 text-indigo-300 mx-auto" />
                <p className="text-xs font-medium text-slate-500">Enter your campaign details and click "Run AI Strategy Optimizer" to generate ad copy.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>ZynAds AI Model v2.5</span>
            <span>Powered by Gemini API</span>
          </div>
        </div>
      </div>
    </div>
  );
}
