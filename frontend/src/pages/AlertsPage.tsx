import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { mockAlerts, mockJobs } from '../data/mockData';
import { formatDistance } from 'date-fns';

export default function AlertsPage() {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-status-error" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-status-warning" />;
      default:
        return <Info className="w-5 h-5 text-accent-cyan" />;
    }
  };

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-[rgba(255,107,107,0.06)] border-status-error';
      case 'warning':
        return 'bg-[rgba(242,184,75,0.06)] border-status-warning';
      default:
        return 'bg-[rgba(255,184,107,0.06)] border-accent-cyan';
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Alerts & Monitoring
          </h1>
          <p className="text-text-secondary">
            Active alerts and system monitoring dashboard
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-bg-surface border border-[rgba(255,255,255,0.10)] rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-text-muted">CRITICAL</span>
              <AlertTriangle className="w-5 h-5 text-status-error" />
            </div>
            <div className="text-4xl font-display font-bold text-status-error">
              {mockAlerts.filter((a) => a.severity === 'critical').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-bg-surface border border-[rgba(255,255,255,0.10)] rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-text-muted">WARNINGS</span>
              <AlertCircle className="w-5 h-5 text-status-warning" />
            </div>
            <div className="text-4xl font-display font-bold text-status-warning">
              {mockAlerts.filter((a) => a.severity === 'warning').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-bg-surface border border-[rgba(255,255,255,0.10)] rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-text-muted">INFO</span>
              <Info className="w-5 h-5 text-accent-cyan" />
            </div>
            <div className="text-4xl font-display font-bold text-accent-cyan">
              {mockAlerts.filter((a) => a.severity === 'info').length}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-bg-surface border border-[rgba(255,255,255,0.10)] rounded-lg">
            <div className="p-6 border-b border-[rgba(255,255,255,0.10)]">
              <h2 className="text-lg font-display font-bold text-text-primary">
                Alert Feed
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              {mockAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border ${getAlertStyle(alert.severity)} ${
                    alert.acknowledged ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-primary mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-text-secondary mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="font-mono">{alert.resource}</span>
                        <span>•</span>
                        <span>
                          {formatDistance(new Date(alert.timestamp), new Date(), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary hover:bg-[rgba(255,184,107,0.10)] text-accent-cyan rounded text-xs font-medium transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Acknowledge
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface border border-[rgba(255,255,255,0.10)] rounded-lg">
            <div className="p-6 border-b border-[rgba(255,255,255,0.10)]">
              <h2 className="text-lg font-display font-bold text-text-primary">
                SLA Compliance
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockJobs.slice(0, 5).map((job, idx) => {
                  const slaTarget = 1800;
                  const compliance =
                    job.duration && job.duration < slaTarget ? 100 : 75;
                  const isCompliant = compliance === 100;

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-text-primary">
                          {job.name}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isCompliant ? 'text-status-success' : 'text-status-warning'
                          }`}
                        >
                          {compliance}%
                        </span>
                      </div>
                      <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${compliance}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isCompliant ? 'bg-status-success' : 'bg-status-warning'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-bg-primary rounded-lg">
                <div className="text-xs text-text-muted mb-2">OVERALL COMPLIANCE</div>
                <div className="text-2xl font-display font-bold text-status-success">
                  94.2%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
