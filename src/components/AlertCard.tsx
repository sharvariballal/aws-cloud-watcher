import React from 'react';
import { AWSAlert } from '../services/alertService';
import { AlertTriangle, Bell, CheckCircle, Trash2, ShieldAlert, RefreshCw, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface AlertCardProps {
  key?: React.Key;
  alert: AWSAlert;
  onAcknowledge?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AlertCard({ alert, onAcknowledge, onDelete }: AlertCardProps) {
  const isCritical = alert.severity === 'CRITICAL';
  const isWarning = alert.severity === 'WARNING';
  const isResolved = alert.severity === 'RESOLVED';

  // Card classes
  const severityStyles = isCritical
    ? 'border-red-500/30 bg-red-950/10 hover:border-red-500/40'
    : isWarning
    ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/40'
    : 'border-emerald-500/20 bg-slate-900/60 opacity-70';

  // Status badges
  const badgeStyles = isCritical
    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
    : isWarning
    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';

  // Icons
  const severityIcon = isCritical ? (
    <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
  ) : isWarning ? (
    <AlertTriangle className="h-4 w-4 text-amber-500" />
  ) : (
    <CheckCircle className="h-4 w-4 text-emerald-500" />
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.15 }}
      className={`relative overflow-hidden rounded-lg border p-4 shadow-sm backdrop-blur-sm transition-all duration-200 ${severityStyles}`}
    >
      {/* Dynamic left accent color strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Metric Description & Header */}
        <div className="flex gap-3">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800 self-start">
            {severityIcon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">{alert.service}</span>
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-medium ${badgeStyles}`}>
                {alert.severity}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-200 mt-1 font-display">
              {alert.metricName}
            </h4>

            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {alert.message}
            </p>

            {/* Threshold & Operational Stats */}
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] text-slate-500">
              <div>
                <span className="text-slate-400">Trigger Threshold:</span> {alert.thresholdValue}
              </div>
              <div>
                <span className="text-slate-400">Measured Value:</span>{' '}
                <span className={isResolved ? 'text-emerald-400' : isCritical ? 'text-red-400' : 'text-amber-400'}>
                  {alert.currentValue}
                </span>
              </div>
              <div>
                <span className="text-slate-400">AWS ID:</span> {alert.id}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2 self-end sm:self-start justify-end w-full sm:w-auto">
          {onAcknowledge && !alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 hover:border-slate-600 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:text-white transition duration-150"
              title="Acknowledge Receipt"
            >
              <Eye className="h-3 w-3" />
              <span>Acknowledge</span>
            </button>
          )}

          {alert.acknowledged && (
            <span className="text-[9px] font-mono text-emerald-500 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">
              Acknowledged
            </span>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(alert.id)}
              className="p-1.5 rounded bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition duration-150"
              title="Dismiss alert"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Integration Tip Footer (Visible on Hover in full app) */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-600">
        <span>Channel: AWS EventBridge ➔ Lambda ➔ SNS Topic</span>
        <span>Alarm Status: {alert.status}</span>
      </div>
    </motion.div>
  );
}
