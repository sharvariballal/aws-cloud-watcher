import React, { useState, useEffect } from 'react';
import AlertCard from '../components/AlertCard';
import Loader from '../components/Loader';
import { alertService, AWSAlert } from '../services/alertService';
import { ShieldAlert, BellOff, RefreshCw, PlusCircle, LayoutGrid, CheckCheck, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AWSAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger templates for quick interactive testing
  const [testService, setTestService] = useState('Amazon EC2');
  const [testMetric, setTestMetric] = useState('CPUUtilization > 85%');
  const [testSeverity, setTestSeverity] = useState<'CRITICAL' | 'WARNING'>('CRITICAL');

  const loadAlerts = async () => {
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAlerts();
    setIsRefreshing(false);
  };

  const handleAcknowledge = async (id: string) => {
    const updated = await alertService.acknowledgeAlert(id);
    setAlerts(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await alertService.deleteAlert(id);
    setAlerts(updated);
  };

  // Bulk acknowledge all alarms
  const handleAcknowledgeAll = async () => {
    const updated = alerts.map((a) => ({ ...a, acknowledged: true }));
    setAlerts(updated);
    await alertService.saveAlerts(updated);
  };

  // Trigger custom simulated alarm
  const handleTriggerMockAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert = await alertService.triggerTestAlert(testService, testMetric, testSeverity);
    setAlerts([newAlert, ...alerts]);
  };

  // Filtering criteria
  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === 'CRITICAL' && !alert.acknowledged;
    if (filter === 'warning') return alert.severity === 'WARNING' && !alert.acknowledged;
    if (filter === 'resolved') return alert.severity === 'RESOLVED' || alert.acknowledged;
    return true;
  });

  const countUnacknowledged = alerts.filter((a) => !a.acknowledged).length;

  if (loading) {
    return <Loader message="Retrieving CloudWatch alarm configurations..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">AWS CloudWatch Alarms</h2>
          <p className="text-[11px] text-slate-500 font-mono">
            Linked to AWS SNS (Simple Notification Service) | {countUnacknowledged} unacknowledged
          </p>
        </div>

        <div className="flex items-center gap-2">
          {countUnacknowledged > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white px-2.5 py-1 text-[10px] font-bold text-slate-300 rounded transition"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Acknowledge All</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 transition"
            title="Reload alerts"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Alert Controller (Filters & Simulator Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side Filter & Alert List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Filters */}
          <div className="flex bg-slate-950 p-1 rounded border border-slate-800 self-start max-w-sm">
            {(['all', 'critical', 'warning', 'resolved'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 py-1 px-2.5 rounded text-[10px] font-bold tracking-wider uppercase transition ${
                  filter === t ? 'bg-slate-800 text-orange-400 border border-slate-700/50 shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Alarm Cards List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-slate-800 p-12 text-center"
                >
                  <BellOff className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-sm font-bold text-slate-300">No matching alarms found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-mono">
                    Everything is healthy! If this is unexpected, you can trigger simulated warnings using the control form on the right.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
