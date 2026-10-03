import { X, Check, Zap, Shield, Loader2, Sparkles, TrendingUp, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: 'free' | 'pro';
  onUpdateTier: (tier: 'free' | 'pro') => void;
}

export default function CheckoutModal({ isOpen, onClose, userTier, onUpdateTier }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [annualBilling, setAnnualBilling] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setStep('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setLoading(true);
    setStep('Connecting securely...');
    setTimeout(() => {
      setStep('Processing simulated transaction...');
      setTimeout(() => {
        setStep('Verifying premium tokens...');
        setTimeout(() => {
          onUpdateTier('pro');
          setLoading(false);
          setStep('');
        }, 800);
      }, 1000);
    }, 800);
  };

  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to downgrade? Your premium features will be locked immediately (Demo mode).")) {
      onUpdateTier('free');
      onClose();
    }
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div id="checkout-modal-box" className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div id="checkout-loading-screen" className="flex flex-col items-center justify-center p-12 text-center space-y-6 flex-1 py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <Zap className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-sans font-bold text-slate-900">Activating CFO Pro</h3>
              <p className="text-xs font-mono text-slate-500 max-w-xs mx-auto animate-pulse">{step}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-sans italic">This is a fully simulated developer-mode checkout flow.</p>
          </div>
        ) : (
          <>
            {/* Header / Brand */}
            <div id="checkout-header" className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono tracking-wider shadow-sm flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-current" /> DEMO SUBSCRIBER
                </span>
              </div>
              <h2 className="text-2xl font-sans font-black tracking-tight text-white flex items-center gap-2">
                Unlock Zyncast CFO <span className="text-blue-400">PRO</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Empower your business with strategic forecasting, unlimited AI advisor playbooks, and state-of-the-art tax forecasting.
              </p>
            </div>

            {/* Main content */}
            <div id="checkout-body" className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Plan Switcher Toggle */}
              {userTier === 'free' && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Billing Period</span>
                    <span className="text-[10px] text-slate-400 font-sans block">Save 30% with yearly subscription</span>
                  </div>
                  <div className="flex bg-slate-200/60 p-1 rounded-lg">
                    <button
                      onClick={() => setAnnualBilling(false)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        !annualBilling ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setAnnualBilling(true)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        annualBilling ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Yearly (Save 30%)
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing Display */}
              <div className="text-center py-2">
                {userTier === 'pro' ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest font-mono block">YOUR CURRENT STATUS</span>
                    <h3 className="text-3xl font-sans font-black text-emerald-800 mt-1">PRO Plan Active</h3>
                    <p className="text-xs text-emerald-600 font-sans mt-1">You have fully unlocked all advanced features of Zyncast CFO.</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-5xl font-sans font-black text-slate-900 tracking-tight">
                        {annualBilling ? '$27' : '$39'}
                      </span>
                      <div className="text-left">
                        <span className="text-sm font-sans font-bold text-slate-800 block">/month</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tight block">
                          {annualBilling ? 'billed annually ($324)' : 'billed monthly'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pro Benefits List */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Included in Pro Suite</span>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md mt-0.5">
                      <Sparkles className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Advanced AI CFO Playbooks</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Unlock strategic prompts for overspending audits, cash flow projections, and quarterly tax allocations.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md mt-0.5">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Interactive 6-Month Projections</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Simulate different sales cycles, expense growth, and client contractor splits with custom dynamic sliders.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md mt-0.5">
                      <Calculator className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Advanced Federal & Self-Employment Estimator</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Evaluate tax liabilities against different filing brackets, deductions schemes, and post-tax payouts.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div id="checkout-footer" className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              {userTier === 'pro' ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold uppercase tracking-wider font-mono py-3 px-4 rounded-lg shadow-xs transition-all text-center cursor-pointer"
                  >
                    Keep Pro Features
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 font-sans text-xs font-bold uppercase tracking-wider font-mono py-3 px-4 rounded-lg transition-all text-center cursor-pointer"
                  >
                    Downgrade
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans text-xs font-bold uppercase tracking-wider font-mono py-3.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Start Free PRO Trial (Demo Subscribe)</span>
                </button>
              )}
              
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-sans">
                <Shield className="w-3 h-3 text-slate-400" />
                <span>100% Risk-Free Developer Simulation • Toggle anytime</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
