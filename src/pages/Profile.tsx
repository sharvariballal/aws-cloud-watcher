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
    return <Loader message="Loading profile...." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">Profile Settings</h2>
        <p className="text-[11px] text-slate-500 font-mono">
          Manage your AWS credentials and notification settings.
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 animate-bounce" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Form & Policy Reference column */}
      <div className="flex justify-center items-center w-full min-h-[75vh]">
        {/* Form panel */}
        <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <Key className="h-4 w-4 text-orange-400" />
            <span>AWS Credentials</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            {/* Name */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-white text-[11px]"
              />
            </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 block mb-1">
              Email
            </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-white text-[11px]"
              />
            </div>
            {/* IAM Access Key */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Access Key ID
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
                Secret Access Key 
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
                AWS Region
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
                Budget Threshold ($)
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
                Slack Webhook URL
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
              <label className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">Notifications</label>
              
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={emailsChecked}
                  onChange={(e) => setEmailsChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>Email Notifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={smsChecked}
                  onChange={(e) => setSmsChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>SMS Notifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={mfaChecked}
                  onChange={(e) => setMfaChecked(e.target.checked)}
                  className="accent-orange-500 rounded h-3 w-3"
                />
                <span>Enable MFA</span>
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

      </div>
    </motion.div>
  );
}
