/**
 * Budget Controller (budgetController.js)
 * ============================================================================
 * 
 * WHY CONTROLLERS EXIST:
 * This controller manages the lifecycle of monthly budget alerts.
 * Users set limits so they do not accidentally incur huge bills on AWS (e.g. leaving
 * an expensive RDS instance active).
 * 
 * The routes mapped here:
 * - GET /api/budget : Retrieves current active budgets and alert triggers.
 * - POST /api/budget : Instantiates a new budget spending limit.
 * - PUT /api/budget : Modifies an existing spending limit.
 */

// Local memory storage to allow fully-featured route testing without database connection
const mockBudgets = [
  {
    id: "mock-budget-id-1",
    userId: "mock-id-guest",
    monthlyLimit: 1200,
    currentCost: 745.32,
    alertSent: false
  }
];

/**
 * Retrieves the budget details for the authenticated user.
 * ROUTE: GET /api/budget
 */
const getBudget = async (req, res, next) => {
  try {
    // req.user.id is automatically populated by our protect middleware
    const userId = req.user ? req.user.id : 'mock-id-guest';
    
    console.log(`[Budget Controller]: Fetching budget details for user: ${userId}`);

    // Attempt to find the budget. We default to our mock array
    let budget = mockBudgets.find(b => b.userId === userId);

    if (!budget) {
      // If none exists, we create a default budget limit of $1000
      budget = {
        id: `mock-budget-${Date.now()}`,
        userId: userId,
        monthlyLimit: 1000,
        currentCost: 0,
        alertSent: false
      };
      mockBudgets.push(budget);
    }

    res.status(200).json({
      success: true,
      budget: budget
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new budget limit target.
 * ROUTE: POST /api/budget
 */
const createBudget = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'mock-id-guest';
    const { monthlyLimit } = req.body;

    console.log(`[Budget Controller]: Creating new limit of $${monthlyLimit} for user: ${userId}`);

    if (monthlyLimit === undefined || monthlyLimit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid monthly limit amount'
      });
    }

    const newBudget = {
      id: `mock-budget-${Date.now()}`,
      userId: userId,
      monthlyLimit: Number(monthlyLimit),
      currentCost: 0,
      alertSent: false
    };

    mockBudgets.push(newBudget);

    res.status(201).json({
      success: true,
      message: 'Budget limit successfully created',
      budget: newBudget
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing budget cap.
 * ROUTE: PUT /api/budget
 */
const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'mock-id-guest';
    const { monthlyLimit } = req.body;

    console.log(`[Budget Controller]: Updating limit to $${monthlyLimit} for user: ${userId}`);

    if (monthlyLimit === undefined || monthlyLimit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid monthly limit amount'
      });
    }

    // Find and update in our mock list
    let budget = mockBudgets.find(b => b.userId === userId);

    if (!budget) {
      budget = {
        id: `mock-budget-${Date.now()}`,
        userId: userId,
        monthlyLimit: Number(monthlyLimit),
        currentCost: 0,
        alertSent: false
      };
      mockBudgets.push(budget);
    } else {
      budget.monthlyLimit = Number(monthlyLimit);
      // Reset alert state if the limit was increased past the current cost
      if (budget.monthlyLimit > budget.currentCost) {
        budget.alertSent = false;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Budget limit successfully updated',
      budget: budget
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget
};
