import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircledIcon, EyeOpenIcon, EyeClosedIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setInfo('');
    try {
      if (mode === 'signin') {
        const { data, error: err } = await signIn(form.email, form.password);
        if (err) {
          setError(err.message);
        } else if (!data?.session?.user) {
          setError('Sign-in did not return a session. Check your email and password, or confirm your email if required.');
        }
      } else {
        const { data, error: err } = await signUp(form.email, form.password);
        if (err) {
          setError(err.message);
        } else if (data?.user && !data?.session) {
          setInfo('Check your inbox to confirm your email, then sign in.');
        } else if (!data?.session?.user) {
          setError('Sign-up did not complete. Try again or contact support.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'signin' ? 'Welcome back' : 'Create your account';
  const subtitle =
    mode === 'signin' ? 'Sign in to your workspace' : 'Start your first due diligence review';
  const submitLabel = mode === 'signin' ? 'Sign in' : 'Create account';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-accent rounded-sm flex items-center justify-center">
            <CheckCircledIcon width={18} height={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">DiligenceAI</span>
        </Link>

        <div className="bg-ink-50 border border-bone-15 rounded-sm p-8">
          <div className="flex rounded-sm bg-black p-1 mb-7">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
                setInfo('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                mode === 'signin'
                  ? 'bg-accent text-white'
                  : 'text-bone-40 hover:text-bone-70'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setInfo('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                mode === 'signup'
                  ? 'bg-accent text-white'
                  : 'text-bone-40 hover:text-bone-70'
              }`}
            >
              Sign up
            </button>
          </div>

          <h1 className="text-white font-bold text-2xl mb-1 tracking-tight">{title}</h1>
          <p className="text-bone-40 text-sm mb-7">{subtitle}</p>

          {error && (
            <div className="flex items-center gap-2.5 bg-accent/10 border border-accent/35 rounded-sm px-4 py-3 mb-5">
              <InfoCircledIcon width={15} height={15} className="text-accent flex-shrink-0" />
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          {info && (
            <div className="flex items-center gap-2.5 bg-accent/12 border border-accent/35 rounded-sm px-4 py-3 mb-5">
              <InfoCircledIcon width={15} height={15} className="text-accent flex-shrink-0" />
              <p className="text-white text-sm">{info}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-bone-70 text-sm font-medium mb-1.5" htmlFor="auth-email">
                Email address
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@firm.com"
                className="w-full bg-black border border-bone-15 focus:border-accent rounded-sm px-4 py-3 text-white placeholder-bone-25 text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-bone-70 text-sm font-medium mb-1.5" htmlFor="auth-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black border border-bone-15 focus:border-accent rounded-sm px-4 py-3 pr-11 text-white placeholder-bone-25 text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-bone-40 hover:text-bone-70 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeClosedIcon width={16} height={16} /> : <EyeOpenIcon width={16} height={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-accent/40 text-white font-semibold py-3 rounded-sm transition-colors text-sm mt-1 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                submitLabel
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-bone-40 text-sm mt-5">
          <Link to="/" className="text-accent hover:text-accent-hover font-medium transition-colors">
            ← Back to home
          </Link>
        </p>

        <p className="text-center text-bone-25 text-xs mt-6">
          Protected by end-to-end encryption · SOC 2 compliant
        </p>
      </div>
    </div>
  );
}
