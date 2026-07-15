import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { MonthlyCostData } from '../services/billingService';
import { BarChart3, LineChart as LineIcon, AreaChart as AreaIcon, HelpCircle } from 'lucide-react';

interface ExpenseChartProps {
  data: MonthlyCostData[];
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const [chartType, setChartType] = useState<'stacked' | 'line' | 'area'>('stacked');

  // Custom tooltips styling for dark mode/console theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold font-display text-white mb-2 uppercase tracking-wider">{label} - Billing Metrics</p>
          <div className="space-y-1.5 font-mono text-[11px]">
            {payload.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-bold text-white">${item.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-1.5 mt-1.5 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Aggregate Total:</span>
              <span>
                ${payload.reduce((acc: number, item: any) => acc + (item.name !== 'total' ? item.value : 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight font-display">Month-Over-Month Cost breakdown</h3>
          <p className="text-[10px] text-slate-500 font-mono">
            Source: AWS Cost Explorer API (GetCostAndUsage)
          </p>
        </div>

        {/* Toggle Chart Type buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded border border-slate-800 self-start">
          <button
            onClick={() => setChartType('stacked')}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 ${
              chartType === 'stacked' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Stacked Bar Chart"
          >
            <BarChart3 className="h-3 w-3" />
            <span>Stacked</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 ${
              chartType === 'line' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Line Trend Chart"
          >
            <LineIcon className="h-3 w-3" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 ${
              chartType === 'area' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Area Chart"
          >
            <AreaIcon className="h-3 w-3" />
            <span>Area</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'stacked' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="$" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.15 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
              <Bar dataKey="EC2" name="Elastic Compute (EC2)" stackId="a" fill="#FF9900" />
              <Bar dataKey="RDS" name="Relational Database (RDS)" stackId="a" fill="#0073BB" />
              <Bar dataKey="S3" name="Simple Storage (S3)" stackId="a" fill="#4CAF50" />
              <Bar dataKey="Lambda" name="AWS Lambda" stackId="a" fill="#E91E63" />
              <Bar dataKey="CloudFront" name="CloudFront CDN" stackId="a" fill="#9C27B0" />
              <Bar dataKey="DynamoDB" name="DynamoDB NoSQL" stackId="a" fill="#00BCD4" />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="$" />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
              <Line type="monotone" dataKey="EC2" name="EC2" stroke="#FF9900" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="RDS" name="RDS" stroke="#0073BB" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="S3" name="S3" stroke="#4CAF50" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="total" name="Aggregate Total" stroke="#ffffff" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEC2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9900" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF9900" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRDS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0073BB" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0073BB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit="$" />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
              <Area type="monotone" dataKey="EC2" name="EC2 Costs" stroke="#FF9900" fillOpacity={1} fill="url(#colorEC2)" />
              <Area type="monotone" dataKey="RDS" name="RDS Costs" stroke="#0073BB" fillOpacity={1} fill="url(#colorRDS)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-3 w-3 text-slate-400" />
          Tip: Filter the AWS Region preset in Profile options to update Cost Explorer scopes.
        </span>
        <span>Granularity: Monthly (Consolidated)</span>
      </div>
    </div>
  );
}
