const { readFile, writeFile } = require("../../utils");
const cloudinary = require("../../config/cloudinary"); 

const getExpenses = async (req, res) => {
  let { page = 1, take = 30 } = req.query;

  page = Number(page);
  take = Math.min(Number(take), 30);

  const expenses = await readFile("expenses.json", true);
  const paginated = expenses.slice((page - 1) * take, page * take);

  res.json({
    total: expenses.length,
    page,
    take,
    data: paginated,
  });
};

const getExpenseById = async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const expense = expenses.find((e) => e.id === id);

  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.json(expense);
};



const createExpense = async (req, res) => {
  const { content } = req.body;
  const email = req.headers["email"];
  const imageUrl = req.file?.path || null;
  const imageId = req.file?.filename || null;

  if (!email) return res.status(401).json({ error: "Email header is required" });
  if (!content) return res.status(400).json({ error: "Content is required" });

  const expenses = await readFile("expenses.json", true);
  const lastId = expenses[expenses.length - 1]?.id || 0;

  const newExpense = {
    id: lastId + 1,
    content,
    email,
    imageUrl,
    imageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  await writeFile("expenses.json", JSON.stringify(expenses));

  res.status(201).json({ message: "Expense created successfully", data: newExpense });
};

const updateExpense = async (req, res) => {
  const email = req.headers["email"];
  const id = Number(req.params.id);
  const content = req.body?.content;

  if (!email) return res.status(401).json({ error: "Email header is required" });

  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  if (expenses[index].email !== email)
    return res.status(403).json({ error: "You are not allowed to update this expense" });

  if (req.file && expenses[index].imageId) {
    await cloudinary.uploader.destroy(expenses[index].imageId);
  }

  expenses[index] = {
    ...expenses[index],
    content: content || expenses[index].content,
    updatedAt: new Date().toISOString(),
    image: req.file?.path || expenses[index].image,
    imageId: req.file?.filename || expenses[index].imageId,
  };

  await writeFile("expenses.json", JSON.stringify(expenses));
  res.json({ message: "Expense updated successfully", data: expenses[index] });
};

const deleteExpense = async (req, res) => {
  const id = Number(req.params.id);
  const expenses = await readFile("expenses.json", true);
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) return res.status(404).json({ error: "Expense not found" });

 
  if (expenses[index].imageId) {
    await cloudinary.uploader.destroy(expenses[index].imageId);
  }

  const deleted = expenses.splice(index, 1);
  await writeFile("expenses.json", JSON.stringify(expenses));

  res.json({ message: "Expense deleted successfully", data: deleted[0] });
};

module.exports = {
  deleteExpense,
  updateExpense,
  createExpense,
  getExpenseById,
  getExpenses,
};
