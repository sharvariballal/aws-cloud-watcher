/**
 * Cost Controller (costController.js)
 * ============================================================================
 * 
 * WHY CONTROLLERS EXIST:
 * This controller serves as the entry point for cost metrics.
 * When a user views their dashboard metrics or charts, the frontend requests cost data here.
 * The controller retrieves credentials from the authenticated user profile, then 
 * invokes the AWS Cost Explorer service helper to fetch live (or simulated) expense metrics.
 * 
 * Routes mapped here:
 * - GET /api/cost : Retrieve detailed billing and expense data categorized by service.
 */

const { getAWSExpenses } = require('../services/costExplorerService');

const getCosts = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'mock-id-guest';
    console.log(`[Cost Controller]: Fetching AWS costs for user: ${userId}`);

    // In a live system, we would first query our MongoDB database to retrieve the user's
    // custom AWS IAM access keys and region settings:
    // const user = await User.findById(userId);
    // const { awsRegion, awsAccessKey, awsSecretKey } = user;
    
    // For now we simulate with placeholder defaults
    const mockAwsRegion = 'us-east-1';
    const mockAwsAccessKey = 'AKIAIOSFODNN7EXAMPLE';
    const mockAwsSecretKey = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

    // Delegate the API request to AWS Cost Explorer Service
    const servicesExpenses = await getAWSExpenses(mockAwsRegion, mockAwsAccessKey, mockAwsSecretKey);

    // Calculate sum of total expenses
    const totalActualCost = servicesExpenses.reduce((sum, item) => sum + item.cost, 0);

    // Format final response for frontend use
    res.status(200).json({
      success: true,
      totalActualCost: parseFloat(totalActualCost.toFixed(2)),
      currency: 'USD',
      billingPeriod: 'July 2026',
      services: servicesExpenses
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCosts
};
