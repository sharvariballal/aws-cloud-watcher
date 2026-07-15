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


  // Get historical AWS expenses
  getHistoricalExpenses: async (): Promise<MonthlyCostData[]> => {

    try {

      const response =
        await api.get('/billing/history');


      return response.data;


    } catch (error: any) {

      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch billing history"
      );

    }

  },



  // Get AWS service-wise cost distribution
  getServiceDistribution: async (): Promise<ServiceCostItem[]> => {

    try {

      const response =
        await api.get('/billing/distribution');


      return response.data;


    } catch (error: any) {

      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch service distribution"
      );

    }

  },



  // Get budget information
  getBudgetStatus: async (): Promise<BudgetConfig> => {

    try {

      const response =
        await api.get('/billing/budget');


      return response.data;


    } catch (error: any) {

      throw new Error(
        error.response?.data?.message ||
        "Failed to fetch budget status"
      );

    }

  },



  // Update budget limit
  updateBudgetLimit: async (
    newLimit: number
  ): Promise<void> => {


    try {

      await api.put(
        '/billing/budget',
        {
          limit: newLimit
        }
      );


    } catch(error:any){

      throw new Error(
        error.response?.data?.message ||
        "Failed to update budget"
      );

    }

  }


};
