const Budget = require("../models/Budget");

// GET
const getBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let budget = await Budget.findOne({ userId });

    if (!budget) {
      budget = await Budget.create({
        userId,
        monthlyLimit: 1000,
        currentCost: 0,
        alertSent: false,
      });
    }

    res.json({
      success: true,
      budget,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE
const createBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { monthlyLimit } = req.body;

    const existing = await Budget.findOne({ userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Budget already exists",
      });
    }

    const budget = await Budget.create({
      userId,
      monthlyLimit,
      currentCost: 0,
      alertSent: false,
    });

    res.status(201).json({
      success: true,
      budget,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { monthlyLimit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId },
      {
        monthlyLimit,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      budget,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
};