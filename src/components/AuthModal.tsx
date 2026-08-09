import { useState, FormEvent } from 'react';
import { User, Lock, Mail, Building2, CheckCircle2, LogOut, ShieldCheck, Sparkles, X } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  tier: 'free' | 'pro';
  isLoggedIn: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Standard local authentication / user session simulation
    const updatedUser: UserProfile = {
      name: name || email.split('@')[0],
      email: email,
      companyName: companyName || 'My Business',
      tier: currentUser.tier,
      isLoggedIn: true
    };

    onLogin(updatedUser);
    setError('');
    onClose();
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div id="auth-modal-card" className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser.isLoggedIn ? (
          /* User Profile View when Logged In */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center font-bold text-xl font-mono shadow-inner">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 font-mono">{currentUser.email}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                <Building2 className="w-3 h-3" /> {currentUser.companyName}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">ACCOUNT TIER:</span>
                <span className="font-bold text-blue-600 uppercase font-mono">{currentUser.tier} MEMBER</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">SYNC STATUS:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Workspace Saved
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer font-mono"
            >
              <LogOut className="w-4 h-4" /> Sign Out of Zyncast Account
            </button>
          </div>
        ) : (
          /* Sign In / Create Account Form */
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold font-mono">
                <ShieldCheck className="w-4 h-4" /> SECURE USER PORTAL
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                {mode === 'signin' ? 'Sign In to Zyncast CFO' : 'Create Business Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signin'
                  ? 'Access your saved financial ledgers, tax reports, and AI projections.'
                  : 'Start keeping track of your business transactions across sessions.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Company / Organization</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Zyncast Media LLC"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="cfo@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer font-mono mt-2"
              >
                {mode === 'signin' ? 'Sign In to Account' : 'Register Account'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                }}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                {mode === 'signin' ? 'Create one now' : 'Sign in instead'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
