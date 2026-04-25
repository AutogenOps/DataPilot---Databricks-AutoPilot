import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import DataPilotMark from './DataPilotMark';

interface TopNavProps {
  workspace: string;
  isConnected: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function TopNav({
  workspace,
  isConnected,
  isSidebarCollapsed,
  onToggleSidebar,
}: TopNavProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase isn't configured, don't attempt auth calls; keep UI stable for demos.
    if (!isSupabaseConfigured) {
      setAuthUser(null);
      setIsAuthLoading(false);
      return;
    }

    let active = true;

    const bootstrap = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;

      setAuthUser(sessionData.session?.user ?? null);
      setIsAuthLoading(false);

      // Refresh from API (in case metadata changed).
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;
      if (userData.user) setAuthUser(userData.user);
    };

    bootstrap();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
      if (!session?.user) setShowUserMenu(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const userEmail = authUser?.email ?? '';
  const userName = useMemo(() => {
    const metaName = authUser?.user_metadata?.name;
    if (typeof metaName === 'string' && metaName.trim()) return metaName.trim();
    if (userEmail) return userEmail.split('@')[0];
    return '';
  }, [authUser, userEmail]);

  const userInitials = useMemo(() => {
    const base = (userName || userEmail || '').trim();
    if (!base) return '??';
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return base.slice(0, 2).toUpperCase();
  }, [userEmail, userName]);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <nav className="h-16 bg-bg-surface border-b border-[rgba(0,180,216,0.15)] flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 hover:bg-bg-primary rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-text-secondary" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        <motion.div
          className="flex items-center gap-2 scan-line"
          whileHover={{ scale: 1.02 }}
        >
          <DataPilotMark className="h-6 w-6 rounded-md" />
          <h1 className="text-xl font-display font-bold text-gradient-cyan">
            DataPilot
          </h1>
        </motion.div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary rounded-md border border-[rgba(0,180,216,0.15)] cursor-pointer hover:border-accent-cyan transition-colors">
          <span className="font-mono text-sm text-text-secondary">{workspace}</span>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex items-center px-3 py-1.5"
          title={isConnected ? 'API Connected' : 'API Offline'}
          aria-label={isConnected ? 'API Connected' : 'API Offline'}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-status-success' : 'bg-status-error'
            }`}
            animate={{
              boxShadow: isConnected
                ? ['0 0 0 0 rgba(16,245,160,0.7)', '0 0 0 8px rgba(16,245,160,0)']
                : ['0 0 0 0 rgba(239,68,68,0.7)', '0 0 0 8px rgba(239,68,68,0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <motion.button
          className="relative p-2 hover:bg-bg-primary rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full" />
        </motion.button>

        <div className="relative">
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary rounded-lg border border-[rgba(0,180,216,0.15)] cursor-pointer hover:border-accent-cyan transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-azure flex items-center justify-center text-xs font-bold">
              {userInitials}
            </div>
            <span className="text-sm text-text-primary">
              {isAuthLoading ? 'Loading…' : userName || 'Account'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showUserMenu ? 'rotate-180' : ''
              }`}
            />
          </motion.button>

          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-bg-surface border border-[rgba(0,180,216,0.15)] rounded-lg shadow-xl overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-[rgba(0,180,216,0.15)]">
                <p className="text-sm text-text-primary font-medium">
                  {isAuthLoading ? 'Loading…' : userName || 'Not signed in'}
                </p>
                <p className="text-xs text-text-muted">
                  {isAuthLoading ? '' : userEmail}
                </p>
              </div>
              {authUser && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-secondary hover:text-status-error hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
