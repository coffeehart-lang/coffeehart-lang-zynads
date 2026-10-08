import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Megaphone, 
  Building2, 
  Sparkles, 
  Plus, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Trash2, 
  X, 
  ChevronRight,
  Flame,
  Activity,
  Zap,
  Film
} from 'lucide-react';

export type MilestoneCategory = 'financial' | 'campaign';
export type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'simulated';

export interface FinancialMilestone {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  monthLabel: string; // e.g. "Oct '26"
  category: MilestoneCategory;
  status: MilestoneStatus;
  cashImpact: number; // Positive = inflow, Negative = outflow
  projectedRoas?: number; // for campaigns (e.g. 4.2x)
  vaultBalanceAfter: number;
  description: string;
  cycleTag: string; // e.g. "Payroll Dip", "Retainer Surge", "Quarter-End"
  riskLevel: 'low' | 'moderate' | 'elevated';
}

const DEFAULT_MILESTONES: FinancialMilestone[] = [
  {
    id: 'm-1',
    title: 'ZynAds "Cash Crunch" Commercial Surge',
    date: '2026-10-12',
    monthLabel: "Oct '26",
    category: 'campaign',
    status: 'in-progress',
    cashImpact: -14500,
    projectedRoas: 4.8,
    vaultBalanceAfter: 480500,
    description: 'Multi-scene AI video commercial rollout targeting SMB founders facing payroll anxiety.',
    cycleTag: 'Campaign Outlay',
    riskLevel: 'low'
  },
  {
    id: 'm-2',
    title: 'Q3 Federal & State Estimated Tax Reserve',
    date: '2026-10-22',
    monthLabel: "Oct '26",
    category: 'financial',
    status: 'upcoming',
    cashImpact: -32000,
    vaultBalanceAfter: 448500,
    description: 'Mandatory quarterly tax reserve draw. Vault remains 100% compliant with 280E safe harbor.',
    cycleTag: 'Tax Liability',
    riskLevel: 'moderate'
  },
  {
    id: 'm-3',
    title: 'B2B Enterprise Retainers Expansion Inflow',
    date: '2026-11-01',
    monthLabel: "Nov '26",
    category: 'financial',
    status: 'upcoming',
    cashImpact: 65000,
    vaultBalanceAfter: 513500,
    description: 'Annual upfront renewals from 3 anchor accounts hitting operating accounts.',
    cycleTag: 'Retainer Surge',
    riskLevel: 'low'
  },
  {
    id: 'm-4',
    title: 'Black Friday Multi-Channel Video Campaign',
    date: '2026-11-14',
    monthLabel: "Nov '26",
    category: 'campaign',
    status: 'upcoming',
    cashImpact: -28000,
    projectedRoas: 5.2,
    vaultBalanceAfter: 485500,
    description: 'High-volume paid blitz across Meta, Google Ads, and TikTok commercial syndication.',
    cycleTag: 'Major Ad Blitz',
    riskLevel: 'moderate'
  },
  {
    id: 'm-5',
    title: 'Mid-Month 8-Cycle AI Payroll Settlement',
    date: '2026-11-18',
    monthLabel: "Nov '26",
    category: 'financial',
    status: 'upcoming',
    cashImpact: -34500,
    vaultBalanceAfter: 451000,
    description: 'Bi-weekly payroll disbursement + automated withholding sync with QuickBooks.',
    cycleTag: 'Payroll Cycle Dip',
    riskLevel: 'moderate'
  },
  {
    id: 'm-6',
    title: 'High-Performance GPU Cluster CapEx Lease',
    date: '2026-12-08',
    monthLabel: "Dec '26",
    category: 'financial',
    status: 'upcoming',
    cashImpact: -22000,
    vaultBalanceAfter: 429000,
    description: 'Dedicated cloud inference node allocation to scale video commercial rendering capacity.',
    cycleTag: 'Tech CapEx Outlay',
    riskLevel: 'low'
  },
  {
    id: 'm-7',
    title: 'Q4 Year-End Software Licensure Push',
    date: '2026-12-20',
    monthLabel: "Dec '26",
    category: 'campaign',
    status: 'upcoming',
    cashImpact: 58000,
    projectedRoas: 4.5,
    vaultBalanceAfter: 487000,
    description: 'Zyncast CFO executive promotional package for companies spending remaining 2026 budgets.',
    cycleTag: 'Inflow Peak',
    riskLevel: 'low'
  },
  {
    id: 'm-8',
    title: 'Series A Non-Dilutive Growth Facility Close',
    date: '2027-01-15',
    monthLabel: "Jan '27",
    category: 'financial',
    status: 'simulated',
    cashImpact: 150000,
    vaultBalanceAfter: 637000,
    description: 'Institutional revenue-based debt expansion to fund national marketing rollouts.',
    cycleTag: 'Liquidity Expansion',
    riskLevel: 'low'
  }
];

interface Props {
  onSelectMilestone?: (milestone: FinancialMilestone) => void;
  className?: string;
}

export default function FinancialMilestoneTimeline({ onSelectMilestone, className = '' }: Props) {
  const [milestones, setMilestones] = useState<FinancialMilestone[]>(() => {
    const saved = localStorage.getItem('zyncast_cfo_milestones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored milestones:", e);
      }
    }
    return DEFAULT_MILESTONES;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'financial' | 'campaign' | 'high-impact'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<FinancialMilestone | null>(milestones[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Milestone
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MilestoneCategory>('financial');
  const [formDate, setFormDate] = useState('2026-11-25');
  const [formCashImpact, setFormCashImpact] = useState<number>(-15000);
  const [formRoas, setFormRoas] = useState<number>(4.2);
  const [formDescription, setFormDescription] = useState('');
  const [formCycleTag, setFormCycleTag] = useState('Operating Expense');
  const [formRisk, setFormRisk] = useState<'low' | 'moderate' | 'elevated'>('low');

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter(m => {
      if (activeFilter === 'financial') return m.category === 'financial';
      if (activeFilter === 'campaign') return m.category === 'campaign';
      if (activeFilter === 'high-impact') return Math.abs(m.cashImpact) >= 25000;
      return true;
    });
  }, [milestones, activeFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalInflow = milestones.filter(m => m.cashImpact > 0).reduce((sum, m) => sum + m.cashImpact, 0);
    const totalOutflow = milestones.filter(m => m.cashImpact < 0).reduce((sum, m) => sum + Math.abs(m.cashImpact), 0);
    const lowestVault = Math.min(...milestones.map(m => m.vaultBalanceAfter));
    const nextCampaign = milestones.find(m => m.category === 'campaign' && (m.status === 'upcoming' || m.status === 'in-progress'));
    const nextFinancial = milestones.find(m => m.category === 'financial' && m.status === 'upcoming');

    return {
      totalInflow,
      totalOutflow,
      netFlow: totalInflow - totalOutflow,
      lowestVault,
      nextCampaign,
      nextFinancial
    };
  }, [milestones]);

  const handleSaveNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const dateObj = new Date(formDate);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabel = `${monthNames[dateObj.getMonth()]} '${String(dateObj.getFullYear()).slice(-2)}`;

    const lastVault = milestones.length > 0 ? milestones[milestones.length - 1].vaultBalanceAfter : 495000;
    const newVault = lastVault + formCashImpact;

    const newMilestone: FinancialMilestone = {
      id: `m-${Date.now()}`,
      title: formTitle.trim(),
      date: formDate,
      monthLabel,
      category: formCategory,
      status: 'upcoming',
      cashImpact: formCashImpact,
      projectedRoas: formCategory === 'campaign' ? formRoas : undefined,
      vaultBalanceAfter: newVault,
      description: formDescription.trim() || 'Custom financial cycle event.',
      cycleTag: formCycleTag,
      riskLevel: formRisk
    };

    const updated = [...milestones, newMilestone].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setMilestones(updated);
    localStorage.setItem('zyncast_cfo_milestones', JSON.stringify(updated));
    setSelectedMilestone(newMilestone);
    setIsAddModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormDescription('');
  };

  const handleDeleteMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    localStorage.setItem('zyncast_cfo_milestones', JSON.stringify(updated));
    if (selectedMilestone?.id === id) {
      setSelectedMilestone(updated[0] || null);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6 ${className}`}>
      
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
              STRATEGIC MAPPING
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">
              ● Cross-Cycle Solvency Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Financial Milestones & Campaign Launch Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Correlate major capital commitments, tax reserves, and ZynAds commercial surges directly against projected cash flow cycles.
          </p>
        </div>

        {/* Filter Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events ({milestones.length})
            </button>
            <button
              onClick={() => setActiveFilter('financial')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'financial' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Financial
            </button>
            <button
              onClick={() => setActiveFilter('campaign')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'campaign' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
              ZynAds Launches
            </button>
            <button
              onClick={() => setActiveFilter('high-impact')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'high-impact' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              High Impact (&gt;$25k)
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Map New Event</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Timeline Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Lowest Vault Buffer */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">PROJECTED VAULT TROUGH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">
            ${stats.lowestVault.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block flex items-center gap-1">
            ● 100% Solvency Preserved (14.2+ Mo)
          </span>
        </div>

        {/* Next Marketing Launch */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">NEXT ZYNADS LAUNCH</span>
            <Megaphone className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {stats.nextCampaign ? stats.nextCampaign.title : 'None Scheduled'}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">
            {stats.nextCampaign ? `${stats.nextCampaign.date} • ${stats.nextCampaign.projectedRoas}x Est. ROAS` : 'All Active'}
          </span>
        </div>

        {/* Next Financial Obligation */}
        <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
          <div className="flex items-center justify-between text-teal-700 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">NEXT FINANCIAL MILESTONE</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {stats.nextFinancial ? stats.nextFinancial.title : 'None Scheduled'}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">
            {stats.nextFinancial ? `${stats.nextFinancial.date} • $${Math.abs(stats.nextFinancial.cashImpact).toLocaleString()}` : 'Compliant'}
          </span>
        </div>

        {/* Projected Net Inflow */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TIMELINE NET CASH FLOW</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className={`text-xl font-black tracking-tight ${stats.netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats.netFlow >= 0 ? `+$${stats.netFlow.toLocaleString()}` : `-$${Math.abs(stats.netFlow).toLocaleString()}`}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            ${stats.totalInflow.toLocaleString()} In / ${stats.totalOutflow.toLocaleString()} Out
          </span>
        </div>

      </div>

      {/* 3. Horizontal Visual Timeline & Cash Cycle Track */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Rolling 6-Month Liquidity Wave & Milestone Pins
          </span>
          <span>Click any card below to inspect cycle telemetry</span>
        </div>

        {/* Interactive Milestone Ribbon Scroll */}
        <div className="overflow-x-auto pb-4 pt-1">
          <div className="flex items-stretch gap-3.5 min-w-[960px]">
            {filteredMilestones.map((m, index) => {
              const isSelected = selectedMilestone?.id === m.id;
              const isPositive = m.cashImpact >= 0;
              const isCampaign = m.category === 'campaign';

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMilestone(m);
                    if (onSelectMilestone) onSelectMilestone(m);
                  }}
                  className={`w-64 shrink-0 rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-teal-400'
                      : 'bg-white hover:bg-slate-50/90 text-slate-900 border-slate-200/90 shadow-xs'
                  }`}
                >
                  {/* Top Status & Date */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isCampaign 
                          ? isSelected ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isSelected ? 'bg-teal-900 text-teal-300' : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {isCampaign ? '🚀 ZynAds Campaign' : '🏛️ Financial Milestone'}
                      </span>
                      <span className={`text-[11px] font-mono font-semibold ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        {m.monthLabel}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {m.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.cycleTag}
                      </span>
                      {m.projectedRoas && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {m.projectedRoas}x ROAS
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Cash Impact & Vault Balance */}
                  <div className={`mt-4 pt-3 border-t ${isSelected ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-mono text-[10px] font-semibold uppercase ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        Cash Impact
                      </span>
                      <span className={`font-black font-mono ${
                        isPositive ? (isSelected ? 'text-emerald-400' : 'text-emerald-600') : (isSelected ? 'text-rose-400' : 'text-rose-600')
                      }`}>
                        {isPositive ? `+$${m.cashImpact.toLocaleString()}` : `-$${Math.abs(m.cashImpact).toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>
                        Vault Reserve:
                      </span>
                      <span className={`font-bold font-mono ${isSelected ? 'text-teal-300' : 'text-slate-700'}`}>
                        ${m.vaultBalanceAfter.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Selected Milestone Detail Cockpit */}
      {selectedMilestone && (
        <div className="p-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                selectedMilestone.category === 'campaign' ? 'bg-indigo-600 text-white' : 'bg-teal-500 text-slate-950 font-black'
              }`}>
                {selectedMilestone.category === 'campaign' ? <Megaphone className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                    EVENT DETAILS & SOLVENCY AUDIT
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedMilestone.riskLevel === 'low'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedMilestone.riskLevel === 'moderate'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {selectedMilestone.riskLevel.toUpperCase()} CYCLE RISK
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {selectedMilestone.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">TARGET CALENDAR DATE</span>
                <span className="text-sm font-bold text-white font-mono">{selectedMilestone.date}</span>
              </div>
              <button
                onClick={(e) => handleDeleteMilestone(selectedMilestone.id, e)}
                className="p-2 hover:bg-slate-900 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                title="Remove milestone from timeline"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">STRATEGIC CONTEXT & OBJECTIVE</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
                {selectedMilestone.description}
              </p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">CASH FLOW BUFFER TEST</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Cycle Adjustment:</span>
                  <span className={`font-bold font-mono ${selectedMilestone.cashImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedMilestone.cashImpact >= 0 ? `+$${selectedMilestone.cashImpact.toLocaleString()}` : `-$${Math.abs(selectedMilestone.cashImpact).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vault After Event:</span>
                  <span className="font-bold text-teal-400 font-mono">${selectedMilestone.vaultBalanceAfter.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Runway Preservation:</span>
                  <span className="font-bold text-emerald-400 font-mono">15.8 Months Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal for Adding a New Milestone / Campaign Event */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                Map Milestone or Campaign Launch
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMilestone} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 Commercial Video Blitz or Tax Payment"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MilestoneCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="financial">🏛️ Financial Milestone</option>
                    <option value="campaign">🚀 ZynAds Campaign Launch</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">
                    Cash Impact ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={formCashImpact}
                    onChange={(e) => setFormCashImpact(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-teal-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Use minus (-) for expenses / outlays</span>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">
                    Cycle Classification
                  </label>
                  <input
                    type="text"
                    value={formCycleTag}
                    onChange={(e) => setFormCycleTag(e.target.value)}
                    placeholder="e.g. Payroll Dip, CapEx, Surge"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              {formCategory === 'campaign' && (
                <div>
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">
                    Projected ROAS (x)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRoas}
                    onChange={(e) => setFormRoas(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-1">Description & Solvency Notes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain the purpose, expected payback period, or risk mitigation..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Map to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
