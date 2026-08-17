import { useState } from 'react';
import { AdCampaign, PerformanceDay } from '../types';
import { PERFORMANCE_HISTORY } from '../data';
import { DollarSign, TrendingUp, Eye, MousePointer, Target, Megaphone, ArrowUpRight, Play, Pause, Plus, Sparkles, Video, Mic, Film, Tv, Zap, Vault, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  campaigns: AdCampaign[];
  onToggleStatus: (id: string) => void;
  setActiveTab: (tab: string) => void;
  isPrivacyMode: boolean;
}

export default function DashboardView({
  campaigns,
  onToggleStatus,
  setActiveTab,
  isPrivacyMode
}: DashboardViewProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Compute aggregate stats
  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  
  // ROAS calculation
  const totalRevenue = PERFORMANCE_HISTORY.reduce((acc, p) => acc + p.revenue, 0);
  const overallRoas = totalSpend > 0 ? (totalRevenue / (totalSpend * 0.8)).toFixed(2) : '3.85';
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '3.12';

  const formatCurrency = (val: number) => {
    if (isPrivacyMode) return '••••••';
    return `$${val.toLocaleString()}`;
  };

  const formatNumber = (val: number) => {
    if (isPrivacyMode) return '••••';
    return val.toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Active Campaigns Management Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-mono font-extrabold uppercase rounded shadow-sm">
                CAMPAIGNS MONITOR
              </span>
              <span className="text-xs text-indigo-300 font-mono font-semibold">
                ● Live Multi-Platform Ad Spend
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Advertising & Traffic Telemetry
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time cross-channel metrics across Meta, Google Ads, TikTok, and LinkedIn with automated ROAS optimization.
            </p>
          </div>
        </div>
      </div>

      {/* ZyncastCFO Executive Financial & Payroll Hub */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl border border-emerald-500/40 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded border border-emerald-500/40">
                ZyncastCFO Executive Financial Hub
              </span>
              <span className="text-xs text-emerald-400 font-mono font-semibold">● QuickBooks Synced</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">Payroll, Cash Vault & 8-Cycle AI Fail-Safe Audit</h3>
            <p className="text-xs text-slate-300 mt-1">
              Manage W-2 / 1099 payrolls, execute 8-cycle AI audits, toggle Cash-Only Vault Mode (280E dispensary compliant), and export directly to QuickBooks Online.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('payroll')}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Open Full Payroll Suite &rarr;</span>
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('payroll')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-emerald-500/30 rounded-2xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">1. Payroll & W-2/1099s</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Manage Employees & Wages</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Calculate net pay, withholdings & deductions</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-emerald-500/30 rounded-2xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">2. QuickBooks Export</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Export QBO CSV & IIF</div>
            <p className="text-[10px] text-slate-400 mt-0.5">1-click double-entry GL journal export</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/40 rounded-2xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">3. Cash-Only Vault Mode</div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Physical Cash & 280E COGS</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Exact bill denomination count ($100, $50, $20)</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-3 bg-gradient-to-r from-emerald-950 to-teal-950 hover:from-emerald-900 hover:to-teal-900 border border-emerald-400/50 rounded-2xl text-left transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">4. 8-Cycle AI Audit</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-200 transition-colors">Run Zero-Error Audit</div>
            <p className="text-[10px] text-slate-300 mt-0.5">Gemini cryptographic zero-error seal</p>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Spend */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Ad Spend</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalSpend)}</div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12.4% vs last week
          </span>
        </div>

        {/* Avg ROAS */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg ROAS</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{isPrivacyMode ? '••••' : `${overallRoas}x`}</div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> High ROI Return
          </span>
        </div>

        {/* Impressions */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Impressions</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{formatNumber(totalImpressions)}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Cross-channel reach</span>
        </div>

        {/* Clicks */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Clicks</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{formatNumber(totalClicks)}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Traffic delivered</span>
        </div>

        {/* Conversions */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Conversions</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{formatNumber(totalConversions)}</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Completed leads / sales</span>
        </div>

        {/* Avg CTR */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg CTR</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{isPrivacyMode ? '••••' : `${avgCtr}%`}</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Above industry avg</span>
        </div>
      </div>

      {/* Ad Spend & Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Ad Spend vs Revenue Telemetry</h3>
            <p className="text-xs text-slate-500">Track daily ad expenditure against generated campaign revenue</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeRange === range ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_HISTORY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" name="Campaign Revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="spend" name="Ad Spend" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Active Campaigns Monitor</h3>
            <p className="text-xs text-slate-500">Live operational status across Meta, Google, TikTok, and LinkedIn</p>
          </div>
          <button
            onClick={() => setActiveTab('campaigns')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Manage All Campaigns &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Campaign Name</th>
                <th className="py-3 px-4 font-bold">Platform</th>
                <th className="py-3 px-4 font-bold">Daily Budget</th>
                <th className="py-3 px-4 font-bold">Total Spent</th>
                <th className="py-3 px-4 font-bold">Clicks / CTR</th>
                <th className="py-3 px-4 font-bold">ROAS</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.slice(0, 5).map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(camp.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        camp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : camp.status === 'Paused'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      title="Click to toggle status"
                    >
                      {camp.status === 'Active' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </>
                      ) : (
                        <>
                          <Pause className="w-2.5 h-2.5" /> Paused
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {camp.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[11px]">
                      {camp.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {formatCurrency(camp.dailyBudget)}/day
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {formatCurrency(camp.totalSpent)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {formatNumber(camp.clicks)} ({camp.ctr}%)
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {camp.roas > 0 ? `${camp.roas}x` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onToggleStatus(camp.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title={camp.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                    >
                      {camp.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
