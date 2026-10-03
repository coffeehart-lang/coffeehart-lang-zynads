import { useState } from 'react';
import { 
  Sliders, 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Building2, 
  Scale, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  staffDelta: number;
  avgSalary: number;
  pricingChangePct: number;
  capexInvestment: number;
  marketingBudgetDelta: number;
  expectedRevGrowthDelta: number;
}

export default function ScenarioModelerView() {
  // Baseline Financial Numbers
  const BASE_MONTHLY_REV = 289000;
  const BASE_MONTHLY_PAYROLL = 58000;
  const BASE_MONTHLY_OPEX = 24000;
  const BASE_COGS_RATE = 0.31;
  const BASE_CASH_VAULT = 495000;

  // Scenario Levers
  const [newStaffCount, setNewStaffCount] = useState<number>(3);
  const [avgStaffSalary, setAvgStaffSalary] = useState<number>(85000);
  const [pricingChangePct, setPricingChangePct] = useState<number>(10);
  const [capexInvestment, setCapexInvestment] = useState<number>(50000);
  const [marketingBudgetDelta, setMarketingBudgetDelta] = useState<number>(15000);
  const [expectedRevLiftPct, setExpectedRevLiftPct] = useState<number>(18);
  const [activePreset, setActivePreset] = useState<string>('growth');

  const presets: ScenarioPreset[] = [
    {
      id: 'growth',
      name: 'Aggressive Team & Product Expansion',
      description: 'Hire 4 software engineers & sales leads, increase ad spend by $20k, raise pricing by 10%.',
      staffDelta: 4,
      avgSalary: 90000,
      pricingChangePct: 10,
      capexInvestment: 60000,
      marketingBudgetDelta: 20000,
      expectedRevGrowthDelta: 24
    },
    {
      id: 'lean',
      name: 'Maximum Margin & Lean Retention',
      description: 'Zero new hires, 15% price increase across high-tier enterprise clients, cut ad budget by $5k.',
      staffDelta: 0,
      avgSalary: 85000,
      pricingChangePct: 15,
      capexInvestment: 10000,
      marketingBudgetDelta: -5000,
      expectedRevGrowthDelta: 8
    },
    {
      id: 'pivot',
      name: 'Hardware & Dispensary Vault CapEx',
      description: 'Deploy $120k physical vault tech, hire 2 security compliance officers, hold prices flat.',
      staffDelta: 2,
      avgSalary: 75000,
      pricingChangePct: 0,
      capexInvestment: 120000,
      marketingBudgetDelta: 5000,
      expectedRevGrowthDelta: 14
    }
  ];

  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset.id);
    setNewStaffCount(preset.staffDelta);
    setAvgStaffSalary(preset.avgSalary);
    setPricingChangePct(preset.pricingChangePct);
    setCapexInvestment(preset.capexInvestment);
    setMarketingBudgetDelta(preset.marketingBudgetDelta);
    setExpectedRevLiftPct(preset.expectedRevGrowthDelta);
  };

  // Calculations
  const monthlyNewStaffPayroll = Math.round((newStaffCount * avgStaffSalary) / 12 * 1.12); // Including payroll tax burden
  const scenarioMonthlyPayroll = BASE_MONTHLY_PAYROLL + monthlyNewStaffPayroll;
  
  // Revenue Impact = Baseline * (1 + priceChange%) * (1 + revLift%)
  const scenarioMonthlyRev = Math.round(BASE_MONTHLY_REV * (1 + pricingChangePct / 100) * (1 + expectedRevLiftPct / 100));
  const scenarioMonthlyCogs = Math.round(scenarioMonthlyRev * BASE_COGS_RATE);
  const scenarioMonthlyOpex = BASE_MONTHLY_OPEX + marketingBudgetDelta;

  const baselineNetMonthly = BASE_MONTHLY_REV - (BASE_MONTHLY_REV * BASE_COGS_RATE) - BASE_MONTHLY_PAYROLL - BASE_MONTHLY_OPEX;
  const scenarioNetMonthly = scenarioMonthlyRev - scenarioMonthlyCogs - scenarioMonthlyPayroll - scenarioMonthlyOpex;
  const monthlyNetDelta = scenarioNetMonthly - baselineNetMonthly;

  // 12-Month Cash Impact with CapEx
  const baseline12MonthCash = BASE_CASH_VAULT + (baselineNetMonthly * 12);
  const scenario12MonthCash = BASE_CASH_VAULT - capexInvestment + (scenarioNetMonthly * 12);
  const total12MonthWealthDelta = scenario12MonthCash - baseline12MonthCash;

  // Payback Period on CapEx (in months)
  const monthlyPaybackDelta = scenarioNetMonthly - baselineNetMonthly;
  const paybackMonths = monthlyPaybackDelta > 0 ? (capexInvestment / monthlyPaybackDelta).toFixed(1) : 'N/A (Negative Yield)';

  const comparisonData = [
    { metric: 'Monthly Revenue', Baseline: BASE_MONTHLY_REV, Scenario: scenarioMonthlyRev },
    { metric: 'Monthly Payroll', Baseline: BASE_MONTHLY_PAYROLL, Scenario: scenarioMonthlyPayroll },
    { metric: 'Monthly Net Profit', Baseline: baselineNetMonthly, Scenario: scenarioNetMonthly },
    { metric: '12-Mo Vault Reserve', Baseline: baseline12MonthCash, Scenario: scenario12MonthCash },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-mono font-extrabold uppercase rounded shadow-sm">
                EXECUTIVE DECISION ENGINE
              </span>
              <span className="text-xs text-indigo-300 font-mono font-semibold">
                ● "What-If" Business Scenario Modeler
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">"What-If" Scenario Simulation Workspace</h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Stress-test major executive decisions—hiring new employees, raising product prices, deploying capital investments, and expanding ad budgets—before executing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewStaffCount(0);
                setPricingChangePct(0);
                setCapexInvestment(0);
                setMarketingBudgetDelta(0);
                setExpectedRevLiftPct(0);
                setActivePreset('custom');
              }}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
            </button>
          </div>
        </div>

        {/* Quick Scenario Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activePreset === p.id 
                  ? 'bg-indigo-900/60 border-indigo-400 text-white ring-1 ring-indigo-400' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className={activePreset === p.id ? 'text-indigo-300' : 'text-slate-400'}>{p.name}</span>
                {activePreset === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Scenario Monthly Rev</span>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">${scenarioMonthlyRev.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +${(scenarioMonthlyRev - BASE_MONTHLY_REV).toLocaleString()} vs base
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Monthly Net Profit</span>
          <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">${scenarioNetMonthly.toLocaleString()}</div>
          <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${monthlyNetDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {monthlyNetDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {monthlyNetDelta >= 0 ? '+' : ''}${monthlyNetDelta.toLocaleString()}/mo
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">12-Month Net Wealth Delta</span>
          <div className={`text-xl font-black font-mono mt-0.5 ${total12MonthWealthDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {total12MonthWealthDelta >= 0 ? '+' : ''}${total12MonthWealthDelta.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">After ${capexInvestment.toLocaleString()} CapEx</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">CapEx Payback Horizon</span>
          <div className="text-xl font-black text-indigo-700 font-mono mt-0.5">{paybackMonths} {typeof paybackMonths === 'string' && paybackMonths.includes('N/A') ? '' : 'months'}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Breakeven on investment</span>
        </div>
      </div>

      {/* Comparison Chart & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Workspace */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" /> Interactive Strategic Levers
          </h3>

          <div className="space-y-4 text-xs">
            {/* 1. Staffing Levers */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-600" /> New Staff Hires</span>
                <span className="font-mono text-indigo-600">+{newStaffCount} Employees (+${monthlyNewStaffPayroll.toLocaleString()}/mo)</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={newStaffCount}
                onChange={(e) => { setNewStaffCount(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Avg Annual Salary</span>
                <span className="font-mono font-bold">${avgStaffSalary.toLocaleString()}/yr</span>
              </div>
              <input
                type="range"
                min="40000"
                max="200000"
                step="5000"
                value={avgStaffSalary}
                onChange={(e) => { setAvgStaffSalary(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-slate-600"
              />
            </div>

            {/* 2. Pricing & Revenue Expansion */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-emerald-600" /> Price Adjustment (%)</span>
                <span className="font-mono text-emerald-600">{pricingChangePct >= 0 ? '+' : ''}{pricingChangePct}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={pricingChangePct}
                onChange={(e) => { setPricingChangePct(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Expected Client Volume / Demand Growth (%)</span>
                <span className="font-mono font-bold text-emerald-600">+{expectedRevLiftPct}%</span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                step="1"
                value={expectedRevLiftPct}
                onChange={(e) => { setExpectedRevLiftPct(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* 3. CapEx & Ad Spend Delta */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-amber-600" /> One-Time CapEx / Vault Equipment</span>
                <span className="font-mono text-amber-600">${capexInvestment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={capexInvestment}
                onChange={(e) => { setCapexInvestment(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-amber-600"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Monthly Ad & Marketing Budget Delta</span>
                <span className="font-mono font-bold text-indigo-600">{marketingBudgetDelta >= 0 ? '+' : ''}${marketingBudgetDelta.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="-20000"
                max="80000"
                step="2500"
                value={marketingBudgetDelta}
                onChange={(e) => { setMarketingBudgetDelta(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Baseline vs. Scenario Comparison</h3>
                <p className="text-xs text-slate-500">Side-by-side financial metric variance</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-mono font-bold rounded-lg">
                LIVE VARIANCE
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Scenario" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Executive Verdict
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              {monthlyNetDelta >= 0
                ? `This scenario produces positive net monthly cash flow expansion of +$${monthlyNetDelta.toLocaleString()}/mo, yielding a 12-month net gain of +$${total12MonthWealthDelta.toLocaleString()}.`
                : `This scenario narrows net monthly cash flow by -$${Math.abs(monthlyNetDelta).toLocaleString()}/mo. Ensure customer lifetime value (LTV) justifies this investment phase.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
