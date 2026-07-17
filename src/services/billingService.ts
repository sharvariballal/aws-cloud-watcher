import api from './api';
export interface MonthlyCostData {
  month: string;
  EC2: number;
  RDS: number;
  S3: number;
  Lambda: number;
  CloudFront: number;
  DynamoDB: number;
  total: number;
}

export interface ServiceCostItem {
  name: string;
  value: number;
  color: string;
}

export interface BudgetConfig {
  limit: number;
  spent: number;
  forecast: number;
  currency: string;
}

export const billingService = {

  // AWS Cost Explorer
  getHistoricalExpenses: async (): Promise<any> => {
    try {
      const response = await api.get('/cost');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch AWS costs"
      );
    }
  },

  // Service-wise cost distribution
  getServiceDistribution: async (): Promise<any> => {
    try {
      const response = await api.get('/cost');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch AWS service distribution"
      );
    }
  },

  // Budget
  getBudgetStatus: async (): Promise<any> => {
    try {
      const response = await api.get('/budget');

      return {
        limit: response.data.budget.monthlyLimit,
        spent: response.data.budget.currentCost,
        forecast: response.data.budget.currentCost,
        currency: "USD"
      };

    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch budget"
      );
    }
  },

  // Update Budget
  updateBudgetLimit: async (newLimit: number): Promise<void> => {
    try {
      await api.put('/budget', {
        monthlyLimit: newLimit
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to update budget"
      );
    }
  }

};