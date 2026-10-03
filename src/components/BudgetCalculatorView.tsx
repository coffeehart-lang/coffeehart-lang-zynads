import { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Target, 
  PieChart, 
  Layers, 
  ArrowUpRight, 
  Check, 
  Building2, 
  LineChart, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowDownRight, 
  Filter, 
  Plus, 
  BarChart2, 
  Globe, 
  Activity,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface BusinessItem {
  id: string;
  name: string;
  sector: 'AI & Hardware' | 'SaaS & Enterprise' | 'E-Commerce' | 'FinTech' | 'Green Tech';
  revenue: string;
  yoyGrowth: number;
  grossMargin: number;
  roas: number;
  healthScore: number;
  status: 'Outperforming' | 'High Growth' | 'Stable Compounder';
  description: string;
  topProduct: string;
  ticker?: string;
}

interface StockTradeItem {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  volume24h: string;
  signal: 'Strong Buy' | 'Bullish Momentum' | 'Breakout Watch' | 'Consolidation';
  targetPrice: number;
  stopLoss: number;
  rsi: number;
  sector: string;
  institutionalHolding: string;
  tradeRationale: string;
}

export default function BudgetCalculatorView() {
  const [activeSubTab, setActiveSubTab] = useState<'screener' | 'stocks' | 'calculator'>('screener');

  // ------------ SECTION 1: BUSINESS SCREENER STATE ------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [minGrowth, setMinGrowth] = useState<number>(0);

  const [businesses, setBusinesses] = useState<BusinessItem[]>([
    {
      id: 'biz-1',
      name: 'Silicon Acres Compute Sanctum',
      sector: 'AI & Hardware',
      revenue: '$14.2M/yr',
      yoyGrowth: 142,
      grossMargin: 68,
      roas: 5.4,
      healthScore: 96,
      status: 'Outperforming',
      description: 'Organic motherboard pastures & DDR5 RAM sanctuary providing liquid-cooled cloud instances.',
      topProduct: 'DDR5 Server Blades & GPU Units',
      ticker: 'SLCN',
    },
    {
      id: 'biz-2',
      name: 'ZynCloud AI Analytics Inc.',
      sector: 'SaaS & Enterprise',
      revenue: '$28.5M/yr',
      yoyGrowth: 88,
      grossMargin: 82,
      roas: 4.8,
      healthScore: 94,
      status: 'Outperforming',
      description: 'Predictive enterprise customer intelligence & automated ROAS bidding agent.',
      topProduct: 'ZyncastCFO Engine',
      ticker: 'ZNCL',
    },
    {
      id: 'biz-3',
      name: 'AeroPulse Green Energy',
      sector: 'Green Tech',
      revenue: '$9.8M/yr',
      yoyGrowth: 64,
      grossMargin: 54,
      roas: 3.9,
      healthScore: 89,
      status: 'High Growth',
      description: 'Next-gen solar microfiber storage grids & industrial smart battery systems.',
      topProduct: 'MicroGrid Max 500',
      ticker: 'APGE',
    },
    {
      id: 'biz-4',
      name: 'NovaPay Global Checkout',
      sector: 'FinTech',
      revenue: '$45.1M/yr',
      yoyGrowth: 52,
      grossMargin: 74,
      roas: 4.2,
      healthScore: 91,
      status: 'Stable Compounder',
      description: 'Cross-border zero-friction payment gateway for high-volume merchant ecosystems.',
      topProduct: 'NovaFlow SDK',
      ticker: 'NVPY',
    },
    {
      id: 'biz-5',
      name: 'OmniStyle Direct Retail',
      sector: 'E-Commerce',
      revenue: '$18.6M/yr',
      yoyGrowth: 71,
      grossMargin: 62,
      roas: 4.5,
      healthScore: 88,
      status: 'High Growth',
      description: 'Sustainable luxury apparel DTC brand leveraging personalized video commercials.',
      topProduct: 'EcoFit Active Line',
      ticker: 'OMST',
    },
  ]);

  // Form for adding a custom business
  const [newBizName, setNewBizName] = useState('');
  const [newBizSector, setNewBizSector] = useState<BusinessItem['sector']>('SaaS & Enterprise');
  const [newBizRevenue, setNewBizRevenue] = useState('$5.0M/yr');
  const [newBizGrowth, setNewBizGrowth] = useState<number>(45);
  const [newBizMargin, setNewBizMargin] = useState<number>(65);
  const [newBizRoas, setNewBizRoas] = useState<number>(3.8);
  const [showAddBizModal, setShowAddBizModal] = useState(false);

  const handleAddBusiness = () => {
    if (!newBizName.trim()) return;
    const newItem: BusinessItem = {
      id: `biz-${Date.now()}`,
      name: newBizName,
      sector: newBizSector,
      revenue: newBizRevenue,
      yoyGrowth: newBizGrowth,
      grossMargin: newBizMargin,
      roas: newBizRoas,
      healthScore: Math.min(99, Math.round(75 + newBizGrowth * 0.2 + newBizMargin * 0.1)),
      status: newBizGrowth > 80 ? 'Outperforming' : newBizGrowth > 40 ? 'High Growth' : 'Stable Compounder',
      description: 'User-registered business metric track for commercial ad scaling & financial forecasting.',
      topProduct: 'Core Offer Product',
    };
    setBusinesses([newItem, ...businesses]);
    setNewBizName('');
    setShowAddBizModal(false);
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.ticker && b.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSector = selectedSector === 'All' || b.sector === selectedSector;
    const matchesGrowth = b.yoyGrowth >= minGrowth;
    return matchesSearch && matchesSector && matchesGrowth;
  });

  // ------------ SECTION 2: STOCKS & TRADES STATE ------------
  const [stockSearch, setStockSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState<'All' | 'Strong Buy' | 'Bullish Momentum' | 'Breakout Watch'>('All');

  const stockList: StockTradeItem[] = [
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 128.50,
      changePercent: +4.85,
      volume24h: '42.8M shares',
      signal: 'Strong Buy',
      targetPrice: 155.00,
      stopLoss: 118.00,
      rsi: 64,
      sector: 'Semiconductor / AI Infrastructure',
      institutionalHolding: '68.4%',
      tradeRationale: 'Data center GPU demand surging with enterprise AI fine-tuning expansion.',
    },
    {
      ticker: 'PLTR',
      name: 'Palantir Technologies',
      price: 29.40,
      changePercent: +6.12,
      volume24h: '28.1M shares',
      signal: 'Bullish Momentum',
      targetPrice: 36.00,
      stopLoss: 26.50,
      rsi: 68,
      sector: 'Enterprise AI & Analytics',
      institutionalHolding: '44.2%',
      tradeRationale: 'AIP platform contract velocity accelerating in defense and commercial sectors.',
    },
    {
      ticker: 'AMD',
      name: 'Advanced Micro Devices',
      price: 156.20,
      changePercent: +2.90,
      volume24h: '18.6M shares',
      signal: 'Breakout Watch',
      targetPrice: 185.00,
      stopLoss: 142.00,
      rsi: 58,
      sector: 'Semiconductors',
      institutionalHolding: '71.0%',
      tradeRationale: 'MI300X chip adoption gaining market share among tier-1 cloud providers.',
    },
    {
      ticker: 'SHOP',
      name: 'Shopify Inc.',
      price: 78.90,
      changePercent: +3.45,
      volume24h: '12.4M shares',
      signal: 'Strong Buy',
      targetPrice: 98.00,
      stopLoss: 71.00,
      rsi: 61,
      sector: 'E-Commerce Infrastructure',
      institutionalHolding: '62.8%',
      tradeRationale: 'Enterprise POS penetration & AI ad attribution suite driving take-rate expansion.',
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corp.',
      price: 448.10,
      changePercent: +1.25,
      volume24h: '15.9M shares',
      signal: 'Consolidation',
      targetPrice: 490.00,
      stopLoss: 425.00,
      rsi: 52,
      sector: 'Cloud & AI Enterprise',
      institutionalHolding: '72.3%',
      tradeRationale: 'Copilot enterprise seats monetization scaling across Fortune 500.',
    },
    {
      ticker: 'SLCN',
      name: 'Silicon Acres Tech',
      price: 42.80,
      changePercent: +12.40,
      volume24h: '8.4M shares',
      signal: 'Strong Buy',
      targetPrice: 65.00,
      stopLoss: 36.00,
      rsi: 72,
      sector: 'Hardware Sanctuary & Compute',
      institutionalHolding: '58.9%',
      tradeRationale: 'Organic RAM sticks & liquid-cooled server pastures yielding 142% revenue growth.',
    },
  ];

  // Trade Calculator State
  const [calcEntryPrice, setCalcEntryPrice] = useState<number>(128.5);
  const [calcTargetPrice, setCalcTargetPrice] = useState<number>(155.0);
  const [calcStopLoss, setCalcStopLoss] = useState<number>(118.0);
  const [calcPositionSize, setCalcPositionSize] = useState<number>(5000);

  const potentialGain =
    calcEntryPrice > 0 ? ((calcTargetPrice - calcEntryPrice) / calcEntryPrice) * calcPositionSize : 0;
  const potentialLoss =
    calcEntryPrice > 0 ? ((calcEntryPrice - calcStopLoss) / calcEntryPrice) * calcPositionSize : 0;
  const riskRewardRatio = potentialLoss > 0 ? (potentialGain / potentialLoss).toFixed(2) : 'N/A';

  const filteredStocks = stockList.filter((s) => {
    const matchesSearch =
      s.ticker.toLowerCase().includes(stockSearch.toLowerCase()) ||
      s.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      s.sector.toLowerCase().includes(stockSearch.toLowerCase());
    const matchesFilter = tradeFilter === 'All' || s.signal === tradeFilter;
    return matchesSearch && matchesFilter;
  });

  // ------------ SECTION 3: CFO BUDGET CALCULATOR STATE ------------
  const [targetRevenue, setTargetRevenue] = useState<number>(30000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(120);
  const [targetRoas, setTargetRoas] = useState<number>(4.0);
  const [conversionRate, setConversionRate] = useState<number>(3.5); // %
  const [estCpc, setEstCpc] = useState<number>(0.85); // $

  const [metaPct, setMetaPct] = useState(40);
  const [googlePct, setGooglePct] = useState(35);
  const [tiktokPct, setTiktokPct] = useState(15);
  const [linkedinPct, setLinkedinPct] = useState(10);

  const requiredSales = targetRevenue > 0 && avgOrderValue > 0 ? Math.ceil(targetRevenue / avgOrderValue) : 0;
  const requiredBudget = targetRevenue > 0 && targetRoas > 0 ? targetRevenue / targetRoas : 0;
  const dailyBudget = requiredBudget / 30;
  const requiredClicks = conversionRate > 0 ? Math.ceil(requiredSales / (conversionRate / 100)) : 0;
  const projectedImpressions = requiredClicks * 35;
  const netProfit = targetRevenue - requiredBudget;

  const metaBudget = (requiredBudget * metaPct) / 100;
  const googleBudget = (requiredBudget * googlePct) / 100;
  const tiktokBudget = (requiredBudget * tiktokPct) / 100;
  const linkedinBudget = (requiredBudget * linkedinPct) / 100;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase rounded-md border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> ZyncastCFO Intelligence Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Financials & Business Growth Suite</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              ZyncastCFO Business & Stock Intelligence
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Analyze high-performing businesses, track stock trade setups, calculate risk/reward ratios, and forecast ad ROI unit economics for your campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right px-2">
              <span className="text-[10px] text-slate-400 font-mono block">SUITE STATUS</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> Live Market Feed
              </span>
            </div>
          </div>
        </div>

        {/* SubTab Navigation Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('screener')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'screener'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Top-Performing Business Screener
            <span className="ml-1 px-1.5 py-0.2 bg-black/20 text-[10px] rounded font-mono">
              {businesses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('stocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'stocks'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <LineChart className="w-4 h-4" />
            Stock & Market Trade Signals
            <span className="ml-1 px-1.5 py-0.2 bg-black/20 text-[10px] rounded font-mono">
              {stockList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            CFO Ad Budget & ROI Forecasting
          </button>
        </div>
      </div>

      {/* ==================== SUBTAB 1: HIGH-PERFORMING BUSINESS SCREENER ==================== */}
      {activeSubTab === 'screener' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business name, product, or ticker..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-slate-700">Sector:</span>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900 focus:outline-none"
                >
                  <option value="All">All Sectors</option>
                  <option value="AI & Hardware">AI & Hardware</option>
                  <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Green Tech">Green Tech</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Min YoY Growth:</span>
                <select
                  value={minGrowth}
                  onChange={(e) => setMinGrowth(Number(e.target.value))}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900 focus:outline-none"
                >
                  <option value={0}>All Growth %</option>
                  <option value={40}>&gt; 40% YoY</option>
                  <option value={70}>&gt; 70% YoY</option>
                  <option value={100}>&gt; 100% Hypergrowth</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddBizModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ml-auto"
              >
                <Plus className="w-4 h-4" /> Add Business Track
              </button>
            </div>
          </div>

          {/* Add Custom Business Track Modal */}
          {showAddBizModal && (
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" /> Track New Business Performance
                </h3>
                <button
                  onClick={() => setShowAddBizModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="e.g. Quantum Dynamics Ltd."
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Industry Sector</label>
                  <select
                    value={newBizSector}
                    onChange={(e) => setNewBizSector(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="AI & Hardware">AI & Hardware</option>
                    <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Green Tech">Green Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Annual Revenue Run-Rate</label>
                  <input
                    type="text"
                    value={newBizRevenue}
                    onChange={(e) => setNewBizRevenue(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">YoY Revenue Growth (%)</label>
                  <input
                    type="number"
                    value={newBizGrowth}
                    onChange={(e) => setNewBizGrowth(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gross Margin (%)</label>
                  <input
                    type="number"
                    value={newBizMargin}
                    onChange={(e) => setNewBizMargin(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Blended Marketing ROAS</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBizRoas}
                    onChange={(e) => setNewBizRoas(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddBizModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBusiness}
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer hover:bg-emerald-400"
                >
                  Save Business Profile
                </button>
              </div>
            </div>
          )}

          {/* Business Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {biz.sector}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                        {biz.name}
                        {biz.ticker && (
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            ${biz.ticker}
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">HEALTH SCORE</span>
                      <span className="text-sm font-extrabold text-emerald-600 font-mono flex items-center justify-end gap-0.5">
                        <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                        {biz.healthScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  <div className="mt-3 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Core Product:</span>
                    <strong className="text-slate-900 font-bold truncate max-w-[160px]">{biz.topProduct}</strong>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-mono">
                  <div className="bg-slate-50/80 p-2 rounded-lg text-center">
                    <span className="text-[9px] text-slate-400 block uppercase font-sans font-medium">Annual Rev</span>
                    <strong className="text-xs text-slate-900 font-bold">{biz.revenue}</strong>
                  </div>

                  <div className="bg-emerald-50/80 p-2 rounded-lg text-center">
                    <span className="text-[9px] text-emerald-700 block uppercase font-sans font-medium">YoY Growth</span>
                    <strong className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> +{biz.yoyGrowth}%
                    </strong>
                  </div>

                  <div className="bg-indigo-50/80 p-2 rounded-lg text-center">
                    <span className="text-[9px] text-indigo-700 block uppercase font-sans font-medium">Ad ROAS</span>
                    <strong className="text-xs text-indigo-700 font-bold">{biz.roas}x</strong>
                  </div>
                </div>

                {/* Performance Status Tag */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Gross Margin: {biz.grossMargin}%
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {biz.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: STOCKS & MARKET TRADE SIGNALS ==================== */}
      {activeSubTab === 'stocks' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Market Intelligence Top Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {/* Stock Search & Signal Filter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search stock ticker (NVDA, PLTR, SLCN)..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700">Trade Signal:</span>
                  <div className="flex gap-1">
                    {(['All', 'Strong Buy', 'Bullish Momentum', 'Breakout Watch'] as const).map((sig) => (
                      <button
                        key={sig}
                        onClick={() => setTradeFilter(sig)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          tradeFilter === sig
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sig}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stock Signal Cards */}
              <div className="space-y-3">
                {filteredStocks.map((stk) => (
                  <div
                    key={stk.ticker}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            ${stk.ticker}
                          </span>
                          <h3 className="text-sm font-bold text-slate-800">{stk.name}</h3>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            {stk.sector}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">MARKET PRICE</span>
                          <strong className="text-base text-slate-900 font-bold">${stk.price.toFixed(2)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">24H CHANGE</span>
                          <strong
                            className={`text-sm font-bold flex items-center gap-0.5 ${
                              stk.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {stk.changePercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {stk.changePercent >= 0 ? '+' : ''}{stk.changePercent}%
                          </strong>
                        </div>
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-xl font-sans ${
                            stk.signal === 'Strong Buy'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : stk.signal === 'Bullish Momentum'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {stk.signal}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-400 block font-sans">TARGET PRICE</span>
                        <strong className="text-slate-900 text-sm font-bold">${stk.targetPrice.toFixed(2)}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-400 block font-sans">STOP LOSS</span>
                        <strong className="text-rose-600 text-sm font-bold">${stk.stopLoss.toFixed(2)}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-400 block font-sans">RSI INDEX</span>
                        <strong className="text-slate-900 text-sm font-bold">{stk.rsi} / 100</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-400 block font-sans">INSTITUTIONAL %</span>
                        <strong className="text-slate-900 text-sm font-bold">{stk.institutionalHolding}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
                      <strong className="text-slate-800 font-bold">Trade Rationale:</strong> {stk.tradeRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Column: Interactive Trade Position & Risk Calculator */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-600" /> Interactive Trade Position Risk/Reward Calculator
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Entry Stock Price ($)</label>
                    <input
                      type="number"
                      value={calcEntryPrice}
                      onChange={(e) => setCalcEntryPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Price ($)</label>
                      <input
                        type="number"
                        value={calcTargetPrice}
                        onChange={(e) => setCalcTargetPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stop Loss ($)</label>
                      <input
                        type="number"
                        value={calcStopLoss}
                        onChange={(e) => setCalcStopLoss(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-rose-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Trade Allocation Size ($)</label>
                    <input
                      type="number"
                      step="500"
                      value={calcPositionSize}
                      onChange={(e) => setCalcPositionSize(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  {/* Calculated Outcomes */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 font-mono">
                    <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg text-xs">
                      <span className="text-emerald-800 font-sans font-bold">Potential Profit (+):</span>
                      <strong className="text-emerald-700 font-bold">${Math.round(potentialGain).toLocaleString()}</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-rose-50 rounded-lg text-xs">
                      <span className="text-rose-800 font-sans font-bold">Max Loss (-):</span>
                      <strong className="text-rose-700 font-bold">${Math.round(potentialLoss).toLocaleString()}</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-900 text-white rounded-lg text-xs">
                      <span className="text-slate-300 font-sans font-bold">Risk / Reward Ratio:</span>
                      <strong className="text-emerald-400 font-bold">1 : {riskRewardRatio}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: CFO AD BUDGET & ROI FORECASTING ==================== */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Input Parameters Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" /> Revenue & Cost Inputs
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Monthly Revenue ($)</label>
                <input
                  type="number"
                  step="1000"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Avg Deal / Order ($)</label>
                  <input
                    type="number"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target ROAS Goal</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Conversion Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated CPC ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={estCpc}
                    onChange={(e) => setEstCpc(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Projected Outputs Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Monthly Ad Budget</span>
                <div className="text-xl font-bold text-indigo-600 font-mono mt-1">
                  ${Math.round(requiredBudget).toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Required Total Spend</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Recommended Daily</span>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  ${Math.round(dailyBudget).toLocaleString()}/day
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Paced over 30 days</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Net Profit</span>
                <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
                  ${Math.round(netProfit).toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Estimated Net Margin</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Required Clicks</span>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  {requiredClicks.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Targeted traffic</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Target Sales / Leads</span>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  {requiredSales.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Conversions needed</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Est. Impressions</span>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  {projectedImpressions.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">At ~2.8% CTR</span>
              </div>
            </div>

            {/* Interactive Channel Split Allocator */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Channel Budget Allocation Split
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-700">Meta (FB/IG) ({metaPct}%):</span>
                  <strong className="text-indigo-600">${Math.round(metaBudget).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metaPct}
                  onChange={(e) => setMetaPct(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-700">Google Ads ({googlePct}%):</span>
                  <strong className="text-indigo-600">${Math.round(googleBudget).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={googlePct}
                  onChange={(e) => setGooglePct(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-700">TikTok Ads ({tiktokPct}%):</span>
                  <strong className="text-indigo-600">${Math.round(tiktokBudget).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tiktokPct}
                  onChange={(e) => setTiktokPct(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-700">LinkedIn Ads ({linkedinPct}%):</span>
                  <strong className="text-indigo-600">${Math.round(linkedinBudget).toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={linkedinPct}
                  onChange={(e) => setLinkedinPct(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
