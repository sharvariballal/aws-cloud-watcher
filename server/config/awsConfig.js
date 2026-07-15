/**
 * AWS configuration file (awsConfig.js)
 * ============================================================================
 * 
 * WHY THIS FILE EXISTS:
 * This file acts as a centralized manager for all AWS Credentials and Region details.
 * Instead of reading `process.env.AWS_ACCESS_KEY_ID`, etc., across multiple separate service files,
 * we read them once here, perform validation, and export a clean configuration object.
 * This guarantees consistency and keeps all credentials safe and in one place.
 * 
 * WHERE AWS CREDENTIALS ARE READ:
 * The credentials are automatically read from the .env file using process.env:
 * - AWS_ACCESS_KEY_ID: The unique public key identifier for your IAM User.
 * - AWS_SECRET_ACCESS_KEY: The secure private key for your IAM User.
 * - AWS_REGION: The geographical AWS region we want to execute SDK requests in (e.g. us-east-1).
 * 
 * HOW AWS SDK RECEIVES THESE:
 * Most AWS Client constructors in SDK v3 (like SNSClient or CostExplorerClient) accept an object
 * containing:
 * {
 *   region: "us-east-1",
 *   credentials: {
 *     accessKeyId: "...",
 *     secretAccessKey: "..."
 *   }
 * }
 */

// Load dotenv just in case this file is called independently (e.g. in standalone script tests)
require('dotenv').config();

const getAWSConfig = () => {
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  // We check if the keys are defined, but do not crash the app yet, 
  // because the developer requested to keep these as placeholders for now.
  if (!accessKeyId || !secretAccessKey) {
    console.log(`[AWS Config Alert]: Missing accessKeyId or secretAccessKey in environment variables.`);
    console.log(`Please define AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your server/.env file for live AWS operations.`);
  }

  return {
    region: region,
    credentials: {
      accessKeyId: accessKeyId || 'MOCK_ACCESS_KEY_ID',
      secretAccessKey: secretAccessKey || 'MOCK_SECRET_ACCESS_KEY',
    }
  };
};

module.exports = {
  getAWSConfig
};
