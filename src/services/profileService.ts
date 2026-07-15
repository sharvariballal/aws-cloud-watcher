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
    //await delay(300);

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
    //await delay(400);
    localStorage.setItem('aws_watcher_profile_config', JSON.stringify(updated));
    return updated;
  }
};
