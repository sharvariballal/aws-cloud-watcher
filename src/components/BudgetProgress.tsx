import React, { useState } from 'react';
import { DollarSign, Percent, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface BudgetProgressProps {
  id: string;
  limit: number;
  spent: number;
  forecast: number;
  currency: string;
  onUpdateBudget?: (newLimit: number) => void;
}

export default function BudgetProgress({
  id,
  limit,
  spent,
  forecast,
  currency = 'USD',
  onUpdateBudget,
}: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputLimit, setInputLimit] = useState(limit.toString());
  const [isSaving, setIsSaving] = useState(false);

  const spentPercentage = Math.round((spent / limit) * 100);
  const forecastPercentage = Math.round((forecast / limit) * 100);

  // Status color selector
  let progressColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';
  let alertMessage = 'Budget is healthy and well-allocated.';
  let icon = <CheckCircle className="h-5 w-5 text-emerald-400" />;

  if (spentPercentage >= 90 || forecastPercentage >= 100) {
    progressColor = 'bg-rose-500';
    textColor = 'text-rose-400';
    alertMessage = 'Action required: Budget has been exhausted or forecasted to overflow.';
    icon = <AlertTriangle className="h-5 w-5 text-rose-400 animate-bounce" />;
  } else if (spentPercentage >= 75 || forecastPercentage >= 85) {
    progressColor = 'bg-amber-500';
    textColor = 'text-amber-400';
    alertMessage = 'Warning: Spending is close to the warning threshold.';
    icon = <AlertTriangle className="h-5 w-5 text-amber-400" />;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateBudget) return;

    const val = parseFloat(inputLimit);
    if (!isNaN(val) && val > 0) {
      setIsSaving(true);
      await onUpdateBudget(val);
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div id={id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      {/* Title & Edit Actions */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight font-display">AWS Budget Alerts</h3>
          <p className="text-[10px] text-slate-500 font-mono">
            {/* AWS Budgets API notes */}
            Ref: AWS Budgets API (GetBudget)
          </p>
        </div>

        {onUpdateBudget && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSave} className="flex items-center gap-2">
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <input
                    type="number"
                    value={inputLimit}
                    onChange={(e) => setInputLimit(e.target.value)}
                    className="w-20 rounded bg-slate-800 border border-slate-700 py-1 pl-6 pr-2 text-[11px] text-white focus:border-orange-500 focus:outline-none font-mono"
                    placeholder="Limit"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded bg-orange-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-orange-600 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setInputLimit(limit.toString());
                  }}
                  className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                Set Budget Limit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid comparing Spent vs Forecast vs Limit */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/40">
          <span className="text-xs text-slate-400 block font-sans">Current Actual Spent</span>
          <span className="text-lg font-bold font-mono text-white block mt-1">
            ${spent.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">
            {spentPercentage}% of limit
          </span>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/40">
          <span className="text-xs text-slate-400 block font-sans">Forecasted Spend</span>
          <span className="text-lg font-bold font-mono text-orange-400 block mt-1">
            ${forecast.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">
            {forecastPercentage}% of limit
          </span>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/40">
          <span className="text-xs text-slate-400 block font-sans">Budget Limit Threshold</span>
          <span className="text-lg font-bold font-mono text-slate-300 block mt-1">
            ${limit.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">
            100% cap value
          </span>
        </div>
      </div>

      {/* Graphic Progress Bars */}
      <div className="space-y-4">
        {/* Actual Spend Progress */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
            <span>Actual Spend Gauge</span>
            <span className={textColor}>{spentPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${progressColor}`}
            />
          </div>
        </div>

        {/* Forecasted Spend Progress */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
            <span>Forecast Spend Gauge</span>
            <span className="text-orange-400">{forecastPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
            {/* Split marker for budget limit (100% line) */}
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-rose-600/60 z-10" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(forecastPercentage, 100)}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Advisory Message Box */}
      <div className="mt-6 flex items-start gap-3 bg-slate-950/60 rounded-xl p-4 border border-slate-800">
        <div className="mt-0.5">{icon}</div>
        <div>
          <h4 className="text-xs font-semibold text-white">Advisory Alert Policy</h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{alertMessage}</p>
          <p className="text-[10px] text-slate-500 mt-1 font-mono italic">
            * Triggered when forecasted or actual costs exceed your set alert limits.
          </p>
        </div>
      </div>
    </div>
  );
}
