import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", expenseSchema);
