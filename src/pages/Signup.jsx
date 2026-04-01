import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
  { label: 'Contains a number', test: (p) => /[0-9]/.test(p) },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ company: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = signup(form.company, form.email, form.password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const passReqs = passwordRequirements.map((r) => ({ ...r, met: r.test(form.password) }));
  const showPassReqs = touched || form.password.length > 0;

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">DiligenceAI</span>
        </Link>

        {/* Card */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <h1 className="text-white font-bold text-2xl mb-1 tracking-tight">Create your workspace</h1>
          <p className="text-slate-400 text-sm mb-7">Start your first due diligence review</p>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="company">
                Company / Firm name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Ventures"
                className="w-full bg-[#0F172A] border border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="email">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@firm.com"
                className="w-full bg-[#0F172A] border border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full bg-[#0F172A] border border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 pr-11 text-slate-100 placeholder-slate-600 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {showPassReqs && (
                <ul className="mt-2.5 space-y-1.5">
                  {passReqs.map((r) => (
                    <li key={r.label} className="flex items-center gap-2">
                      <CheckCircle
                        size={13}
                        className={r.met ? 'text-green-400' : 'text-slate-600'}
                      />
                      <span className={`text-xs ${r.met ? 'text-green-400' : 'text-slate-500'}`}>
                        {r.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-[#0F172A]/60 border border-slate-700/50 rounded-xl px-4 py-3">
              <p className="text-slate-500 text-xs leading-relaxed">
                By creating an account, you agree to our{' '}
                <button type="button" className="text-blue-400 hover:text-blue-300">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-blue-400 hover:text-blue-300">Privacy Policy</button>.
                Your documents are stored securely and never used to train AI models.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating workspace…
                </>
              ) : (
                'Create workspace'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-slate-700 text-xs mt-6">
          Protected by end-to-end encryption · SOC 2 compliant
        </p>
      </div>
    </div>
  );
}
