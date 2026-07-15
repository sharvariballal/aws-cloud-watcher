import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { profileService, UserAWSProfile } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Eye, EyeOff, Save, CheckCircle2, CloudLightning, Copy, FileCode, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserAWSProfile | null>(null);
  
  // Credentials edit inputs
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [region, setRegion] = useState('us-east-1');
  const [webhook, setWebhook] = useState('');
  const [threshold, setThreshold] = useState(1500);
  const [emailsChecked, setEmailsChecked] = useState(true);
  const [smsChecked, setSmsChecked] = useState(false);
  const [mfaChecked, setMfaChecked] = useState(true);

  // Success indicator message
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getAWSProfile();
        setProfile(data);
        
        // Populate inputs
        setAccessKey(data.awsAccessKeyId);
        setRegion(data.awsRegion);
        setWebhook(data.slackWebhookUrl);
        setThreshold(data.billingThresholdAlert);
        setEmailsChecked(data.emailNotifications);
        setSmsChecked(data.smsAlerts);
        setMfaChecked(data.mfaStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    const updatedProfile: UserAWSProfile = {
      awsAccessKeyId: accessKey,
      awsRegion: region,
      slackWebhookUrl: webhook,
      emailNotifications: emailsChecked,
      smsAlerts: smsChecked,
      mfaStatus: mfaChecked,
      billingThresholdAlert: threshold,
    };

    // Store custom credentials in localStorage for simulation uses
    if (accessKey && secretKey) {
      localStorage.setItem('aws_watcher_credentials', JSON.stringify({
        accessKey: accessKey,
        secretKey: secretKey,
        region,
        configuredAt: new Date().toISOString()
      }));
    }

    const saved = await profileService.saveAWSProfile(updatedProfile);
    setProfile(saved);
    setLoading(false);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyPolicy = () => {
    navigator.clipboard.writeText(iamPolicyJson);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  // Standard Read-Only Security Audit Policy schema
  const iamPolicyJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "FinOpsCostExplorerAudit",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchAlarmsMonitor",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:DescribeAlarms",
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    },
    {
      "Sid": "BudgetsThresholdQuery",
      "Effect": "Allow",
      "Action": [
        "budgets:ViewBudget",
        "budgets:DescribeBudgets"
      ],
      "Resource": "*"
    }
  ]
}`;

  if (loading) {
    return <Loader message="Accessing AWS user config policy profiles..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">AWS Configuration Portal</h2>
        <p className="text-[11px] text-slate-500 font-mono">
          Update credential endpoints, alert channels, and connection policies.
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 animate-bounce" />
          <span>AWS Profile configurations updated. Settings are live!</span>
        </div>
      )}

      {/* Profile Form & Policy Reference column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <Key className="h-4 w-4 text-orange-400" />
            <span>Simulated API Key Credentials</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            {/* IAM Access Key */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                AWS Access Key ID (Mock)
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full rounded bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none px-2.5 py-1.5 text-white font-mono text-[11px]"
                required
              />
            </div>

            {/* IAM Secret Key */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                AWS Secret Access Key (Mock)
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full rounded bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none pl-2.5 pr-9 py-1.5 text-white font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Region Selector */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Default Query AWS Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none px-2.5 py-1.5 text-white text-[11px]"
              >
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                <option value="ap-northeast-1">ap-northeast-1 (Tokyo)</option>
              </select>
            </div>

            {/* Threshold Input */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Monthly Billing Threshold Alarm ($)
              </label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full rounded bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none px-2.5 py-1.5 text-white font-mono text-[11px]"
                required
              />
            </div>

            {/* Slack Webhook Url */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Incoming Slack Webhook URL
              </label>
              <input
                type="text"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="w-full rounded bg-slate-950 border border-slate-800 focus:border-orange-500 focus:outline-none px-2.5 py-1.5 text-white font-mono text-[11px]"
              />
            </div>

            {/* Checkboxes parameters */}
            <div className="space-y-2 pt-1.5">
              <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">Notification Pipelines</label>
              
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={emailsChecked}
                  onChange={(e) => setEmailsChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>Email alerts via Amazon SES</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={smsChecked}
                  onChange={(e) => setSmsChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>SMS priority alarms via Amazon SNS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={mfaChecked}
                  onChange={(e) => setMfaChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>Require Multi-Factor (MFA) to access credentials</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-orange-500 hover:bg-orange-600 font-bold text-white py-2 transition text-xs shadow"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Integration Guidelines checklist with AWS JSON IAM Policies */}
        <div className="space-y-6">
          {/* IAM policy snippet box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                  IAM Auditor Policy Schema
                </h3>
              </div>

              <button
                onClick={handleCopyPolicy}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-white bg-slate-950 px-2 py-1 rounded border border-slate-800"
              >
                {copiedPolicy ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedPolicy ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To wire this dashboard to your real AWS account, create an IAM User/Role with the following <strong>Read-Only Cost Auditor</strong> policy. This ensures your secrets remain secure while keeping the dashboards populated:
            </p>

            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto text-[10px] font-mono text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              <code>{iamPolicyJson}</code>
            </pre>
          </div>

          {/* Setup checklist instructions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <CloudLightning className="h-4 w-4 text-orange-400" />
              <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                AWS Live Integration Steps
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center h-4.5 w-4.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-orange-400 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-white">Create AWS IAM credentials</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Go to AWS Console IAM Users ➔ Add User ➔ Attach the Cost/CloudWatch Policy shown above ➔ Create Access Key.
                  </p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center h-4.5 w-4.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-orange-400 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-white">Set Environment Variables</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Declare <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> in your environment file.
                  </p>
                </div>
              </li>

              <li className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center h-4.5 w-4.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-orange-400 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-white">Replace mock calls with AWS SDK</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Swap the mock lists in <code>services/billingService.ts</code> and <code>services/alertService.ts</code> using AWS client commands.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
