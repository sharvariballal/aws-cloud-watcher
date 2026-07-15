/**
 * AWS Cloud Watcher - Base API Service
 * 
 * To integrate with real AWS services, you can either:
 * 
 * OPTION A: Direct AWS SDK Integration (Recommended for Server-Side or Authenticated Client with Cognito)
 * 1. Install AWS SDK clients:
 *    npm install @aws-sdk/client-cost-explorer @aws-sdk/client-cloudwatch @aws-sdk/client-budgets
 * 2. Configure credentials in your environment variables:
 *    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
 * 
 * OPTION B: Serverless API Gateway Proxies (Recommended for security)
 * 1. Create AWS Lambda functions that fetch AWS metrics (Cost Explorer, CloudWatch, Budgets).
 * 2. Expose them via Amazon API Gateway with API Keys or Cognito Authorizer.
 * 3. Set the BASE_URL below to your API Gateway endpoint.
 */

// Simulated delay to mimic real network latency
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retrieve credentials or configuration from localStorage for simulation
export const getAWSCredentials = () => {
  const credentials = localStorage.getItem('aws_watcher_credentials');
  if (credentials) {
    try {
      return JSON.parse(credentials);
    } catch {
      return null;
    }
  }
  return null;
};

export const saveAWSCredentials = (accessKey: string, secretKey: string, region: string) => {
  localStorage.setItem(
    'aws_watcher_credentials',
    JSON.stringify({
      accessKey: accessKey ? `AKIA${'*'.repeat(12)}${accessKey.slice(-4)}` : '',
      secretKey: secretKey ? `*`.repeat(20) + secretKey.slice(-4) : '',
      region,
      configuredAt: new Date().toISOString(),
    })
  );
};

export const clearAWSCredentials = () => {
  localStorage.removeItem('aws_watcher_credentials');
};

/**
 * Example of how to structure an authorized fetch to a backend API Gateway / Express server
 */
export const fetchFromAWSProxy = async (endpoint: string, options: RequestInit = {}) => {
  const creds = getAWSCredentials();
  
  // Real AWS integration example:
  // const response = await fetch(`${process.env.VITE_AWS_API_GATEWAY_URL}/${endpoint}`, {
  //   ...options,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem('aws_auth_token')}`,
  //     'X-AWS-Region': creds?.region || 'us-east-1',
  //     ...options.headers,
  //   }
  // });
  // return response.json();

  console.log(`[AWS Proxy Simulation] Fetching ${endpoint} with region: ${creds?.region || 'us-east-1'}`);
  await delay(400);
};
