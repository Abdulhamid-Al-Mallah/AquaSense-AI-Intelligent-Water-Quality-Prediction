import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(emailAddress, password);
      navigate('/');
    } catch (error) {
      const displayMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      setErrorMessage(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmailAddress('admin@aquasense.ai');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-screen flex bg-slate-900 font-sans">
      {/* Left Environmental Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-12 flex-col justify-between border-r border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              AquaSense <span className="text-sky-400">AI</span>
            </span>
          </div>

          <div className="mt-20 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>SENG491 Decision-Support Platform</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Predictive Water Safety & Intelligent Chemical Remediation.
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Evaluating 8 verified laboratory physical and chemical parameters with leakage-free gradient boosted machine learning and regulatory WHO standard engines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
          <div>
            <p className="text-2xl font-bold text-sky-400">97.5%</p>
            <p className="text-xs text-slate-400 mt-0.5">XGBoost Accuracy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">0.9738</p>
            <p className="text-xs text-slate-400 mt-0.5">Weighted F1 Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">&lt;50ms</p>
            <p className="text-xs text-slate-400 mt-0.5">Inference Latency</p>
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Dashboard</h2>
            <p className="text-sm text-slate-400 mt-1">Access certified lab telemetry and prediction models.</p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-6 p-3 bg-sky-950/40 border border-sky-800/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-sky-300">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Supervisor / Evaluator Demo</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium px-2.5 py-1 rounded-md transition-colors shadow-sm"
            >
              Fill Demo Credentials
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="analyst@aquasense.ai"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Need an account?{' '}
            <Link to="/register" className="text-sky-400 hover:underline font-semibold">
              Register Analyst Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
