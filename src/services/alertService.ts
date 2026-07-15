/**
 * AWS Cloud Watcher - Alert & CloudWatch Alarm Service
 * 
 * To integrate with AWS CloudWatch and AWS SNS:
 * 1. Install required packages:
 *    npm install @aws-sdk/client-cloudwatch @aws-sdk/client-sns
 * 2. Example structure:
 *    import { CloudWatchClient, DescribeAlarmsCommand, PutMetricAlarmCommand } from "@aws-sdk/client-cloudwatch";
 *    import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
 * 
 *    const cwClient = new CloudWatchClient({ region: "us-east-1" });
 * 
 *    export const getActiveAlarms = async () => {
 *      const command = new DescribeAlarmsCommand({ StateValue: "ALARM" });
 *      const response = await cwClient.send(command);
 *      return response.MetricAlarms;
 *    };
 */

import { delay } from './api';

export interface AWSAlert {
  id: string;
  service: string;
  metricName: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  status: string;
  thresholdValue: string;
  currentValue: string;
  timestamp: string;
  message: string;
  acknowledged: boolean;
}

export const alertService = {
  // Get active lists of alarms
  getAlerts: async (): Promise<AWSAlert[]> => {
    await delay(350);

    const storedAlerts = localStorage.getItem('aws_watcher_alerts_list');
    if (storedAlerts) {
      try {
        return JSON.parse(storedAlerts);
      } catch {
        // Fall back to default
      }
    }

    // Default seed alarms
    const defaultAlerts: AWSAlert[] = [
      {
        id: 'alt-cw-1029',
        service: 'Amazon EC2',
        metricName: 'CPUUtilization > 85%',
        severity: 'CRITICAL',
        status: 'ALARM',
        thresholdValue: '85.0%',
        currentValue: '93.4%',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
        message: 'EC2 Instance i-03290ab99120ff9c CPU usage is critically high. Auto-scaling limit reached.',
        acknowledged: false,
      },
      {
        id: 'alt-bl-4302',
        service: 'AWS Budgets',
        metricName: 'MonthlySpendForecast > 90%',
        severity: 'WARNING',
        status: 'ALARM',
        thresholdValue: '$1800.00',
        currentValue: '$1845.00 (92.2%)',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        message: 'Your forecasted monthly spend ($1,845.00) exceeds 90% of your current budget threshold ($2,000.00).',
        acknowledged: false,
      },
      {
        id: 'alt-s3-9210',
        service: 'Amazon S3',
        metricName: 'PublicBucketAccessEnabled',
        severity: 'CRITICAL',
        status: 'ALARM',
        thresholdValue: '0 (False)',
        currentValue: '1 (True)',
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
        message: 'S3 Bucket "production-static-media-public" has public write/read permissions open to the internet.',
        acknowledged: false,
      },
      {
        id: 'alt-iam-5532',
        service: 'AWS IAM',
        metricName: 'MFA_DisabledForRoot',
        severity: 'WARNING',
        status: 'ALARM',
        thresholdValue: 'MFA Enabled',
        currentValue: 'MFA Disabled',
        timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
        message: 'The AWS Root Account lacks Multi-Factor Authentication (MFA). Critical security vulnerability.',
        acknowledged: false,
      },
      {
        id: 'alt-ld-1209',
        service: 'AWS Lambda',
        metricName: 'ConcurrentExecutionsThrottled',
        severity: 'RESOLVED',
        status: 'OK',
        thresholdValue: '0 Throttles',
        currentValue: '0 Throttles',
        timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
        message: 'Lambda "payment-processing-prod" error rate is back to normal. Throttling resolved.',
        acknowledged: true,
      }
    ];

    localStorage.setItem('aws_watcher_alerts_list', JSON.stringify(defaultAlerts));
    return defaultAlerts;
  },

  // Save full alert list
  saveAlerts: async (alerts: AWSAlert[]): Promise<void> => {
    await delay(100);
    localStorage.setItem('aws_watcher_alerts_list', JSON.stringify(alerts));
  },

  // Acknowledge alarm
  acknowledgeAlert: async (id: string): Promise<AWSAlert[]> => {
    const alerts = await alertService.getAlerts();
    const updated = alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a);
    await alertService.saveAlerts(updated);
    return updated;
  },

  // Clear / Delete alert
  deleteAlert: async (id: string): Promise<AWSAlert[]> => {
    const alerts = await alertService.getAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    await alertService.saveAlerts(filtered);
    return filtered;
  },

  // Simulate generating a random test alert
  triggerTestAlert: async (serviceName: string, metricName: string, severity: 'CRITICAL' | 'WARNING'): Promise<AWSAlert> => {
    await delay(500);
    const alerts = await alertService.getAlerts();
    
    const serviceDetails: Record<string, { desc: string, val: string, thresh: string }> = {
      'Amazon EC2': { desc: 'EC2 high memory pressure. Instance i-0e86a5a99ef87b32 is running out of active memory.', val: '97.2% Memory', thresh: '90%' },
      'Amazon RDS': { desc: 'RDS Postgres main-production instance storage utilization has reached maximum allocatable limit.', val: '984GB used / 1000GB', thresh: '900GB' },
      'AWS Lambda': { desc: 'Lambda trigger "media-transcoder-worker" function has timed out repeatedly (> 5 instances in 5 minutes).', val: '14 consecutive timeouts', thresh: '2 timeouts' },
      'Amazon S3': { desc: 'S3 encryption disabled on newly created bucket "development-temporary-artifacts-test".', val: 'SSE-S3 Disabled', thresh: 'AES-256 Enabled' }
    };

    const details = serviceDetails[serviceName] || { 
      desc: `Simulation alert for ${serviceName}: ${metricName} crossed the critical operational safety margin.`,
      val: 'Value out of bounds',
      thresh: 'Safe baseline'
    };

    const newAlert: AWSAlert = {
      id: `alt-test-${Math.floor(Math.random() * 9000 + 1000)}`,
      service: serviceName,
      metricName: metricName,
      severity: severity,
      status: 'ALARM',
      thresholdValue: details.thresh,
      currentValue: details.val,
      timestamp: new Date().toISOString(),
      message: details.desc,
      acknowledged: false,
    };

    const updated = [newAlert, ...alerts];
    await alertService.saveAlerts(updated);
    return newAlert;
  }
};
