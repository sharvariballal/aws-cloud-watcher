import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ExpenseChart from '../components/ExpenseChart';
import ServicePieChart from '../components/ServicePieChart';
import BudgetProgress from '../components/BudgetProgress';
import Loader from '../components/Loader';
import { billingService, MonthlyCostData, ServiceCostItem, BudgetConfig } from '../services/billingService';
import { alertService, AWSAlert } from '../services/alertService';
import { DollarSign, Layers, Bell, Percent, Sparkles, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<MonthlyCostData[]>([]);
  const [serviceData, setServiceData] = useState<ServiceCostItem[]>([]);
  const [budget, setBudget] = useState<BudgetConfig | null>(null);
  const [alerts, setAlerts] = useState<AWSAlert[]>([]);
  const [simulationActive, setSimulationActive] = useState(false);

  // Load all initial metrics
  const loadMetrics = async () => {
    try {
      const expenses = await billingService.getHistoricalExpenses();
      const distribution = await billingService.getServiceDistribution();
      const status = await billingService.getBudgetStatus();
      const alarms = await alertService.getAlerts();

      setHistoricalData(expenses);
      setServiceData(distribution);
      setBudget(status);
      setAlerts(alarms);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleUpdateBudget = async (newLimit: number) => {
    await billingService.updateBudgetLimit(newLimit);
    const updated = await billingService.getBudgetStatus();
    setBudget(updated);
  };

  // Perform a cost spike simulation to show live reactive dashboard responses
  const triggerCostSpike = async () => {
    setSimulationActive(true);
    
    // 1. Add +$300 to July EC2 spend in local memory for July row
    const updatedExpenses = historicalData.map((d) => {
      if (d.month === 'Jul') {
        const EC2New = d.EC2 + 300;
        const totalNew = d.total + 300;
        return { ...d, EC2: EC2New, total: totalNew };
      }
      return d;
    });

    // 2. Add +$300 to EC2 in service distribution data
    const updatedServiceData = serviceData.map((s) => {
      if (s.name === 'Amazon EC2') {
        return { ...s, value: s.value + 300 };
      }
      return s;
    });

    // 3. Trigger a Warning alert in the Alerts list
    const newAlert = await alertService.triggerTestAlert(
      'Amazon EC2',
      'EC2 billing_spike_detected',
      'CRITICAL'
    );

    // Update state to render immediately
    setHistoricalData(updatedExpenses);
    setServiceData(updatedServiceData);
    if (budget) {
      const newSpent = budget.spent + 300;
      const newForecast = budget.forecast + 320;
      setBudget({ ...budget, spent: newSpent, forecast: newForecast });
    }
    setAlerts([newAlert, ...alerts]);
    
    setTimeout(() => {
      setSimulationActive(false);
    }, 1000);
  };

  if (loading) {
    return <Loader message="Connecting with AWS Cost Explorer and CloudWatch instances..." />;
  }

  const unackAlarmsCount = alerts.filter((a) => !a.acknowledged).length;

  // Render Dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">AWS Watcher Dashboard</h2>
          <p className="text-[11px] text-slate-500 font-mono">
            Account ID: 1290-3490-5029 | Admin Console Panel
          </p>
        </div>

        {/* Simulator controller */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerCostSpike}
            disabled={simulationActive}
            className={`inline-flex items-center gap-1.5 rounded border border-red-500/25 bg-red-500/10 px-3.5 py-1.5 text-[11px] font-bold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition duration-200 ${
              simulationActive ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${simulationActive ? 'animate-bounce' : ''}`} />
            <span>{simulationActive ? 'Simulating Spike...' : 'Simulate Cost Spike'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-cost-july"
          title="July Cost Actual"
          value={`$${(budget?.spent || 0).toLocaleString()}`}
          subtext="Updated 4m ago"
          trend={{ value: '+9.1%', isPositive: true, type: 'cost' }}
          icon={<DollarSign className="h-4 w-4" />}
          colorClass="border-slate-800"
        />

        <StatCard
          id="stat-services"
          title="Active AWS Services"
          value={serviceData.length}
          subtext="EC2, RDS, S3, Lambda, CloudFront, DynamoDB"
          trend={{ value: 'Stable', isPositive: true, type: 'neutral' }}
          icon={<Layers className="h-4 w-4" />}
          colorClass="border-slate-800"
        />

        <StatCard
          id="stat-alarms"
          title="Active CW Alarms"
          value={unackAlarmsCount}
          subtext={`${alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length} Critical, ${alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged).length} Warning`}
          trend={unackAlarmsCount > 0 ? { value: `${unackAlarmsCount} Open`, isPositive: true, type: 'cost' } : undefined}
          icon={<Bell className="h-4 w-4" />}
          colorClass={unackAlarmsCount > 0 ? 'border-red-500/30 text-red-400' : 'border-slate-800'}
          onClick={() => onNavigate('alerts')}
        />

        <StatCard
          id="stat-forecast"
          title="Predicted Month End"
          value={`$${(budget?.forecast || 0).toLocaleString()}`}
          subtext={`Cap Limit: $${(budget?.limit || 0).toLocaleString()}`}
          trend={{ value: '8.4% growth', isPositive: true, type: 'cost' }}
          icon={<Percent className="h-4 w-4" />}
          colorClass="border-slate-800"
        />
      </div>

      {/* Main Charts & Progress segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart data={historicalData} />
        </div>

        <div>
          <ServicePieChart data={serviceData} />
        </div>
      </div>

      {/* Budgets & Optimization panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BudgetProgress component */}
        <div className="lg:col-span-2">
          {budget && (
            <BudgetProgress
              id="dash-budget"
              limit={budget.limit}
              spent={budget.spent}
              forecast={budget.forecast}
              currency={budget.currency}
              onUpdateBudget={handleUpdateBudget}
            />
          )}
        </div>

        {/* AWS recommendations sidebar card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                FinOps Advisors
              </h3>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3.5">
              Real-time heuristic audits matching AWS Trusted Advisor recommendations:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Scale down RDS (r5.xlarge)</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    RDS database average memory pressure &lt; 15% for 14 days. Save ~$120/mo.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 flex gap-2.5 items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Underutilized S3 cleanup</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                    Move bucket &ldquo;test-artifacts-921&rdquo; to S3 Glacier Deep Archive. Save ~$35/mo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/50 mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>AWS Cost Anomalies: None Detected</span>
            <span className="text-orange-400 hover:underline cursor-pointer font-bold" onClick={() => onNavigate('profile')}>
              Access Policy Setup
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
