import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean; // positive means upward trend
    type: 'cost' | 'neutral'; // cost is bad when positive, good when negative
  };
  icon: React.ReactNode;
  colorClass?: string;
  onClick?: () => void;
}

export default function StatCard({
  id,
  title,
  value,
  subtext,
  trend,
  icon,
  colorClass = 'border-slate-800',
  onClick,
}: StatCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-slate-900 p-4 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-orange-500/40 hover:shadow-orange-500/5' : ''
      } ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        <div className="p-1.5 rounded bg-slate-800 text-orange-400 border border-slate-700/50">
          {icon}
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-xl font-bold font-display text-white tracking-tight">
          {value}
        </span>
        
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              trend.type === 'cost'
                ? trend.isPositive
                  ? 'bg-rose-500/10 text-rose-400' // cost up is bad
                  : 'bg-emerald-500/10 text-emerald-400' // cost down is good
                : trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400' // general up is good
                : 'bg-rose-500/10 text-rose-400' // general down is bad
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-[10px] font-mono text-slate-500 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}
