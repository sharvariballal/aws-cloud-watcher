/**
 * Amazon SNS (Simple Notification Service) Service (snsService.js)
 * ============================================================================
 * 
 * WHY AWS CODE BELONGS IN THE SERVICE LAYER:
 * Sending messages or alerts via SMS/Email using AWS involves creating structured 
 * payloads and utilizing the AWS SDK. We encapsulate this in our Service layer so that
 * any controller (like budgetController or alertsController) can trigger a notification 
 * with a single simple function call. This keeps our controllers clean and simple.
 * 
 * ----------------------------------------------------------------------------
 * ENVIRONMENT VARIABLES REQUIRED:
 * - AWS_REGION: e.g. 'us-east-1'
 * - AWS_ACCESS_KEY_ID: IAM Access credentials with 'sns:Publish' permissions
 * - AWS_SECRET_ACCESS_KEY: IAM Secret credentials
 * - SNS_TOPIC_ARN: The ARN (Amazon Resource Name) of the SNS Topic we publish alerts to
 * ----------------------------------------------------------------------------
 */

// STEP 1: IMPORT AWS SDK v3 PACKAGES
// When ready to connect SNS, we will import the required classes:
// const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// STEP 2: INITIALIZE SNS CLIENT
// We read credentials and region from our central awsConfig.js.
// const { getAWSConfig } = require('../config/awsConfig');
// const awsConfig = getAWSConfig();
// const snsClient = new SNSClient({
//   region: awsConfig.region,
//   credentials: awsConfig.credentials
// });

/**
 * STEP 3: Publishes a text alert/message to an Amazon SNS Topic.
 * 
 * Future Implementation flow:
 * 1. Read message and subject parameters.
 * 2. Get the SNS_TOPIC_ARN from environment variables.
 * 3. Create PublishCommand with parameters:
 *    - Message: message
 *    - Subject: subject
 *    - TopicArn: process.env.SNS_TOPIC_ARN
 * 4. Execute snsClient.send(publishCommand).
 * 5. Handle any transmission logs or return tracking identifiers.
 */
const sendSNSAlert = async (subject, message) => {
  // --- PLACEHOLDER SIMULATION ---
  console.log(`[SNS Service Mock]: sendSNSAlert triggered.`);
  console.log(`- Alert Subject: [${subject}]`);
  console.log(`- Alert Message: "${message}"`);
  console.log(`- Target SNS Topic ARN: ${process.env.SNS_TOPIC_ARN || 'NOT_CONFIGURED_YET'}`);

  return {
    MessageId: "mock-message-id-987654321-zyxwv",
    status: "success",
    message: "SMS and Email alert request successfully submitted to AWS SNS Topic."
  };
};

module.exports = {
  sendSNSAlert
};
