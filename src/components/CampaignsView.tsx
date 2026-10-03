import { useState } from 'react';
import { AdCampaign, AdPlatform, CampaignObjective } from '../types';
import { Plus, Search, Play, Pause, Trash2, Edit3, Megaphone, DollarSign, Filter, X, Sparkles, Target } from 'lucide-react';

interface CampaignsViewProps {
  campaigns: AdCampaign[];
  onAddCampaign: (campaign: Omit<AdCampaign, 'id'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  isPrivacyMode: boolean;
}

export default function CampaignsView({
  campaigns,
  onAddCampaign,
  onToggleStatus,
  onDeleteCampaign,
  isPrivacyMode
}: CampaignsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign Form state
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<AdPlatform>('Meta (FB/IG)');
  const [objective, setObjective] = useState<CampaignObjective>('Conversions');
  const [dailyBudget, setDailyBudget] = useState<number>(150);
  const [targetAudience, setTargetAudience] = useState('');
  const [adCopy, setAdCopy] = useState('');
  const [headline, setHeadline] = useState('');

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          camp.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'All' || camp.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCampaign({
      name: name.trim(),
      platform,
      objective,
      dailyBudget: Number(dailyBudget) || 100,
      totalSpent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      cpc: 0,
      roas: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetAudience: targetAudience.trim() || 'General Growth Audience',
      headlines: headline ? [headline.trim()] : ['High-Converting Ad Headline'],
      adCopy: adCopy.trim() || 'Compelling primary ad text designed to drive clicks and conversions.',
      status: 'Active'
    });

    // Reset form
    setName('');
    setTargetAudience('');
    setAdCopy('');
    setHeadline('');
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    if (isPrivacyMode) return '••••••';
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Ad Campaigns Manager</h2>
          <p className="text-xs text-slate-500">Configure, monitor, and scale paid advertising campaigns across networks</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns or audiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['All', 'Meta (FB/IG)', 'Google Ads', 'TikTok Ads', 'LinkedIn Ads', 'Display Network'].map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                platformFilter === plat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Cards / Table */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No ad campaigns found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filter or create a new campaign to get started.</p>
          </div>
        ) : (
          filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      camp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : camp.status === 'Paused'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {camp.status}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[10px] uppercase tracking-wider font-mono">
                      {camp.platform}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                      Goal: {camp.objective}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">{camp.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Target className="w-3 h-3 text-slate-400" /> Target: <span className="font-medium text-slate-700">{camp.targetAudience}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(camp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      camp.status === 'Active'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {camp.status === 'Active' ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Activate</>}
                  </button>
                  <button
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats & Copy Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Daily Budget</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(camp.dailyBudget)}/day</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Spent</span>
                  <span className="font-bold text-slate-900 font-mono">{formatCurrency(camp.totalSpent)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Impressions</span>
                  <span className="font-bold text-slate-800 font-mono">{isPrivacyMode ? '••••' : camp.impressions.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Clicks (CTR)</span>
                  <span className="font-bold text-slate-800 font-mono">{isPrivacyMode ? '••••' : `${camp.clicks} (${camp.ctr}%)`}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Conversions</span>
                  <span className="font-bold text-emerald-600 font-mono">{isPrivacyMode ? '••••' : camp.conversions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">ROAS</span>
                  <span className="font-bold text-indigo-600 font-mono">{camp.roas > 0 ? `${camp.roas}x` : '—'}</span>
                </div>
              </div>

              {/* Sample Ad Copy preview */}
              {camp.adCopy && (
                <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/60 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px]">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Active Ad Headline: {camp.headlines[0] || camp.name}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{camp.adCopy}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Launch New Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Launch New Ad Campaign</h3>
                  <p className="text-xs text-slate-500">Configure parameters for ZynAds campaign distribution</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Growth Retargeting Campaign"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Network</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as AdPlatform)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Meta (FB/IG)">Meta (FB/IG)</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="LinkedIn Ads">LinkedIn Ads</option>
                    <option value="Display Network">Display Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Campaign Objective</label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Conversions">Conversions</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Website Traffic">Website Traffic</option>
                    <option value="App Installs">App Installs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Daily Budget ($)</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Demographics</label>
                  <input
                    type="text"
                    placeholder="e.g. US Marketers Ages 25-50"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ad Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Boost Return on Ad Spend by 4x"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Ad Copy / Text</label>
                <textarea
                  rows={3}
                  placeholder="Primary text shown to targeted users..."
                  value={adCopy}
                  onChange={(e) => setAdCopy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md cursor-pointer"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
