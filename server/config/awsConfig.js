
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
