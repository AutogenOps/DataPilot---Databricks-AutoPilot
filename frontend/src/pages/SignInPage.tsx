import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DataPilotMark from '../components/DataPilotMark';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleResendConfirmation = async () => {
    setError('');
    setInfo('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setInfo('Verification email sent. Please check your inbox/spam and confirm your email.');
    } catch {
      setError('Failed to resend verification email.');
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-azure/10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(0, 180, 216, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-bg-surface/30 border border-[rgba(0,180,216,0.2)] rounded-2xl p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <DataPilotMark className="h-8 w-8" />
              <h1 className="text-3xl font-display font-bold text-gradient-cyan">
                DataPilot
              </h1>
            </div>
            <p className="text-text-secondary text-sm">
              AI Orchestration for Azure + Databricks
            </p>
          </motion.div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <label className="block text-xs font-mono text-text-muted mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-[rgba(0,180,216,0.2)] rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <label className="block text-xs font-mono text-text-muted mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-bg-primary border border-[rgba(0,180,216,0.2)] rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-accent-cyan transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {info && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[rgba(16,245,160,0.08)] border border-status-success rounded-lg"
              >
                <p className="text-xs font-mono text-status-success">{info}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[rgba(239,68,68,0.1)] border border-status-error rounded-lg"
              >
                <p className="text-xs font-mono text-status-error">{error}</p>

                {error.toLowerCase().includes('email not confirmed') && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="mt-2 text-xs font-mono text-accent-cyan hover:text-accent-azure transition-colors"
                  >
                    Resend verification email
                  </button>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-xs"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-bg-primary border border-[rgba(0,180,216,0.2)] rounded checked:bg-accent-cyan cursor-pointer"
                />
                <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-accent-cyan hover:text-accent-azure transition-colors"
              >
                Forgot password?
              </a>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-azure hover:from-accent-azure hover:to-accent-cyan text-bg-primary font-display font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-transparent border-t-bg-primary rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 my-6"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(0,180,216,0.3)] to-transparent" />
            <span className="text-xs text-text-muted font-mono">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(0,180,216,0.3)] to-transparent" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEmail('demo@datapilot.com');
              setPassword('demo123456');
            }}
            className="w-full px-4 py-2 bg-bg-primary border border-[rgba(0,180,216,0.2)] hover:border-accent-cyan text-text-secondary hover:text-accent-cyan rounded-lg text-sm font-medium transition-all"
          >
            Use Demo Credentials
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-accent-cyan hover:text-accent-azure font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-text-muted">
            Unified AI Orchestration Platform for Azure & Databricks
          </p>
        </motion.div>
      </div>
    </div>
  );
}
