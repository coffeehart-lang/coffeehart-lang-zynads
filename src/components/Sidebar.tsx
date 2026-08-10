import { LayoutDashboard, Megaphone, Palette, Users, Sparkles, BarChart3, Eye, EyeOff, Zap, X, LogIn, Video, Calculator } from 'lucide-react';
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
  const menuItems = [
    { id: 'dashboard', label: 'Overview & ROAS', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Ad Campaigns', icon: Megaphone },
    { id: 'creatives', label: 'Ad Copy & Assets', icon: Palette },
    { id: 'audiences', label: 'Target Audiences', icon: Users },
    { id: 'teleprompter', label: 'Commercial & AI Video Studio', icon: Video },
    { id: 'budget-calculator', label: 'ZyncastCFO Financials', icon: Calculator },
    { id: 'ai-optimizer', label: 'AI Ad Strategy', icon: Sparkles },
    { id: 'analytics', label: 'Reports & Site Traffic', icon: BarChart3 },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-950 text-slate-100 flex flex-col h-full border-r border-slate-800 shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div id="brand-header" className="p-5 border-b border-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div id="logo-icon" className="p-2 bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 rounded-xl text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <a href="https://zynads.zyncastcfo.com" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
              <h1 id="brand-title" className="font-sans font-bold text-lg tracking-tight leading-none text-white flex items-center gap-1.5">
                Zyn<span className="text-indigo-400 font-extrabold">Ads</span>
                <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.5 rounded">ALL-IN-ONE</span>
              </h1>
              <span id="brand-subtitle" className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-0.5">BUSINESS GROWTH PLATFORM</span>
            </a>
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

        {/* Intuit-Style Suite App Switcher Banner */}
        <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300">UNIFIED SUITE APPS</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">● SYNCED</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1">
            <div className="bg-indigo-950/60 border border-indigo-800/50 p-1.5 rounded text-center">
              <span className="block text-[10px] font-bold text-indigo-300">ZynAds</span>
              <span className="block text-[8px] text-slate-400">Campaigns</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800/50 p-1.5 rounded text-center">
              <span className="block text-[10px] font-bold text-emerald-300">ZyncastCFO</span>
              <span className="block text-[8px] text-slate-400">Financials</span>
            </div>
            <div className="bg-purple-950/60 border border-purple-800/50 p-1.5 rounded text-center">
              <span className="block text-[10px] font-bold text-purple-300">ZynStudio</span>
              <span className="block text-[8px] text-slate-400">Commercials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status Widget */}
      <div id="subscription-status-widget" className="p-4 mx-4 mt-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">AD ENGINE TIER</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
            userTier === 'pro'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-sm'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {userTier === 'pro' ? 'PRO SCALE' : 'FREE TIER'}
          </span>
        </div>
        
        {userTier === 'pro' ? (
          <div className="space-y-1">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400 fill-current" /> Unlimited Campaign Optimizations
            </span>
            <button
              onClick={onOpenCheckout}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer underline bg-transparent border-0 p-0"
            >
              Manage subscription &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 leading-tight block">
              Upgrade for automated AI bidding and unlimited headlines.
            </span>
            <button
              onClick={onOpenCheckout}
              className="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer text-center shadow-sm flex items-center justify-center gap-1"
            >
              <Zap className="w-2.5 h-2.5 fill-current" /> Upgrade to PRO
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-6 space-y-2">
        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
          Campaign Workspace
        </span>
        {menuItems.map((item) => {
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border-l-4 border-indigo-500 pl-3.5 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
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
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{currentUser.email || 'admanager@zynads.com'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <LogIn className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Sign In / Register</span>
            </div>
          )}
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold shrink-0">
            {currentUser.isLoggedIn ? 'ACCOUNT' : 'AUTH'}
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
          <a href="https://zynads.zyncastcfo.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
            Zynads
          </a>
        </p>
      </div>
    </aside>
  );
}
