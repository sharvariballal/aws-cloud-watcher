/**
 * AWS Cloud Watcher - Billing Service
 * 
 * To integrate with the AWS Cost Explorer API:
 * 1. Install Cost Explorer client:
 *    npm install @aws-sdk/client-cost-explorer
 * 2. Example method to query cost metrics:
 *    import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";
 * 
 *    const client = new CostExplorerClient({ region: "us-east-1" });
 *    
 *    export const getMonthlySpend = async (startDate: string, endDate: string) => {
 *      const command = new GetCostAndUsageCommand({
 *        TimePeriod: { Start: startDate, End: endDate },
 *        Granularity: "DAILY", // or MONTHLY
 *        Metrics: ["UnblendedCost"],
 *        GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }]
 *      });
 *      const response = await client.send(command);
 *      return response;
 *    }
 */

import { delay } from './api';

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
  // Get historical multi-month expense statistics
  getHistoricalExpenses: async (): Promise<MonthlyCostData[]> => {
    await delay(500);

    // Simulated AWS Cost Explorer return values
    return [
      { month: 'Jan', EC2: 340, RDS: 180, S3: 90, Lambda: 35, CloudFront: 45, DynamoDB: 50, total: 740 },
      { month: 'Feb', EC2: 380, RDS: 190, S3: 95, Lambda: 40, CloudFront: 50, DynamoDB: 55, total: 810 },
      { month: 'Mar', EC2: 450, RDS: 210, S3: 110, Lambda: 55, CloudFront: 60, DynamoDB: 65, total: 950 },
      { month: 'Apr', EC2: 520, RDS: 240, S3: 125, Lambda: 70, CloudFront: 70, DynamoDB: 80, total: 1105 },
      { month: 'May', EC2: 610, RDS: 270, S3: 140, Lambda: 85, CloudFront: 80, DynamoDB: 95, total: 1280 },
      { month: 'Jun', EC2: 680, RDS: 290, S3: 155, Lambda: 110, CloudFront: 90, DynamoDB: 110, total: 1435 },
      { month: 'Jul', EC2: 740, RDS: 310, S3: 175, Lambda: 125, CloudFront: 95, DynamoDB: 120, total: 1565 },
    ];
  },

  // Get breakdown of spending by specific AWS service for Pie Chart
  getServiceDistribution: async (): Promise<ServiceCostItem[]> => {
    await delay(400);

    return [
      { name: 'Amazon EC2', value: 740, color: '#FF9900' },       // AWS Orange
      { name: 'Amazon RDS', value: 310, color: '#1A73E8' },       // Blue
      { name: 'Amazon S3', value: 175, color: '#4CAF50' },        // Green
      { name: 'AWS Lambda', value: 125, color: '#E91E63' },       // Pink/Magenta
      { name: 'Amazon CloudFront', value: 95, color: '#9C27B0' },  // Purple
      { name: 'Amazon DynamoDB', value: 120, color: '#00BCD4' },    // Teal
    ];
  },

  // Get dynamic budget and usage forecasting
  getBudgetStatus: async (): Promise<BudgetConfig> => {
    await delay(300);

    // Check if user set custom budget in localStorage, else return default
    const savedBudget = localStorage.getItem('aws_watcher_custom_budget');
    const budgetLimit = savedBudget ? parseFloat(savedBudget) : 2000;

    return {
      limit: budgetLimit,
      spent: 1565, // Current July total
      forecast: 1845,
      currency: 'USD',
    };
  },

  // Save updated budget
  updateBudgetLimit: async (newLimit: number): Promise<void> => {
    await delay(300);
    localStorage.setItem('aws_watcher_custom_budget', newLimit.toString());
  }
};
