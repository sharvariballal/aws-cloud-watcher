/**
 * AWS Cloud Watcher - Profile & Configuration Service
 * 
 * To integrate with AWS Parameter Store or DynamoDB for configuration persistence:
 * 1. Install DynamoDB Client:
 *    npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 * 2. Example structure:
 *    import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
 *    import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
 * 
 *    const client = new DynamoDBClient({ region: "us-east-1" });
 *    const ddbDocClient = DynamoDBDocumentClient.from(client);
 *    
 *    export const saveUserProfile = async (userId: string, data: any) => {
 *      await ddbDocClient.send(new PutCommand({
 *        TableName: "AWSWatcherUsers",
 *        Item: { UserId: userId, ...data }
 *      }));
 *    };
 */

import { delay } from './api';

export interface UserAWSProfile {
  awsAccessKeyId: string;
  awsRegion: string;
  slackWebhookUrl: string;
  emailNotifications: boolean;
  smsAlerts: boolean;
  mfaStatus: boolean;
  billingThresholdAlert: number;
}

export const profileService = {
  // Fetch existing user AWS IAM reference and user config settings
  getAWSProfile: async (): Promise<UserAWSProfile> => {
    await delay(300);

    const stored = localStorage.getItem('aws_watcher_profile_config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall back to defaults
      }
    }

    // Default configuration
    const defaultProfile: UserAWSProfile = {
  awsAccessKeyId: '',
  awsRegion: 'us-east-1',
  slackWebhookUrl: '',
  emailNotifications: true,
  smsAlerts: false,
  mfaStatus: true,
  billingThresholdAlert: 1500,
}

    localStorage.setItem('aws_watcher_profile_config', JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  // Save profile settings
  saveAWSProfile: async (updated: UserAWSProfile): Promise<UserAWSProfile> => {
    await delay(400);
    localStorage.setItem('aws_watcher_profile_config', JSON.stringify(updated));
    return updated;
  }
};
