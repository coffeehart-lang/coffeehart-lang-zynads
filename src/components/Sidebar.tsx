import { LayoutDashboard, Sparkles, BarChart3, Eye, EyeOff, Zap, X, LogIn, Calculator, FileSpreadsheet, ShieldAlert, Vault, Scale, LineChart, PieChart, Video, Film, Megaphone, Radio, Tv, Mic } from 'lucide-react';
import { UserProfile } from './AuthModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  userTier: 'free' | 'pro';
  onOpenCheckout: () => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onClose?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isPrivacyMode, 
  setIsPrivacyMode,
  userTier,
  onOpenCheckout,
  currentUser,
  onOpenAuth,
  onClose
}: SidebarProps) {
  return (
    <aside id="sidebar-container" className="w-64 bg-slate-950 text-slate-100 flex flex-col h-full border-r border-slate-800 shrink-0 overflow-y-auto font-sans">
      {/* Brand Header */}
      <div id="brand-header" className="p-5 border-b border-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div id="logo-icon" className="p-2 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 rounded-xl text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 id="brand-title" className="font-sans font-bold text-lg tracking-tight leading-none text-white flex items-center gap-1.5">
                Zen<span className="text-emerald-400 font-extrabold">Ads</span>
                <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.5 rounded">STUDIO</span>
              </h1>
              <span id="brand-subtitle" className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-0.5">ZENCAST VIDEO & CFO SUITE</span>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-md transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Subscription / Upgrade Status Widget */}
      <div id="subscription-status-widget" className="p-4 mx-4 mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">ACCOUNT SYSTEM</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
            userTier === 'pro'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {userTier === 'pro' ? 'STUDIO PRO SUITE' : 'FREE TIER'}
          </span>
        </div>
        
        {userTier === 'pro' ? (
          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-400 fill-current" /> Unlimited Video Generates & QB Sync
            </span>
            <button
              onClick={onOpenCheckout}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer underline bg-transparent border-0 p-0"
            >
              Manage subscription &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 leading-tight block">
              RunwayML, Pika, Synthesia & AI Audits ready.
            </span>
            <button
              onClick={onOpenCheckout}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer text-center shadow-lg flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3 fill-current text-emerald-200" /> UPGRADE TO PRO
            </button>
          </div>
        )}
      </div>

      {/* Navigation matching ZynAds & ZyncastCFO exact sidebar layout */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-4 space-y-6">
        {/* SECTION 1: ZENADS AI VIDEO & COMMERCIAL STUDIO */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
            <Tv className="w-3 h-3" /> ZENADS VIDEO STUDIO
          </span>
          {[
            { id: 'video-studio', label: 'AI Video Commercials', icon: Video, badge: 'RUNWAY/PIKA' },
            { id: 'voiceovers', label: 'AI Voiceovers & Speech', icon: Mic, badge: 'STUDIO' },
            { id: 'creatives', label: 'Creative Assets & Video Studio', icon: Film, badge: 'KREA/AI' },
            { id: 'campaigns', label: 'Commercial Campaigns', icon: Megaphone },
            { id: 'teleprompter', label: 'Teleprompter & Script Recorder', icon: Radio },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-l-4 border-emerald-400 pl-3.5 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-extrabold bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SECTION 2: ZYNCAST CFO FINANCIAL ENGINE */}
        <div className="space-y-1 pt-2 border-t border-slate-900">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
            <Vault className="w-3 h-3 text-teal-400" /> ZYNCAST CFO SUITE
          </span>
          {[
            { id: 'dashboard', label: 'CFO Executive Dashboard', icon: LayoutDashboard },
            { id: 'payroll', label: 'Payroll & QuickBooks Sync', icon: FileSpreadsheet, badge: '8-CYCLE AI' },
            { id: 'budget-calculator', label: 'Forecast & Profit Margins', icon: Calculator },
            { id: 'ai-optimizer', label: 'AI CFO & Ad Advisor', icon: Sparkles },
            { id: 'analytics', label: 'Financial & Tax Reports', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border-l-4 border-indigo-400 pl-3.5 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-extrabold bg-indigo-400 text-slate-950 px-1.5 py-0.5 rounded shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SECTION 2: OPERATOR SIDE TOOLS */}
        <div className="space-y-1 pt-2 border-t border-slate-900">
          <span className="px-3 text-[10px] font-bold text-amber-500/90 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1">
            OPERATOR SIDE TOOLS
          </span>
          {[
            { id: 'payroll', label: 'Quick Tax & Payroll Audit', icon: ShieldAlert, badge: 'AI AUDIT' },
            { id: 'payroll', label: 'Cash Vault & Denominations', icon: Vault, badge: 'CASH ONLY' },
            { id: 'budget-calculator', label: 'Margin & Markup', icon: Scale },
            { id: 'budget-calculator', label: 'Cash Flow Runway', icon: LineChart },
            { id: 'analytics', label: 'Expense Ratio Check', icon: PieChart },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={`${item.id}-${idx}`}
                id={`sidebar-operator-link-${idx}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer info */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-900 space-y-3">
        {/* User Account Bar */}
        <button
          onClick={onOpenAuth}
          className="w-full flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors text-left cursor-pointer"
        >
          {currentUser.isLoggedIn ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{currentUser.email || 'cfo@zyncastcfo.com'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sign In / Register</span>
            </div>
          )}
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold shrink-0">
            {currentUser.isLoggedIn ? 'CFO PROFILE' : 'AUTH'}
          </span>
        </button>

        <button
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
            isPrivacyMode 
              ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40 hover:bg-rose-950/60' 
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>Privacy Mask</span>
          </div>
          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
            isPrivacyMode ? 'bg-rose-900/50 text-rose-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {isPrivacyMode ? 'ON' : 'OFF'}
          </span>
        </button>
        <p className="text-[10px] font-mono text-slate-500 text-center flex items-center justify-center gap-1">
          <span>Platform &copy; 2026 — </span>
          <a href="https://zyncastcfo.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold underline">
            ZyncastCFO
          </a>
        </p>
      </div>
    </aside>
  );
}

