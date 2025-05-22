const express = require("express");
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../services/expenseService");

const { validateCreateExpense } = require("../middleware/validateCreate");
const { checkDeleteSecret } = require("../middleware/checkDeleteSecret");
const { upload } = require("../middleware/uploadImage");

router.get("/", getExpenses);
router.get("/:id", getExpenseById);

router.post("/", upload.single("image"), validateCreateExpense, createExpense);
router.put("/:id", upload.single("image"), updateExpense);
router.delete("/:id", checkDeleteSecret, deleteExpense);

module.exports = router;
