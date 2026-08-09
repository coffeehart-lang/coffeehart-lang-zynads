import { useState, useEffect } from 'react';
import { AdCampaign } from '../types';
import { PERFORMANCE_HISTORY } from '../data';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Target, 
  PieChart as PieIcon, 
  Activity, 
  Users, 
  Download, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  FileText, 
  ArrowUpRight,
  Zap,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

interface AnalyticsViewProps {
  campaigns: AdCampaign[];
  isPrivacyMode: boolean;
}

// Simulated Live Site Traffic Visit Log Item
interface TrafficVisit {
  id: string;
  time: string;
  location: string;
  source: string;
  adCampaign: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  pageVisited: string;
  duration: string;
  converted: boolean;
}

const INITIAL_VISITS: TrafficVisit[] = [
  { id: 'v-101', time: 'Just now', location: 'Austin, TX, US', source: 'Meta (FB/IG)', adCampaign: 'Summer SaaS Retargeting', device: 'Mobile', pageVisited: '/pricing', duration: '2m 14s', converted: true },
  { id: 'v-102', time: '1 min ago', location: 'London, UK', source: 'Google Ads', adCampaign: 'High-Intent Search Keyword', device: 'Desktop', pageVisited: '/demo', duration: '45s', converted: false },
  { id: 'v-103', time: '3 mins ago', location: 'Toronto, CA', source: 'TikTok Ads', adCampaign: 'Gen-Z Viral Discovery', device: 'Mobile', pageVisited: '/', duration: '1m 30s', converted: false },
  { id: 'v-104', time: '4 mins ago', location: 'New York, NY, US', source: 'Meta (FB/IG)', adCampaign: 'Summer SaaS Retargeting', device: 'Mobile', pageVisited: '/checkout', duration: '3m 05s', converted: true },
  { id: 'v-105', time: '6 mins ago', location: 'Chicago, IL, US', source: 'Google Ads', adCampaign: 'High-Intent Search Keyword', device: 'Desktop', pageVisited: '/features', duration: '1m 12s', converted: false },
  { id: 'v-106', time: '8 mins ago', location: 'Sydney, AU', source: 'Direct / Organic', adCampaign: 'Organic Search', device: 'Desktop', pageVisited: '/blog/ad-roi', duration: '5m 20s', converted: false },
  { id: 'v-107', time: '10 mins ago', location: 'Seattle, WA, US', source: 'Meta (FB/IG)', adCampaign: 'Summer SaaS Retargeting', device: 'Tablet', pageVisited: '/pricing', duration: '2m 55s', converted: true },
];

const DEMO_AGE_DATA = [
  { age: '18-24', percentage: 18, color: '#818cf8' },
  { age: '25-34', percentage: 42, color: '#6366f1' },
  { age: '35-44', percentage: 24, color: '#4f46e5' },
  { age: '45-54', percentage: 11, color: '#4338ca' },
  { age: '55+', percentage: 5, color: '#3730a3' },
];

const DEMO_GENDER_DATA = [
  { name: 'Female', value: 52, color: '#ec4899' },
  { name: 'Male', value: 44, color: '#3b82f6' },
  { name: 'Other / Unspecified', value: 4, color: '#94a3b8' },
];

const DEMO_GEO_DATA = [
  { region: 'United States', share: '58%', conversions: 420, flag: '🇺🇸' },
  { region: 'United Kingdom', share: '16%', conversions: 115, flag: '🇬🇧' },
  { region: 'Canada', share: '14%', conversions: 98, flag: '🇨🇦' },
  { region: 'Australia', share: '8%', conversions: 52, flag: '🇦🇺' },
  { region: 'Other Global', share: '4%', conversions: 30, flag: '🌐' },
];

export default function AnalyticsView({ campaigns, isPrivacyMode }: AnalyticsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'traffic' | 'reports' | 'audience' | 'feedback'>('traffic');
  const [visits, setVisits] = useState<TrafficVisit[]>(INITIAL_VISITS);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [reportGeneratedTime, setReportGeneratedTime] = useState<string | null>(null);

  // Live traffic simulator tick
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const locations = ['San Francisco, CA', 'Miami, FL', 'Berlin, DE', 'Dallas, TX', 'Vancouver, CA', 'Boston, MA'];
      const sources = ['Meta (FB/IG)', 'Google Ads', 'TikTok Ads', 'Direct / Organic'];
      const campaignsList = ['Summer SaaS Retargeting', 'High-Intent Search Keyword', 'Gen-Z Viral Discovery', 'Direct Visit'];
      const devices: ('Mobile' | 'Desktop' | 'Tablet')[] = ['Mobile', 'Desktop', 'Tablet'];
      const pages = ['/', '/pricing', '/demo', '/checkout', '/features'];

      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      const randomSrc = sources[Math.floor(Math.random() * sources.length)];
      const randomCamp = campaignsList[Math.floor(Math.random() * campaignsList.length)];
      const randomDev = devices[Math.floor(Math.random() * devices.length)];
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      const randomConverted = Math.random() > 0.65;

      const newVisit: TrafficVisit = {
        id: `v-${Date.now()}`,
        time: 'Just now',
        location: randomLoc,
        source: randomSrc,
        adCampaign: randomCamp,
        device: randomDev,
        pageVisited: randomPage,
        duration: `${Math.floor(Math.random() * 4) + 1}m ${Math.floor(Math.random() * 50)}s`,
        converted: randomConverted
      };

      setVisits(prev => [newVisit, ...prev.slice(0, 14)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Aggregate data by platform
  const channelDataMap: Record<string, { platform: string; spend: number; clicks: number; conversions: number; roas: number }> = {};

  campaigns.forEach(c => {
    if (!channelDataMap[c.platform]) {
      channelDataMap[c.platform] = { platform: c.platform, spend: 0, clicks: 0, conversions: 0, roas: c.roas };
    }
    channelDataMap[c.platform].spend += c.totalSpent;
    channelDataMap[c.platform].clicks += c.clicks;
    channelDataMap[c.platform].conversions += c.conversions;
  });

  const channelChartData = Object.values(channelDataMap);

  const formatCurrency = (val: number) => {
    if (isPrivacyMode) return '••••••';
    return `$${val.toLocaleString()}`;
  };

  const handleDownloadReport = () => {
    const reportText = `ZYNADS EXECUTIVE AD PERFORMANCE & SITE TRAFFIC REPORT
Generated: ${new Date().toLocaleString()}
--------------------------------------------------
TOTAL CAMPAIGNS: ${campaigns.length}
ACTIVE SPEND: $${campaigns.reduce((a, b) => a + b.totalSpent, 0).toLocaleString()}
TOTAL CLICKS: ${campaigns.reduce((a, b) => a + b.clicks, 0).toLocaleString()}
TOTAL CONVERSIONS: ${campaigns.reduce((a, b) => a + b.conversions, 0).toLocaleString()}
AVERAGE ROAS: ${(campaigns.reduce((a, b) => a + b.roas, 0) / (campaigns.length || 1)).toFixed(2)}x

CHANNEL BREAKDOWN:
${channelChartData.map(c => `- ${c.platform}: Spend $${c.spend.toLocaleString()} | Clicks ${c.clicks.toLocaleString()} | Conversions ${c.conversions}`).join('\n')}

AI DIAGNOSTIC SUMMARY:
- Top Performing Channel: Meta (FB/IG) at 4.85x ROAS
- Traffic Telemetry Status: Live monitoring 100% active
- Recommendation: Maintain direct response budget and refresh TikTok video assets.
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZynAds_Performance_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setReportGeneratedTime(new Date().toLocaleTimeString());
    setTimeout(() => setReportGeneratedTime(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Main Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold uppercase rounded border border-indigo-500/40">
              Live Small Business Intelligence
            </span>
            <span className="text-xs text-slate-400">Traffic • Performance Reports • Audience Insights</span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Ad Performance & Site Traffic Intelligence</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Track real-time site visits coming from your ads, generate executive performance reports, identify reached audience demographics, and review automated AI feedback.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" /> Download Performance Report
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('traffic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'traffic'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Live Site Traffic Recorder
          <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 font-mono text-[10px] rounded-full font-bold animate-pulse">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Ad Performance Reports
        </button>

        <button
          onClick={() => setActiveSubTab('audience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'audience'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Reached Audience Demographics
        </button>

        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Automated AI Feedback & Fixes
        </button>
      </div>

      {/* TAB 1: LIVE SITE TRAFFIC RECORDER */}
      {activeSubTab === 'traffic' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Traffic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                <span>Active Live Visitors</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {isPrivacyMode ? '••••' : '48 Online Now'}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">+14% vs previous hour</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-mono uppercase block">Ad Traffic Share</span>
              <div className="text-2xl font-bold text-indigo-600 font-mono">
                {isPrivacyMode ? '••••' : '68.4%'}
              </div>
              <p className="text-[11px] text-slate-500">From Meta, Google & TikTok Ads</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-mono uppercase block">Avg Time on Site</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                2m 42s
              </div>
              <p className="text-[11px] text-slate-500">High engagement score</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[11px] text-slate-500 font-mono uppercase block">Live Conversion Rate</span>
              <div className="text-2xl font-bold text-emerald-600 font-mono">
                {isPrivacyMode ? '••••' : '4.85%'}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">Above 3.2% industry benchmark</p>
            </div>
          </div>

          {/* Traffic Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recorded Site Traffic & Visitor Volume</h3>
                <p className="text-xs text-slate-500">Daily website visitor sessions attributed to active ad campaigns</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1 text-indigo-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" /> Ad Traffic
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Conversions
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_HISTORY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="clicks" name="Site Traffic Visits" stroke="#6366f1" fillOpacity={1} fill="url(#colorTraffic)" />
                  <Area type="monotone" dataKey="conversions" name="Goal Conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConversions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Web Visitor Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" /> Live Site Visitor Telemetry Stream
                </h3>
                <p className="text-xs text-slate-500">Real-time recording of website visitors coming from your ad channels</p>
              </div>

              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isLiveStreaming ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} />
                Live Recording: {isLiveStreaming ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Traffic Source</th>
                    <th className="py-2.5 px-3">Ad Campaign</th>
                    <th className="py-2.5 px-3">Device</th>
                    <th className="py-2.5 px-3">Landing Page</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-indigo-500" /> {v.time}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" /> {v.location}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px] rounded border border-indigo-100">
                          {v.source}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{v.adCampaign}</td>
                      <td className="py-2.5 px-3 text-slate-600 flex items-center gap-1 font-mono text-[11px]">
                        {v.device === 'Mobile' ? <Smartphone className="w-3 h-3 text-slate-400" /> : <Monitor className="w-3 h-3 text-slate-400" />}
                        {v.device}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{v.pageVisited} ({v.duration})</td>
                      <td className="py-2.5 px-3">
                        {v.converted ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Converted
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-mono">Browsing</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AD PERFORMANCE REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          {reportGeneratedTime && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Executive Report downloaded successfully at {reportGeneratedTime}!
            </div>
          )}

          {/* Campaign Performance Scorecards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ad Campaign Executive Performance Scorecards</h3>
                <p className="text-xs text-slate-500">Individual ad evaluation, conversion efficiency, and ROAS grades</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => {
                const grade = camp.roas >= 4.5 ? 'A+' : camp.roas >= 3.5 ? 'A' : camp.roas >= 2.5 ? 'B+' : 'C';
                const gradeColor = grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300';

                return (
                  <div key={camp.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 block">{camp.platform}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{camp.name}</h4>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border font-mono font-black text-sm ${gradeColor}`}>
                        Grade: {grade}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Total Spend</span>
                        <strong className="text-slate-900">{formatCurrency(camp.totalSpent)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Conversions</span>
                        <strong className="text-emerald-600">{isPrivacyMode ? '••••' : camp.conversions}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Return (ROAS)</span>
                        <strong className="text-indigo-600">{camp.roas > 0 ? `${camp.roas}x` : 'N/A'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bar Chart: Channel Spend vs Conversions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Ad Spend vs Conversions by Network Channel</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="spend" name="Ad Spend ($)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="conversions" name="Conversions" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REACHED AUDIENCE DEMOGRAPHICS */}
      {activeSubTab === 'audience' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Demographics Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Age Distribution Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> Reached Age Demographics
              </h3>

              <div className="space-y-3">
                {DEMO_AGE_DATA.map((item) => (
                  <div key={item.age} className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-700">
                      <span>Age {item.age}:</span>
                      <strong>{item.percentage}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Split Pie */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" /> Gender Distribution
              </h3>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={DEMO_GENDER_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                      {DEMO_GENDER_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-4 text-xs font-mono pt-2 border-t border-slate-100">
                {DEMO_GENDER_DATA.map(g => (
                  <div key={g.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-slate-600">{g.name}: <strong>{g.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Reached Regions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" /> Top Reached Geographies
              </h3>

              <div className="space-y-2.5">
                {DEMO_GEO_DATA.map((geo) => (
                  <div key={geo.region} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <span className="text-base">{geo.flag}</span>
                      <span>{geo.region}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-600 block">{geo.share}</span>
                      <span className="text-[10px] text-slate-400">{geo.conversions} conv.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED AI FEEDBACK & DIAGNOSTICS */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-800/80 text-white shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">ZynAds Algorithmic Diagnostics</span>
            </div>
            <h3 className="text-xl font-bold font-sans">Automated Performance Feedback & Recommendations</h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Our AI engine continuously analyzes your campaign CTRs, cost-per-click, and site traffic behaviors to highlight what's working and what needs immediate attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Positive Signals */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top Performing Win Signals
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-slate-800 space-y-1">
                  <span className="font-bold text-emerald-900 block">Meta Retargeting Campaign High ROAS (4.85x)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Your Meta retargeting copy ("Scale Your Ad ROI by 4x") is generating high click intent. Conversion rate on site is 5.0%.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-slate-800 space-y-1">
                  <span className="font-bold text-emerald-900 block">Google Search CTR (8.50%) Outperforming Benchmark</span>
                  <p className="text-slate-600 leading-relaxed">
                    Keyword match quality on "best ad campaign platform" is driving steady inbound sales leads at $1.13 CPC.
                  </p>
                </div>
              </div>
            </div>

            {/* Improvement Needed Signals */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Optimization Feedback & Warnings
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-slate-800 space-y-1">
                  <span className="font-bold text-amber-900 block">TikTok Creative Refresh Recommended</span>
                  <p className="text-slate-600 leading-relaxed">
                    TikTok CTR dropped slightly to 2.80% over the last 48 hours. Consider recording a new 15-second video commercial using the Teleprompter Studio.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-slate-800 space-y-1">
                  <span className="font-bold text-indigo-900 block">Recommended Action: Reallocate $50/day</span>
                  <p className="text-slate-600 leading-relaxed">
                    Moving $50/day from paused LinkedIn budget into Meta Retargeting is projected to yield +$1,400 in net monthly profit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
