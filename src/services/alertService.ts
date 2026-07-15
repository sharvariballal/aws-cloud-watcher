import api from './api';
export interface AWSAlert {

  id: string;
  service: string;
  metricName: string;
  severity:
    | 'CRITICAL'
    | 'WARNING'
    | 'RESOLVED';
  status: string;
  thresholdValue: string;
  currentValue: string;
  timestamp: string;
  message: string;
  acknowledged: boolean;
}
export const alertService = {

  // Get all alerts
  getAlerts: async (): Promise<AWSAlert[]> => {

    try {

      const response =
        await api.get('/alerts');

      return response.data;

    } catch(error:any){

      throw new Error(

        error.response?.data?.message ||
        "Failed to fetch alerts"

      );

    }
  },
  // Save/update alerts
  // (Backend will handle storage, SNS, DynamoDB etc.)
  saveAlerts: async (
    alerts: AWSAlert[]
  ): Promise<void> => {

    try {

      await api.put(
        '/alerts',
        {
          alerts
        }
      );

    } catch(error:any){

      throw new Error(

        error.response?.data?.message ||
        "Failed to save alerts"

      );
    }
  },

  // Acknowledge alert
  acknowledgeAlert: async (
    id: string
  ): Promise<AWSAlert[]> => {

    try {

      const response =
        await api.put(
          `/alerts/${id}/acknowledge`
        );

      return response.data;

    } catch(error:any){

      throw new Error(

        error.response?.data?.message ||
        "Failed to acknowledge alert"

      );
    }

  },

  // Delete alert
  deleteAlert: async (
    id:string
  ): Promise<AWSAlert[]> => {

    try {

      const response =
        await api.delete(
          `/alerts/${id}`
        );

      return response.data;
    } catch(error:any){
      throw new Error(
        error.response?.data?.message ||
        "Failed to delete alert"

      );
    }
  },
  // Create test alert
  // Backend can trigger SNS / CloudWatch simulation
  triggerTestAlert: async (
    serviceName:string,
    metricName:string,
    severity:
      | 'CRITICAL'
      | 'WARNING'

  ): Promise<AWSAlert> => {

    try {

      const response =
        await api.post(
          '/alerts/test',
          {
            serviceName,
            metricName,
            severity
          }
        );

      return response.data;

    } catch(error:any){

      throw new Error(
        error.response?.data?.message ||
        "Failed to create test alert"
      );

    }

  }

};