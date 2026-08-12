/**
 * Copyright (c) 2026 Coffeehart / ZynAds / Zencast. All Rights Reserved.
 * Proprietary and Confidential.
 * 
 * Unauthorized copying, distribution, or reproduction of this software via any medium
 * is strictly prohibited without explicit written permission from the copyright owner.
 * Contact: coffeehart@gmail.com
 */

import { useState, useEffect } from 'react';
import { Menu, Megaphone, Zap } from 'lucide-react';
import { AdCampaign } from './types';
import { INITIAL_CAMPAIGNS } from './data';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CampaignsView from './components/CampaignsView';
import CreativesView from './components/CreativesView';
import AudiencesView from './components/AudiencesView';
import AIOptimizerView from './components/AIOptimizerView';
import AnalyticsView from './components/AnalyticsView';
import TeleprompterView from './components/TeleprompterView';
import BudgetCalculatorView from './components/BudgetCalculatorView';
import PayrollView from './components/PayrollView';
import CheckoutModal from './components/CheckoutModal';
import AuthModal, { UserProfile } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    return localStorage.getItem('zynads_privacy_mode') === 'true';
  });
  const [userTier, setUserTier] = useState<'free' | 'pro'>(() => {
    return (localStorage.getItem('zynads_user_tier') as 'free' | 'pro') || 'free';
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // User Auth State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('zynads_user_profile');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse user profile:", e);
      }
    }
    return {
      name: 'Ad Campaign Manager',
      email: 'admanager@zynads.com',
      companyName: 'ZynAds Growth Account',
      tier: 'free',
      isLoggedIn: true
    };
  });

  useEffect(() => {
    localStorage.setItem('zynads_privacy_mode', isPrivacyMode ? 'true' : 'false');
  }, [isPrivacyMode]);

  useEffect(() => {
    localStorage.setItem('zynads_user_tier', userTier);
  }, [userTier]);

  useEffect(() => {
    localStorage.setItem('zynads_user_profile', JSON.stringify(currentUser));
  }, [currentUser]);

  // Load campaigns from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('zynads_campaigns');
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved campaigns, resetting:", e);
        setCampaigns(INITIAL_CAMPAIGNS);
        localStorage.setItem('zynads_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
      }
    } else {
      setCampaigns(INITIAL_CAMPAIGNS);
      localStorage.setItem('zynads_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    }
  }, []);

  const saveCampaigns = (updatedList: AdCampaign[]) => {
    setCampaigns(updatedList);
    localStorage.setItem('zynads_campaigns', JSON.stringify(updatedList));
  };

  const handleAddCampaign = (newCamp: Omit<AdCampaign, 'id'>) => {
    const camp: AdCampaign = {
      ...newCamp,
      id: `camp-${Date.now()}`
    };
    const updated = [camp, ...campaigns];
    saveCampaigns(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = campaigns.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        return { ...c, status: nextStatus as AdCampaign['status'] };
      }
      return c;
    });
    saveCampaigns(updated);
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    saveCampaigns(updated);
  };

  return (
    <div id="app-root-container" className="flex flex-col md:flex-row h-screen w-screen bg-slate-50/60 overflow-hidden text-slate-800 font-sans">
      {/* Mobile Header */}
      <header id="mobile-header" className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b border-slate-800 shrink-0 z-40">
        <div id="mobile-brand-wrapper" className="flex items-center gap-3">
          <div id="mobile-logo-icon" className="p-1.5 bg-emerald-600 rounded-md text-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-200" />
          </div>
          <a href="https://zyncastcfo.com" target="_blank" rel="noopener noreferrer" id="mobile-brand-title" className="font-sans font-bold text-base tracking-tight leading-none text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            Zyncast<span className="text-emerald-400 font-extrabold">CFO</span>
            <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded">SUITE</span>
          </a>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          id="mobile-sidebar-backdrop"
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <div 
        id="sidebar-wrapper"
        className={`
          fixed inset-y-0 left-0 z-50 h-full max-h-full transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          isPrivacyMode={isPrivacyMode} 
          setIsPrivacyMode={setIsPrivacyMode} 
          userTier={userTier}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content body */}
      <main id="main-content-scroll" className="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 md:px-12">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              campaigns={campaigns}
              onToggleStatus={handleToggleStatus}
              setActiveTab={setActiveTab}
              isPrivacyMode={isPrivacyMode}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsView 
              campaigns={campaigns}
              onAddCampaign={handleAddCampaign}
              onToggleStatus={handleToggleStatus}
              onDeleteCampaign={handleDeleteCampaign}
              isPrivacyMode={isPrivacyMode}
            />
          )}

          {activeTab === 'creatives' && (
            <CreativesView />
          )}

          {activeTab === 'audiences' && (
            <AudiencesView />
          )}

          {activeTab === 'teleprompter' && (
            <TeleprompterView />
          )}

          {activeTab === 'budget-calculator' && (
            <BudgetCalculatorView />
          )}

          {activeTab === 'payroll' && (
            <PayrollView />
          )}

          {activeTab === 'ai-optimizer' && (
            <AIOptimizerView />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              campaigns={campaigns}
              isPrivacyMode={isPrivacyMode}
            />
          )}
        </div>
      </main>

      {/* Checkout modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        userTier={userTier}
        onUpdateTier={setUserTier}
      />

      {/* Auth Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(updatedUser) => setCurrentUser(updatedUser)}
        onLogout={() => {
          setCurrentUser({
            name: 'Guest User',
            email: '',
            companyName: 'ZynAds Account',
            tier: 'free',
            isLoggedIn: false
          });
        }}
      />
    </div>
  );
}
