import { useState } from 'react';
import { AudienceSegment } from '../types';
import { INITIAL_AUDIENCES } from '../data';
import { Users, Plus, Globe, Tag, Target, Search, Sparkles } from 'lucide-react';

export default function AudiencesView() {
  const [audiences, setAudiences] = useState<AudienceSegment[]>(INITIAL_AUDIENCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Audience Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('United States & Canada');
  const [ageRange, setAgeRange] = useState('25 - 54');
  const [interestsStr, setInterestsStr] = useState('Growth Marketing, E-commerce, Paid Ads');
  const [reach, setReach] = useState(2500000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAud: AudienceSegment = {
      id: `aud-${Date.now()}`,
      name: name.trim(),
      location: location.trim(),
      ageRange: ageRange.trim(),
      interests: interestsStr.split(',').map(i => i.trim()).filter(Boolean),
      estimatedReach: Number(reach) || 1000000,
      matchRate: '92%'
    };

    setAudiences([newAud, ...audiences]);
    setName('');
    setIsModalOpen(false);
  };

  const filteredAudiences = audiences.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Audience Segments & Targeting</h2>
          <p className="text-xs text-slate-500">Define high-intent demographic segments and lookalike profiles for ad distribution</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Audience Profile
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search audience profiles or interest tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Audience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAudiences.map((aud) => (
          <div
            key={aud.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{aud.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block">Ages {aud.ageRange}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] rounded">
                Match: {aud.matchRate}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{aud.location}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                  Interest & Behavioral Targeting
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aud.interests.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Estimated Reach:</span>
              <span className="font-bold text-indigo-600">
                {(aud.estimatedReach / 1000000).toFixed(1)}M Users
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Audience */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Audience Segment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Audience Segment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Income E-commerce Buyers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Geographies</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age Range</label>
                  <input
                    type="text"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interests & Behaviors (comma separated)</label>
                <input
                  type="text"
                  value={interestsStr}
                  onChange={(e) => setInterestsStr(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Est. Reach Count</label>
                <input
                  type="number"
                  step="500000"
                  value={reach}
                  onChange={(e) => setReach(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Audience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
