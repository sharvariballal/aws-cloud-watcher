import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ServiceCostItem } from '../services/billingService';

interface ServicePieChartProps {
  data: ServiceCostItem[];
}

export default function ServicePieChart({ data }: ServicePieChartProps) {
  const totalSpend = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percent = ((item.value / totalSpend) * 100).toFixed(1);
      return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white mb-1 uppercase tracking-wider">{item.name}</p>
          <div className="space-y-1 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Cost Share:</span>
              <span className="font-bold text-white">${item.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Proportion:</span>
              <span className="font-bold text-orange-400">{percent}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom render legend for detailed service percentage breakdown
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col gap-2 mt-2 max-h-52 overflow-y-auto pr-1">
        {payload.map((entry: any, index: number) => {
          const item = entry.payload;
          const pct = ((item.value / totalSpend) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-400 truncate max-w-[140px]" title={item.name}>
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="text-white font-semibold flex-shrink-0">
                ${item.value} <span className="text-slate-500 font-normal">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-tight font-display"> AWS Service Cost Distribution</h3>
        <p className="text-[10px] text-slate-500 font-mono">
          Active Service Share
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 items-center my-7">
        {/* Pie Wheel */}
        <div className="h-40 w-full flex items-center justify-center relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Total
            </span>
            <span className="text-xl font-bold font-display text-white">
              ${totalSpend.toLocaleString()}
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed custom legends */}
        <div>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart style={{ display: 'none' }}>
              <Legend content={renderLegend} verticalAlign="middle" layout="vertical" />
              <Pie data={data} dataKey="value" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/50 text-[10px] font-mono text-slate-500">
        Aggregate of top 6 active AWS services.
      </div>
    </div>
  );
}
