import { Cloud, ArrowRight, ShieldCheck, TrendingDown, BellRing, Settings2, Code, Terminal } from 'lucide-react';
import { motion, Variants } from "framer-motion";
import { useAuth } from '../context/AuthContext';


interface LandingProps {
  onNavigate: (page: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const { user } = useAuth();

  const features = [
  {
    title: "Real-Time Cost Monitoring",
    desc: "Monitor your AWS service-wise expenses using AWS Cost Explorer and view your cloud spending in one centralized dashboard.",
    icon: <TrendingDown className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Budget Alerts",
    desc: "Set a monthly spending limit and receive instant SMS or email notifications through Amazon SNS when your budget threshold is reached.",
    icon: <BellRing className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Secure User Authentication",
    desc: "Sign in securely with Amazon Cognito to protect your account and access your personalized expense dashboard.",
    icon: <ShieldCheck className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Expense Analytics Dashboard",
    desc: "Visualize monthly spending trends, service-wise costs, and budget usage through interactive charts and reports.",
    icon: <Settings2 className="h-6 w-6 text-orange-400" />,
  },
];
  const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

  const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
      {/* Decorative ambient background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-slate-950 to-slate-950 pointer-events-none z-0" />
      
      {/* Landing Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/10">
            <Cloud className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-white font-display">AWS Cloud Watcher</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-4 py-2 rounded-lg transition"
            >
              Back to Console
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition shadow-md shadow-orange-600/10"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 text-xs font-semibold text-slate-300 mb-8 font-mono shadow-inner"
        >
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Production-Ready AWS API Schemas Modeled
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white max-w-4xl leading-[1.1]"
        >
          Continuous Cloud Monitoring & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
            AWS Expense Tracker
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-400 max-w-2xl mt-6 leading-relaxed"
        >
          A single-view cloud operations tower to track monthly budgets, service allocation models, CloudWatch alert thresholds, and security compliance matrices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-xs sm:max-w-none"
        >
          <button
            onClick={() => {
              if (user) {
                onNavigate('dashboard');
              } else {
                onNavigate('login');
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-600/35 hover:-translate-y-0.5 transition duration-200"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={async () => {
              // Create mock bypass session
              localStorage.setItem('aws_watcher_user', JSON.stringify({
                id: 'usr-demo',
                email: 'demo-user@aws.org',
                name: 'USER123',
                company: 'AWS Workspace',
                role: 'FinOps Architect',
              }));
              // reload profile setup with simulated config keys so demo is fully ready
              localStorage.setItem('aws_watcher_profile_config', JSON.stringify({
                awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
                awsRegion: 'us-east-1',
                slackWebhookUrl: '',
                emailNotifications: true,
                smsAlerts: false,
                mfaStatus: true,
                billingThresholdAlert: 1500,
              }));
              window.location.reload();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition duration-200"
          >
            <span>Login</span>
          </button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-900/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-bold font-display text-white">Real-Time AWS Cost Monitoring</h3>
          <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-widest">
              Powered by AWS Cloud Services
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex gap-4 hover:border-orange-500/20 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200 font-display group-hover:text-orange-400 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-10 px-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 AWS Cloud Watcher - Modeled for quick deployment configurations.</p>
        <p className="mt-1">All rights reserved. Not affiliated with Amazon Web Services, Inc.</p>
      </footer>
    </div>
  );
}
