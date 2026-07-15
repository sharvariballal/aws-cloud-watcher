/**
 * AWS Cost Explorer Service (costExplorerService.js)
 * ============================================================================
 * 
 * WHY AWS CODE BELONGS IN THE SERVICE LAYER:
 * Calling AWS services requires dealing with network protocols, input parameters,
 * and parsing complex returned structures. By keeping all AWS SDK API integrations in
 * this Service layer, our controllers can request cost data with a clean, simple call:
 * `const costData = await getCostData(userId);`
 * The controller does not need to know which parameters the Cost Explorer Client requires
 * (like Granularity, Metrics, GroupBy dimensions).
 * 
 * ----------------------------------------------------------------------------
 * ENVIRONMENT VARIABLES REQUIRED:
 * - AWS_REGION: e.g. 'us-east-1' (Cost Explorer API endpoint is global, usually routed through us-east-1)
 * - AWS_ACCESS_KEY_ID: IAM Access credentials with 'ce:GetCostAndUsage' permissions
 * - AWS_SECRET_ACCESS_KEY: IAM Secret credentials
 * ----------------------------------------------------------------------------
 */

// STEP 1: IMPORT AWS SDK v3 PACKAGES
// When ready to connect Cost Explorer, we will import the required classes:
// const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

// STEP 2: INITIALIZE COST EXPLORER CLIENT
// We read credentials and region from our central awsConfig.js.
// const { getAWSConfig } = require('../config/awsConfig');
// const awsConfig = getAWSConfig();
// const costExplorerClient = new CostExplorerClient({
//   region: 'us-east-1', // Cost Explorer is a global service configured on us-east-1
//   credentials: awsConfig.credentials
// });

/**
 * STEP 3: Request billing/cost information from AWS.
 * Retrieves cost metric sums grouped by AWS Services (e.g., EC2, RDS, S3)
 * for the current billing month.
 * 
 * Future Implementation flow:
 * 1. Define start and end date boundaries (e.g. 2026-07-01 to 2026-07-15).
 * 2. Create the GetCostAndUsageCommand with parameters:
 *    - TimePeriod: { Start: startStr, End: endStr }
 *    - Granularity: 'MONTHLY'
 *    - Metrics: ['UnblendedCost']
 *    - GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
 * 3. Call costExplorerClient.send(command).
 * 4. Parse the results array and extract human-readable dollar numbers.
 */
const getAWSExpenses = async (awsRegion, awsAccessKey, awsSecretKey) => {
  // --- PLACEHOLDER SIMULATION ---
  console.log(`[Cost Explorer Service Mock]: getAWSExpenses called.`);
  console.log(`- Connection Region: ${awsRegion || 'us-east-1'}`);
  console.log(`- Uses Access Key: ${awsAccessKey ? 'Custom API Keys Injected' : 'Default Shared AWS Role'}`);

  // We return clean mock JSON of AWS monthly expenses broken down by services.
  // This structure matches what our React frontend expects to chart.
  return [
    { service: 'Amazon Elastic Compute Cloud (EC2)', cost: 480.25 },
    { service: 'Amazon Relational Database Service (RDS)', cost: 320.10 },
    { service: 'Amazon Simple Storage Service (S3)', cost: 180.45 },
    { service: 'AWS Lambda (Serverless)', cost: 45.12 },
    { service: 'Amazon CloudFront (CDN)', cost: 30.50 },
    { service: 'Amazon DynamoDB (NoSQL)', cost: 192.00 }
  ];
};

module.exports = {
  getAWSExpenses
};
