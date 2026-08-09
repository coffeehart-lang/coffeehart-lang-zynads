import { useState } from 'react';
import { AdCreativeAsset } from '../types';
import { INITIAL_CREATIVES } from '../data';
import { 
  Plus, Copy, Check, Sparkles, Video, ExternalLink, MousePointer, Target,
  Wand2, Sliders, Volume2, Film, Zap, Layers, Activity, Music, Eye, Radio, Sun, CheckCircle2
} from 'lucide-react';

interface TransitionEffect {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
}

interface VisualFilter {
  id: string;
  name: string;
  previewColor: string;
  description: string;
}

interface AudioDuckingSetting {
  id: string;
  name: string;
  level: string;
  description: string;
  enabled: boolean;
}

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

  // Effect Selection Panel State
  const [activeTab, setActiveTab] = useState<'effects' | 'creatives'>('effects');
  const [selectedTransition, setSelectedTransition] = useState<string>('cross-dissolve');
  const [transitionSpeed, setTransitionSpeed] = useState<number>(0.8);
  const [selectedFilter, setSelectedFilter] = useState<string>('teal-orange');
  const [filterIntensity, setFilterIntensity] = useState<number>(85);
  
  const [audioDucking, setAudioDucking] = useState<AudioDuckingSetting[]>([
    { id: 'ducking-voice', name: 'Smart Voiceover Ducking', level: '-12 dB', description: 'Automatically lowers background music when voiceover speech is detected', enabled: true },
    { id: 'ducking-fade', name: 'Dialogue Auto-Fade', level: '0.4s Release', description: 'Smooth exponential volume ramp during dialogue breaks', enabled: true },
    { id: 'ducking-denoise', name: 'AI Noise Gate & Speech Isolation', level: 'High Quality', description: 'Eliminates room reverb and background hiss from recorded vocals', enabled: true },
    { id: 'ducking-spatial', name: '3D Spatial Audio Mastering', level: 'Stereo Expand', description: 'Enhances stereo depth for dynamic broadcast ad playback', enabled: false }
  ]);

  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const transitions: TransitionEffect[] = [
    { id: 'cross-dissolve', name: 'Cross Dissolve', category: 'Smooth', duration: '0.8s', description: 'Elegant cinematic fade between commercial scenes' },
    { id: 'whip-pan', name: 'Whip Pan Motion', category: 'Dynamic', duration: '0.4s', description: 'Fast directional motion blur transition for high-energy ads' },
    { id: 'fade-black', name: 'Fade to Black & Rise', category: 'Dramatic', duration: '1.0s', description: 'Classic broadcast pause before call-to-action scene' },
    { id: 'zoom-blur', name: 'Zoom Impact Blur', category: 'Action', duration: '0.5s', description: 'Inward camera pulse highlighting key product reveal' },
    { id: 'glitch-wipe', name: 'Digital Glitch Wipe', category: 'Modern Tech', duration: '0.3s', description: 'Cyberpunk stylized pixel shift for tech & SaaS commercials' }
  ];

  const visualFilters: VisualFilter[] = [
    { id: 'teal-orange', name: '4K Cinema Teal & Orange', previewColor: 'from-amber-500 via-teal-700 to-cyan-900', description: 'Hollywood blockbuster color grade with vibrant skin tones and cool shadow contrast' },
    { id: 'vintage-film', name: '16mm Vintage Grain', previewColor: 'from-orange-700 via-amber-800 to-yellow-900', description: 'Warm nostalgic film stock curve with organic micro-grain overlay' },
    { id: 'hdr-contrast', name: 'HDR High Dynamic Contrast', previewColor: 'from-slate-900 via-indigo-950 to-blue-900', description: 'Punchy blacks and ultra-bright highlights for crisp product showcase' },
    { id: 'golden-hour', name: 'Golden Hour Sunset', previewColor: 'from-yellow-500 via-orange-600 to-rose-700', description: 'Soft warm glow with enhanced amber light leaks' },
    { id: 'noir-mono', name: 'Noir Monochromatic', previewColor: 'from-slate-950 via-slate-700 to-slate-200', description: 'High-contrast monochrome for high-end luxury brand aesthetics' }
  ];

  const handleToggleDucking = (id: string) => {
    setAudioDucking(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const handleApplyMasterEffects = () => {
    setAppliedNotice('✨ Commercial Effects Preset Applied to Active Commercial Render!');
    setTimeout(() => setAppliedNotice(null), 3500);
  };

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
      {/* Top Header & Main Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Ad Copy & Commercial Production Hub</h2>
          <p className="text-xs text-slate-500">Configure post-production effects, transitions, audio ducking, and manage creative copy variations</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('effects')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'effects'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Commercial Effects Panel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('creatives')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'creatives'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Copy Variations ({creatives.length})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Copy Variation
          </button>
        </div>
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
                  MiniMax H3 • Google Veo • Runway • Luma
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Transfer your script concepts into dedicated AI video generation tools directly inside our Commercial Studio.
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

      {/* TAB 1: COMMERCIAL PRODUCTION POST-EFFECTS & MASTERING SELECTION PANEL */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          {/* Status Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Commercial Post-Production Suite
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                    4K Broadcast Master
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select transitions, color grade filters, and audio ducking thresholds for polished commercial output.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyMasterEffects}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Apply Effects to Active Render
            </button>
          </div>

          {appliedNotice && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold rounded-xl flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {appliedNotice}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
            </div>
          )}

          {/* 3-Column Grid: Transitions, Filters, Audio Ducking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: TRANSITIONS PANEL */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">Scene Transitions</h4>
                </div>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  {transitions.length} FX
                </span>
              </div>

              {/* Transition List */}
              <div className="space-y-2.5">
                {transitions.map((t) => {
                  const isSelected = selectedTransition === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTransition(t.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          {t.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {t.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{t.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Transition Speed Slider */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Transition Speed ({transitionSpeed}s)</span>
                  <span className="text-[10px] font-mono text-slate-400">0.2s - 2.0s</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={transitionSpeed}
                  onChange={(e) => setTransitionSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* COLUMN 2: COLOR FILTERS & COLOR GRADING */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900">Color Grade Filters</h4>
                </div>
                <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  4K CINEMA
                </span>
              </div>

              {/* Color Filter Swatches */}
              <div className="space-y-2.5">
                {visualFilters.map((f) => {
                  const isSelected = selectedFilter === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${f.previewColor} shrink-0 shadow-xs`} />
                          <span className="text-xs font-bold text-slate-900">{f.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{f.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filter Intensity Slider */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Filter Grade Strength ({filterIntensity}%)</span>
                  <span className="text-[10px] font-mono text-slate-400">0% - 100%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filterIntensity}
                  onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* COLUMN 3: AUDIO DUCKING & SOUND DESIGN */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">Audio Ducking & Vocal Mix</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  AUTO-MASTER
                </span>
              </div>

              {/* Audio Ducking Toggles */}
              <div className="space-y-3">
                {audioDucking.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-emerald-600" />
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleDucking(item.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          item.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                            item.enabled ? 'left-4.5' : 'left-0.75'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-600">
                      <span>Threshold / Profile:</span>
                      <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.level}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CREATIVE AD COPY VARIATIONS GRID */}
      {activeTab === 'creatives' && (
        <div className="space-y-4">
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
        </div>
      )}

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

