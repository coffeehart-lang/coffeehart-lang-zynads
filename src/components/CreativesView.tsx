import { useState } from 'react';
import { AdCreativeAsset } from '../types';
import { INITIAL_CREATIVES } from '../data';
import { Palette, Plus, Copy, Check, Sparkles, LayoutGrid, Tag, MousePointer, Target, Video, ExternalLink } from 'lucide-react';

export default function CreativesView() {
  const [creatives, setCreatives] = useState<AdCreativeAsset[]>(INITIAL_CREATIVES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string>('All');

  // New creative form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [ctaText, setCtaText] = useState('Claim Free Trial');
  const [format, setFormat] = useState<AdCreativeAsset['format']>('Single Image');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    const newAsset: AdCreativeAsset = {
      id: `asset-${Date.now()}`,
      campaignId: 'camp-101',
      title: title.trim() || 'New Ad Variation',
      headline: headline.trim(),
      bodyText: bodyText.trim() || 'High-impact ad copy.',
      ctaText: ctaText.trim(),
      format,
      status: 'Active',
      ctr: 3.20,
      conversions: 45
    };

    setCreatives([newAsset, ...creatives]);
    setTitle('');
    setHeadline('');
    setBodyText('');
    setIsModalOpen(false);
  };

  const filteredCreatives = creatives.filter(c => formatFilter === 'All' || c.format === formatFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Ad Copy & Creative Asset Hub</h2>
          <p className="text-xs text-slate-500">Manage headlines, primary text variations, and call-to-action buttons for ad testing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Copy Variation
        </button>
      </div>

      {/* AI Video Generator Integration Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-800/80 rounded-2xl text-white shadow-lg space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-sans flex items-center gap-2">
                Need Cinematic AI Video Ads (MP4)?
                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono">
                  Google Veo • Runway • Luma • Pika
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Transfer your script concepts into dedicated AI video generation tools (Google Veo, Runway Gen-3, Luma Dream Machine, or Pika) directly inside our Commercial Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://deepmind.google/technologies/veo/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
            >
              Google Veo <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
            <a
              href="https://runwayml.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1"
            >
              Runway Gen-3 <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Format Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Single Image', 'Carousel', 'Short Video', 'Search Text'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setFormatFilter(fmt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              formatFilter === fmt
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Grid of Creative Variations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreatives.map((creative) => (
          <div
            key={creative.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px] uppercase rounded-md border border-indigo-100">
                  {creative.format}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Active in Campaign
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{creative.title}</h3>
                <p className="text-xs font-bold text-indigo-900 mt-1 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  "{creative.headline}"
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                <p className="leading-relaxed font-sans">{creative.bodyText}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Button CTA:</span>
                  <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {creative.ctaText}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                  <MousePointer className="w-3 h-3 text-indigo-500" /> CTR: <strong>{creative.ctr}%</strong>
                </span>
                <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                  <Target className="w-3 h-3 text-emerald-500" /> Conv: <strong>{creative.conversions}</strong>
                </span>
              </div>

              <button
                onClick={() => handleCopy(`${creative.headline}\n${creative.bodyText}`, creative.id)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
              >
                {copiedId === creative.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Creative Variation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Ad Creative & Copy</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Asset Label / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Discount Variation B"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turn Browsers into Buyers in 3 Steps"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Body Text</label>
                <textarea
                  rows={3}
                  placeholder="Ad body copy..."
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format Type</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as AdCreativeAsset['format'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Single Image">Single Image</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Short Video">Short Video</option>
                    <option value="Search Text">Search Text</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
