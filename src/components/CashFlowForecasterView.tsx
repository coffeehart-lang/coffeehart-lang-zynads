import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Sliders, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

interface InflowOutflowItem {
  id: string;
  name: string;
  type: 'inflow' | 'outflow';
  amount: number;
  frequency: 'weekly' | 'monthly' | 'one-time';
  category: string;
}

export default function CashFlowForecasterView() {
  const [timelineMonths, setTimelineMonths] = useState<6 | 12 | 24>(12);
  const [startingCash, setStartingCash] = useState<number>(495000);
  const [growthRateMonthly, setGrowthRateMonthly] = useState<number>(4.5);
  const [cogsPercent, setCogsPercent] = useState<number>(31);
  const [fixedMonthlyPayroll, setFixedMonthlyPayroll] = useState<number>(58000);
  const [operatingOpex, setOperatingOpex] = useState<number>(24000);
  const [baseMonthlyRevenue, setBaseMonthlyRevenue] = useState<number>(289000);

  const [customItems, setCustomItems] = useState<InflowOutflowItem[]>([
    { id: '1', name: 'Enterprise SaaS Retainer Expansion', type: 'inflow', amount: 35000, frequency: 'monthly', category: 'B2B Contracts' },
    { id: '2', name: 'Server & GPU Infrastructure Upgrade', type: 'outflow', amount: 15000, frequency: 'monthly', category: 'Compute Tech' },
    { id: '3', name: 'Q4 Federal Tax Estimated Payment', type: 'outflow', amount: 48000, frequency: 'one-time', category: 'Tax Liability' },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'inflow' | 'outflow'>('inflow');
  const [newItemAmount, setNewItemAmount] = useState<number>(10000);
  const [newItemFrequency, setNewItemFrequency] = useState<'weekly' | 'monthly' | 'one-time'>('monthly');
  const [newItemCategory, setNewItemCategory] = useState('Operating');
  const [showAddModal, setShowAddModal] = useState(false);

  // Generate dynamic projection data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan (Y2)', 'Feb (Y2)', 'Mar (Y2)', 'Apr (Y2)', 'May (Y2)', 'Jun (Y2)', 'Jul (Y2)', 'Aug (Y2)', 'Sep (Y2)', 'Oct (Y2)', 'Nov (Y2)', 'Dec (Y2)'];

  const projectionData = [];
  let currentCashVault = startingCash;

  const monthlyCustomInflows = customItems
    .filter(i => i.type === 'inflow' && i.frequency === 'monthly')
    .reduce((acc, i) => acc + i.amount, 0);

  const monthlyCustomOutflows = customItems
    .filter(i => i.type === 'outflow' && i.frequency === 'monthly')
    .reduce((acc, i) => acc + i.amount, 0);

  for (let m = 0; m < timelineMonths; m++) {
    const rev = Math.round(baseMonthlyRevenue * Math.pow(1 + growthRateMonthly / 100, m) + monthlyCustomInflows);
    const cogs = Math.round(rev * (cogsPercent / 100));
    const opex = fixedMonthlyPayroll + operatingOpex + monthlyCustomOutflows;
    
    // Add one-time items if applicable to specific months (e.g. Month 3 or 9)
    let oneTimeIn = 0;
    let oneTimeOut = 0;
    if (m === 3) {
      oneTimeOut += customItems.filter(i => i.type === 'outflow' && i.frequency === 'one-time').reduce((acc, i) => acc + i.amount, 0);
    }

    const totalInflow = rev + oneTimeIn;
    const totalOutflow = cogs + opex + oneTimeOut;
    const netCashFlow = totalInflow - totalOutflow;
    currentCashVault += netCashFlow;

    projectionData.push({
      month: monthNames[m % monthNames.length],
      inflow: totalInflow,
      outflow: totalOutflow,
      netFlow: netCashFlow,
      cashVault: currentCashVault,
      cogs,
      payroll: fixedMonthlyPayroll,
    });
  }

  const endingCash = projectionData[projectionData.length - 1]?.cashVault || startingCash;
  const netGain = endingCash - startingCash;
  const lowestCash = Math.min(...projectionData.map(p => p.cashVault));
  const avgMonthlyNet = Math.round(netGain / timelineMonths);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemAmount <= 0) return;
    setCustomItems([
      ...customItems,
      {
        id: Date.now().toString(),
        name: newItemName,
        type: newItemType,
        amount: newItemAmount,
        frequency: newItemFrequency,
        category: newItemCategory
      }
    ]);
    setNewItemName('');
    setNewItemAmount(5000);
    setShowAddModal(false);
  };

  const handleRemoveItem = (id: string) => {
    setCustomItems(customItems.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 p-6 rounded-3xl border border-teal-500/30 text-white shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase rounded shadow-sm">
                ZYNCAST CFO ENGINE
              </span>
              <span className="text-xs text-teal-300 font-mono font-semibold">
                ● Dynamic Multi-Horizon Cash Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Cash Flow Forecaster</h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Map out future capital inflows, recurring operational outflows, and liquidity reserves across 6, 12, or 24-month horizon simulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {([6, 12, 24] as const).map(months => (
              <button
                key={months}
                onClick={() => setTimelineMonths(months)}
                className={`px-3.5 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  timelineMonths === months
                    ? 'bg-teal-400 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {months} MONTHS
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Starting Capital</span>
            <span className="text-lg font-black text-white font-mono">${startingCash.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Projected Ending Vault</span>
            <span className="text-lg font-black text-teal-400 font-mono">${endingCash.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Net Cash Accumulation</span>
            <span className={`text-lg font-black font-mono flex items-center gap-1 ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netGain >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              ${Math.abs(netGain).toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Avg Monthly Net Inflow</span>
            <span className="text-lg font-black text-indigo-400 font-mono">+${avgMonthlyNet.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Projected Cumulative Cash Vault Balance</h3>
            <p className="text-xs text-slate-500">Liquidity trajectory factoring revenue growth, payroll, COGS, and customized cash flow streams</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded-full border border-emerald-200">
            HEALTHY LIQUIDITY
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="vaultForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="cashVault" name="Total Cash Vault Reserve" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#vaultForecastGrad)" />
              <Area type="monotone" dataKey="inflow" name="Monthly Inflows" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#inflowGrad)" />
              <Area type="monotone" dataKey="outflow" name="Monthly Outflows" stroke="#f43f5e" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Control Parameters & Dynamic Flow Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Financial Assumptions */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" /> Key Model Drivers & Assumptions
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Starting Reserve Capital</span>
                <span className="font-mono font-bold">${startingCash.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="25000"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Base Monthly Revenue</span>
                <span className="font-mono font-bold">${baseMonthlyRevenue.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={baseMonthlyRevenue}
                onChange={(e) => setBaseMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Projected Monthly Revenue Growth</span>
                <span className="font-mono font-bold text-emerald-600">+{growthRateMonthly}% / month</span>
              </div>
              <input
                type="range"
                min="-5"
                max="20"
                step="0.5"
                value={growthRateMonthly}
                onChange={(e) => setGrowthRateMonthly(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Cost of Goods Sold (COGS %)</span>
                <span className="font-mono font-bold">{cogsPercent}% of Revenue</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="1"
                value={cogsPercent}
                onChange={(e) => setCogsPercent(Number(e.target.value))}
                className="w-full accent-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Fixed Monthly Payroll</span>
                <span className="font-mono font-bold text-indigo-600">${fixedMonthlyPayroll.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="2500"
                value={fixedMonthlyPayroll}
                onChange={(e) => setFixedMonthlyPayroll(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Custom Inflows & Outflows Ledger */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Inflows & Outflow Adjustments</h3>
              <p className="text-xs text-slate-500">Inject custom recurring contracts, CapEx investments, or tax lump-sums</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stream
            </button>
          </div>

          {showAddModal && (
            <form onSubmit={handleAddItem} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs animate-fadeIn">
              <div className="font-bold text-slate-900">Add New Cash Flow Adjustment</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Stream Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Retainer Contract"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Type</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="inflow">Inflow (+ Cash In)</option>
                    <option value="outflow">Outflow (- Cash Out)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Frequency</label>
                  <select
                    value={newItemFrequency}
                    onChange={(e) => setNewItemFrequency(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="monthly">Monthly Recurring</option>
                    <option value="one-time">One-Time (Q2 Milestone)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-teal-500 text-slate-950 font-bold rounded-lg cursor-pointer hover:bg-teal-400"
                >
                  Save Stream
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {customItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.type === 'inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.type}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{item.category} • {item.frequency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${item.type === 'inflow' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {item.type === 'inflow' ? '+' : '-'}${item.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
