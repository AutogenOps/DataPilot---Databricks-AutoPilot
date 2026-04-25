import {
  MessageSquare,
  Briefcase,
  GitBranch,
  Server,
  Database,
  AlertTriangle,
  FileText,
  Settings,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SidebarProps {
  collapsed?: boolean;
  isDatabricksConnected: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
  { id: 'pipelines', label: 'DLT', icon: GitBranch, path: '/pipelines' },
  { id: 'clusters', label: 'Clusters', icon: Server, path: '/clusters' },
  { id: 'dbt', label: 'dbt', icon: Database, path: '/dbt' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts' },
];

const secondaryItems: NavItem[] = [
  { id: 'logs', label: 'Logs', icon: FileText, path: '/logs', section: 'SYSTEM' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'SYSTEM' },
];

export default function Sidebar({
  collapsed = false,
  isDatabricksConnected,
}: SidebarProps) {
  const location = useLocation();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link to={item.path} aria-label={collapsed ? item.label : undefined}>
        <motion.div
          className={clsx(
            'flex items-center py-2.5 rounded-lg cursor-pointer transition-all',
            collapsed ? 'justify-center px-3' : 'gap-3 px-4',
            isActive
              ? 'bg-[rgba(0,212,255,0.1)] border-l-2 border-accent-cyan text-accent-cyan'
              : clsx(
                  'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
                  !collapsed && 'hover:translate-x-1'
                )
          )}
          whileHover={{ x: isActive || collapsed ? 0 : 4 }}
          transition={{ duration: 0.15 }}
        >
          <Icon className={clsx('w-5 h-5', isActive && 'text-accent-cyan')} />
          <span
            aria-hidden={collapsed}
            className={clsx(
              'text-sm font-medium whitespace-nowrap transition-[opacity,max-width] duration-200 ease-in-out',
              collapsed
                ? 'opacity-0 max-w-0 overflow-hidden'
                : 'opacity-100 max-w-[12rem]'
            )}
          >
            {item.label}
          </span>
        </motion.div>
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        'bg-bg-surface border-r border-[rgba(0,180,216,0.15)] flex flex-col h-full overflow-hidden',
        collapsed ? 'w-16' : 'w-[260px]',
        'transition-[width] duration-200 ease-in-out'
      )}
    >
      <div
        className={clsx(
          'flex-1 py-6 space-y-1 overflow-y-auto scrollbar-thin',
          collapsed ? 'px-2' : 'px-4'
        )}
      >
        <div className="mb-6">
          {navItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>

        <div className="pt-6 border-t border-[rgba(0,180,216,0.1)]">
          {!collapsed && (
            <div className="px-4 mb-3">
              <span className="text-xs font-display text-text-muted tracking-wider">
                SYSTEM
              </span>
            </div>
          )}
          {secondaryItems.map((item) => (
            <NavLink key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[rgba(0,180,216,0.1)]">
        <div
          className={clsx(
            'flex items-center px-3 py-2 bg-bg-primary rounded-lg',
            collapsed ? 'justify-center' : 'gap-2'
          )}
        >
          <motion.div
            className={clsx(
              'w-2 h-2 rounded-full',
              isDatabricksConnected ? 'bg-status-success' : 'bg-status-error'
            )}
            animate={{
              boxShadow: isDatabricksConnected
                ? ['0 0 0 0 rgba(16,245,160,0.7)', '0 0 0 6px rgba(16,245,160,0)']
                : ['0 0 0 0 rgba(239,68,68,0.7)', '0 0 0 6px rgba(239,68,68,0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div
            className={clsx(
              'transition-[opacity,max-width] duration-200 ease-in-out',
              collapsed
                ? 'opacity-0 max-w-0 overflow-hidden'
                : 'opacity-100 max-w-[14rem]'
            )}
          >
            <div className="text-xs font-mono text-text-primary">
              {isDatabricksConnected ? 'Databricks Connected' : 'Databricks Offline'}
            </div>
            <div className="text-xs text-text-muted">/api/databricks/ping</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
