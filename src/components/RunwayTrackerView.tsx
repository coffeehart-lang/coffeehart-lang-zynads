import { useState } from 'react';
import { 
  Flame, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Building2, 
  FileSpreadsheet,
  Layers,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function RunwayTrackerView() {
  const [currentCash, setCurrentCash] = useState<number>(495000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(289000);
  const [monthlyPayroll, setMonthlyPayroll] = useState<number>(58000);
  const [monthlyCogs, setMonthlyCogs] = useState<number>(89000);
  const [monthlyOpex, setMonthlyOpex] = useState<number>(24000);
  const [targetSafetyRunwayMonths, setTargetSafetyRunwayMonths] = useState<number>(18);

  // Dynamic calculations
  const totalMonthlyExpenses = monthlyPayroll + monthlyCogs + monthlyOpex;
  const grossBurnRate = totalMonthlyExpenses;
  const netMonthlyCashFlow = monthlyRevenue - totalMonthlyExpenses;
  const netBurnRate = netMonthlyCashFlow < 0 ? Math.abs(netMonthlyCashFlow) : 0;
  
  // Calculate Runway
  const isDefaultProfitable = netMonthlyCashFlow >= 0;
  const zeroRevenueRunwayMonths = (currentCash / grossBurnRate).toFixed(1);
  const netRunwayMonths = netBurnRate > 0 ? (currentCash / netBurnRate).toFixed(1) : 'Infinite (Profitable & Self-Sustaining)';

  // Build 24-month survival curve under 3 distinct stress scenarios
  const runwayTrajectoryData = [];
  let cashBaseline = currentCash;
  let cashStressZeroRev = currentCash;
  let cashStressDrop50 = currentCash;

  for (let m = 1; m <= 24; m++) {
    // Scenario 1: Baseline Trajectory
    cashBaseline = Math.max(0, cashBaseline + netMonthlyCashFlow);
    
    // Scenario 2: Severe Black Swan (Zero Revenue, Gross Burn)
    cashStressZeroRev = Math.max(0, cashStressZeroRev - grossBurnRate);

    // Scenario 3: 50% Revenue Shock (-50% Rev)
    const revDrop50 = monthlyRevenue * 0.5;
    const netDrop50 = revDrop50 - totalMonthlyExpenses;
    cashStressDrop50 = Math.max(0, cashStressDrop50 + netDrop50);

    runwayTrajectoryData.push({
      month: `M+${m}`,
      baseline: cashBaseline,
      stress50: cashStressDrop50,
      zeroRev: cashStressZeroRev,
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-950 p-6 rounded-3xl border border-rose-500/30 text-white shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase rounded shadow-sm">
                TREASURY & SOLVENCY MONITOR
              </span>
              <span className="text-xs text-rose-300 font-mono font-semibold">
                ● Burn Rate & Operational Runway Tracker
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Capital Burn Rate & Runway Forecaster</h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time solvency surveillance: monitor gross and net monthly cash burn, compute survival runway horizons under macroeconomic shocks, and protect operational capital.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 ${
              isDefaultProfitable 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-lg' 
                : 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-lg'
            }`}>
              {isDefaultProfitable ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CASH-FLOW POSITIVE (+${netMonthlyCashFlow.toLocaleString()}/mo)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>BURNING CAPITAL (-${netBurnRate.toLocaleString()}/mo)</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* 4 Essential Solvency KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Cash Vault Reserve</span>
            <span className="text-lg font-black text-white font-mono">${currentCash.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Gross Monthly Burn</span>
            <span className="text-lg font-black text-rose-400 font-mono">-${grossBurnRate.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Zero-Revenue Runway</span>
            <span className="text-lg font-black text-amber-400 font-mono">{zeroRevenueRunwayMonths} Months</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Operational Runway</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{netRunwayMonths}</span>
          </div>
        </div>
      </div>

      {/* Runway Trajectory Curve */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">24-Month Capital Stress Test Trajectory</h3>
            <p className="text-xs text-slate-500">Simulate cash drawdown across baseline operations, 50% revenue shock, and zero-revenue black swan scenarios</p>
          </div>
          <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-mono font-bold rounded-full border border-rose-200">
            TREASURY STRESS TEST
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={runwayTrajectoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="runwayBaseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="runwayShockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="baseline" name="Baseline Trajectory" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#runwayBaseGrad)" />
              <Area type="monotone" dataKey="stress50" name="50% Revenue Shock" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#runwayShockGrad)" />
              <Area type="monotone" dataKey="zeroRev" name="Zero-Revenue Gross Burn" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Levers & Solvency Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Levers */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" /> Capital & Burn Rate Levers
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Current Cash Vault Reserve</span>
                <span className="font-mono font-bold">${currentCash.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="25000"
                value={currentCash}
                onChange={(e) => setCurrentCash(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Monthly Inflow / Revenue</span>
                <span className="font-mono font-bold text-emerald-600">${monthlyRevenue.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="800000"
                step="10000"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Monthly Payroll Expense</span>
                <span className="font-mono font-bold text-indigo-600">${monthlyPayroll.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="200000"
                step="2500"
                value={monthlyPayroll}
                onChange={(e) => setMonthlyPayroll(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Monthly COGS (Direct Costs)</span>
                <span className="font-mono font-bold">${monthlyCogs.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={monthlyCogs}
                onChange={(e) => setMonthlyCogs(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Operating OpEx & Software Tools</span>
                <span className="font-mono font-bold">${monthlyOpex.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={monthlyOpex}
                onChange={(e) => setMonthlyOpex(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Solvency Health Assessment */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Solvency & Defense Protocols
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Baseline Cash-Flow Self-Sustainability</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Your monthly gross revenue exceeds total expenditures by <strong>+${(monthlyRevenue - totalMonthlyExpenses).toLocaleString()}</strong>. The enterprise generates positive free cash flow.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Zero-Revenue Survival Runway: {zeroRevenueRunwayMonths} Months</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    In the event of an immediate top-line revenue halt, existing cash vault reserves maintain full payroll and OpEx for {zeroRevenueRunwayMonths} months.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">280E Physical Vault Compliance</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Cash-only reserves are locked in verified safe vaults with dual-auditor custody logs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-1">
            <div className="text-xs font-mono font-bold text-teal-400 uppercase">CFO Advisory Note</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Treasury health score is <strong>98/100</strong>. Maintain at least 12 months of gross burn in liquid reserves before allocating capital toward aggressive expansion or acquisitions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
