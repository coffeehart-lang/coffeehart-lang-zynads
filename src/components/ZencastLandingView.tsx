import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Vault, 
  FileSpreadsheet, 
  Calculator, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  Cpu, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  PieChart as PieIcon, 
  Briefcase,
  Layers,
  Scale,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

interface ZencastLandingProps {
  setActiveTab: (tab: string) => void;
  isPrivacyMode: boolean;
}

// Executive Cash Flow & Financial Model Data for Zencast CFO
const FINANCIAL_TELEMETRY = [
  { month: 'Mar', revenue: 142000, cogs: 52000, payroll: 41000, netProfit: 49000, ebitda: 58000, cashVault: 185000 },
  { month: 'Apr', revenue: 168000, cogs: 59000, payroll: 44000, netProfit: 65000, ebitda: 74000, cashVault: 220000 },
  { month: 'May', revenue: 195000, cogs: 66000, payroll: 48000, netProfit: 81000, ebitda: 92000, cashVault: 275000 },
  { month: 'Jun', revenue: 218000, cogs: 72000, payroll: 51000, netProfit: 95000, ebitda: 108000, cashVault: 330000 },
  { month: 'Jul', revenue: 254000, cogs: 81000, payroll: 55000, netProfit: 118000, ebitda: 132000, cashVault: 410000 },
  { month: 'Aug', revenue: 289000, cogs: 89000, payroll: 58000, netProfit: 142000, ebitda: 159000, cashVault: 495000 },
];

const RECENT_GL_TRANSACTIONS = [
  { id: 'GL-9821', date: 'Aug 16, 2026', account: 'Payroll Clearing Acct (6100)', memo: 'Bi-Weekly Payroll Cycle Run #16', debit: '$29,480.00', credit: '-', status: 'Synced QBO' },
  { id: 'GL-9820', date: 'Aug 15, 2026', account: 'Vault Cash On Hand (1010)', memo: '280E Physical Vault Safe Deposit', debit: '-', credit: '$14,200.00', status: 'Audited' },
  { id: 'GL-9819', date: 'Aug 14, 2026', account: 'Operating Revenue (4000)', memo: 'B2B Client Retainers & Software Invoices', debit: '$48,500.00', credit: '-', status: 'Synced QBO' },
  { id: 'GL-9818', date: 'Aug 13, 2026', account: 'FICA / Tax Liability (2100)', memo: 'Federal & State Payroll Withholdings', debit: '-', credit: '$8,140.00', status: 'AI Sealed' },
  { id: 'GL-9817', date: 'Aug 12, 2026', account: 'Cost of Goods Sold (5000)', memo: 'Merchant COGS & Inventory Restock', debit: '-', credit: '$18,900.00', status: 'Synced QBO' },
];

export default function ZencastLandingView({
  setActiveTab,
  isPrivacyMode
}: ZencastLandingProps) {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'YTD'>('6m');

  const formatCurrency = (val: number) => {
    if (isPrivacyMode) return '••••••';
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 🏛️ ZENCAST CFO EXECUTIVE COMMAND HERO */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950/80 to-slate-950 p-6 sm:p-8 rounded-3xl border border-teal-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-teal-500/20 pb-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase rounded-full shadow-md">
                ZENCAST CFO EXECUTIVE SUITE
              </span>
              <span className="text-xs text-teal-300 font-mono font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                QuickBooks Online & 8-Cycle AI Audit Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Executive Financial Command & AI Payroll Engine
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Complete CFO operating ecosystem: automated W-2 & 1099 payroll calculations, 8-Cycle AI cryptographic audit verification, physical cash vault balancing (280E dispensary compliant), and seamless double-entry general ledger syncing with QuickBooks Online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('payroll')}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-teal-500/20 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950 font-black" />
              <span>Launch Payroll & QuickBooks Sync &rarr;</span>
            </button>
            <button
              onClick={() => setActiveTab('budget-calculator')}
              className="px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white font-bold text-xs rounded-2xl border border-teal-500/40 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-teal-400" />
              <span>Financial Forecast & Margins</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars of Zencast CFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <button
            onClick={() => setActiveTab('payroll')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-teal-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-teal-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">1. Payroll & W-2 / 1099s</span>
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors mt-1.5">Employee Wage Engine</div>
            <p className="text-xs text-slate-400 mt-1">Bi-weekly runs, automated tax withholdings, and direct deposit routing.</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-emerald-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">2. 8-Cycle AI Audit</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-1.5">Cryptographic Zero-Error</div>
            <p className="text-xs text-slate-400 mt-1">Gemini-backed 8-stage audit certifying tax, math, and compliance accuracy.</p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-amber-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">3. Cash-Only Vault Mode</span>
              <Vault className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1.5">280E Safe & Denominations</div>
            <p className="text-xs text-slate-400 mt-1">Exact $100, $50, $20 breakdown with automated tamper-proof envelope logs.</p>
          </button>

          <button
            onClick={() => setActiveTab('budget-calculator')}
            className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-indigo-500/30 rounded-2xl text-left transition-all cursor-pointer group hover:border-indigo-400/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">4. Profit & Stock Models</span>
              <Calculator className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mt-1.5">Business & Market Screener</div>
            <p className="text-xs text-slate-400 mt-1">Simulate margins, runway burn rate, and institutional asset growth.</p>
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
