const {
  CostExplorerClient,
  GetCostAndUsageCommand,
} = require("@aws-sdk/client-cost-explorer");

const { getAWSConfig } = require("../config/awsConfig");

// Load AWS configuration from .env
const awsConfig = getAWSConfig();

// Cost Explorer is a global service.
// AWS recommends using us-east-1 for the endpoint.
const costExplorerClient = new CostExplorerClient({
  region: "us-east-1",
  credentials: awsConfig.credentials,
});

/**
 * Returns current month's AWS expenses grouped by AWS Service.
 */
const getAWSExpenses = async () => {
  try {
    // Current month date range
    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // End date is exclusive
    const end = new Date(today);
    end.setDate(end.getDate() + 1);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    console.log("=======================================");
    console.log("Fetching LIVE AWS Cost Explorer Data...");
    console.log("Start:", startStr);
    console.log("End:", endStr);
    console.log("=======================================");

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startStr,
        End: endStr,
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
      GroupBy: [
        {
          Type: "DIMENSION",
          Key: "SERVICE",
        },
      ],
    });

    const response = await costExplorerClient.send(command);

    const groups = response.ResultsByTime?.[0]?.Groups || [];

    const expenses = groups.map((group) => ({
      service: group.Keys[0],
      cost: parseFloat(group.Metrics.UnblendedCost.Amount),
    }));

    console.log(`Fetched ${expenses.length} AWS services.`);

    // If there is no AWS usage this month,
    // return a placeholder for the frontend.
    if (expenses.length === 0) {
      return [
        {
          service: "No AWS Usage Yet",
          cost: 0,
        },
      ];
    }

    return expenses;
  } catch (error) {
    console.error("AWS Cost Explorer Error:", error);
    throw error;
  }
};

module.exports = {
  getAWSExpenses,
};