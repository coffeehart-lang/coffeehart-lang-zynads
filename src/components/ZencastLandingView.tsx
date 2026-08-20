import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Vault, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Scale, 
  Download, 
  LineChart, 
  BarChart3, 
  Sliders, 
  Flame, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ZencastLandingViewProps {
  setActiveTab: (tab: string) => void;
  isPrivacyMode: boolean;
}

const FINANCIAL_TELEMETRY = [
  { month: 'Oct', revenue: 215000, cogs: 68000, payroll: 52000, netProfit: 95000, cashVault: 320000 },
  { month: 'Nov', revenue: 242000, cogs: 74000, payroll: 54000, netProfit: 114000, cashVault: 380000 },
  { month: 'Dec', revenue: 268000, cogs: 82000, payroll: 56000, netProfit: 130000, cashVault: 435000 },
  { month: 'Jan', revenue: 275000, cogs: 85000, payroll: 58000, netProfit: 132000, cashVault: 460000 },
  { month: 'Feb', revenue: 289000, cogs: 89000, payroll: 58000, netProfit: 142000, cashVault: 495000 },
  { month: 'Mar (Proj)', revenue: 310000, cogs: 94000, payroll: 62000, netProfit: 154000, cashVault: 550000 },
];

const RECENT_GL_TRANSACTIONS = [
  { id: 'GL-9821', date: '2026-03-28', account: 'Payroll Expense #6010', memo: 'Bi-Weekly Direct Deposit Net Wages (8 Employees)', debit: '$29,480.00', credit: '-', status: 'Synced QBO' },
  { id: 'GL-9822', date: '2026-03-28', account: 'Fed Tax Withholding #2100', memo: 'Form 941 Employer FICA & Withholdings (IRS Wire)', debit: '$8,420.50', credit: '-', status: 'Synced QBO' },
  { id: 'GL-9823', date: '2026-03-27', account: 'Dispensary Vault Cash #1020', memo: 'Physical Vault 280E Verified Cash Bag Seal #094', debit: '$48,500.00', credit: '-', status: 'AI Sealed' },
  { id: 'GL-9824', date: '2026-03-27', account: 'SaaS Inflow Stripe #4010', memo: 'Enterprise Annual Subscription Plan Batch #88', debit: '-', credit: '$38,900.00', status: 'Synced QBO' },
  { id: 'GL-9825', date: '2026-03-26', account: 'Hardware CapEx #1510', memo: 'Dual-Audit Vault Drop Safe Capital Asset', debit: '$12,400.00', credit: '-', status: 'Audit Ready' },
];

export default function ZencastLandingView({ setActiveTab, isPrivacyMode }: ZencastLandingViewProps) {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'YTD'>('6m');

  const formatCurrency = (amount: number) => {
    if (isPrivacyMode) return '••••••';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* 🏛️ EXECUTIVE HERO SECTION */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 p-6 sm:p-8 rounded-3xl border border-teal-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-teal-500/20 pb-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-500 text-slate-950 text-[10px] font-mono font-black uppercase rounded shadow-sm">
                EXECUTIVE CFO ENGINE
              </span>
              <span className="text-xs text-teal-300 font-mono font-semibold">
                ● Live General Ledger & Multi-Model Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Zencast<span className="text-teal-400">CFO</span> Executive Headquarters
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              The unified financial cockpit: Cash Flow Forecaster, "What-If" Scenario Modeler, Bookkeeping & QuickBooks Sync, Burn Rate Tracker, and Multi-Model AI Financial Analyst.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('cash-flow-forecaster')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <LineChart className="w-4 h-4" />
              <span>Cash Flow Forecaster</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-financial-analyst')}
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-teal-400" />
              <span>AI Financial Analyst</span>
            </button>
          </div>
        </div>

        {/* 6 Executive Suite Core Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('cash-flow-forecaster')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-teal-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-teal-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">1. Cash Flow Forecaster</span>
              <LineChart className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors mt-1.5">Projection & Vault Engine</div>
            <p className="text-xs text-slate-400 mt-1">Multi-horizon dynamic inflow/outflow projections over 6, 12, or 24-month timelines.</p>
          </button>

          <button
            onClick={() => setActiveTab('scenario-modeler')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-indigo-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-indigo-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">2. "What-If" Modeler</span>
              <Sliders className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mt-1.5">Decision Simulation</div>
            <p className="text-xs text-slate-400 mt-1">Stress-test hiring new staff, capital expenditures, and price shifts before committing.</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-emerald-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">3. Bookkeeping & Ledger Sync</span>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-1.5">QuickBooks & Payroll Engine</div>
            <p className="text-xs text-slate-400 mt-1">Automated payroll, tax withholding journals, and 8-cycle cryptographic audits.</p>
          </button>

          <button
            onClick={() => setActiveTab('runway-tracker')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-rose-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-rose-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">4. Burn Rate & Runway</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors mt-1.5">Capital Solvency Tracker</div>
            <p className="text-xs text-slate-400 mt-1">Surveillance of gross/net burn rates with 24-month stress-test survival curves.</p>
          </button>

          <button
            onClick={() => setActiveTab('ai-financial-analyst')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-cyan-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">5. AI Financial Analyst</span>
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-1.5">Multi-Model Intelligence</div>
            <p className="text-xs text-slate-400 mt-1">Surfaces margin anomalies, drafts board briefings, and audits GL transactions.</p>
          </button>

          <button
            onClick={() => setActiveTab('budget-calculator')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-amber-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">6. Margin & Screener</span>
              <Scale className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1.5">Business & Unit Economics</div>
            <p className="text-xs text-slate-400 mt-1">Calculates gross margin, cost per unit, markup pricing, and stock screening.</p>
          </button>
        </div>
      </div>

      {/* 📊 CFO EXECUTIVE FINANCIAL TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Monthly Revenue */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">Monthly Revenue</span>
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(289000)}</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +13.8% vs last month
          </span>
        </div>

        {/* Operating EBITDA */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">EBITDA Profit</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(159000)}</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> 55.0% Gross Margin
          </span>
        </div>

        {/* Active Payroll Run */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">Bi-Weekly Payroll</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(29480)}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">8 Employees / Cont.</span>
        </div>

        {/* Cash Vault Reserves */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">Cash Vault Reserve</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Vault className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(495000)}</div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">100% 280E Verified</span>
        </div>

        {/* Net Profit Margin */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">Net Profit</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(142000)}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">49.1% Net Margin</span>
        </div>

        {/* AI Audit Status */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">Audit Status</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 tracking-tight">8/8 PASSED</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block font-mono">Zero Errors Found</span>
        </div>
      </div>

      {/* 📈 CASH FLOW & FINANCIAL REVENUE TELEMETRY CHART */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 font-sans">Executive Financial & Cash Flow Telemetry</h3>
              <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 font-mono text-[10px] font-bold rounded-full border border-teal-200">
                PROPRIETARY MODEL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Track revenue, cost of goods sold, payroll expenditures, and net cash accumulation</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['6m', '1y', 'YTD'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  timeRange === range ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FINANCIAL_TELEMETRY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cfoRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="cfoNetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="cfoPayrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="revenue" name="Total Gross Revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#cfoRevGrad)" />
              <Area type="monotone" dataKey="netProfit" name="Net Operating Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#cfoNetGrad)" />
              <Area type="monotone" dataKey="payroll" name="Total Payroll Expense" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#cfoPayrollGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 💼 QUICKBOOKS GENERAL LEDGER (GL) SYNC MONITOR */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 font-sans">QuickBooks General Ledger & Audit Feed</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                DOUBLE-ENTRY GL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time journal balance entries ready for 1-click export to QuickBooks Online (CSV / IIF)</p>
          </div>
          <button
            onClick={() => setActiveTab('payroll')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Manage All Payroll & QB &rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Entry ID</th>
                <th className="py-3 px-4 font-bold">Posting Date</th>
                <th className="py-3 px-4 font-bold">GL Account Name</th>
                <th className="py-3 px-4 font-bold">Journal Description</th>
                <th className="py-3 px-4 font-bold">Debit</th>
                <th className="py-3 px-4 font-bold">Credit</th>
                <th className="py-3 px-4 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_GL_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.id}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{tx.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{tx.account}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{tx.memo}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.debit}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">{tx.credit}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      tx.status === 'Synced QBO' 
                        ? 'bg-teal-100 text-teal-800' 
                        : tx.status === 'AI Sealed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {tx.status}
                    </span>
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
