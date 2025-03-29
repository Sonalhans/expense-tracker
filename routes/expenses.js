import express from "express";
import Expense from "../models/Expense.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add Expense
router.post("/add", authenticateToken, async (req, res) => {
  const { category, amount } = req.body;
  try {
    const expense = new Expense({
      userId: req.user.userId,
      category,
      amount,
    });
    await expense.save();
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

// ✅ Get User Expenses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// ✅ Delete an Expense
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    if (expense.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this expense" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

// ✅ Update an Expense
router.put("/:id", authenticateToken, async (req, res) => {
  const { category, amount } = req.body;
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    if (expense.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this expense" });
    }

    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    await expense.save();
    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    res.status(500).json({ error: "Error updating expense" });
  }
});

export default router;
