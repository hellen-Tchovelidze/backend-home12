require("dotenv").config();
const express = require("express");
const path = require("path");
const { upload } = require("./api/middleware/uploadImage");
const cloudinary = require("cloudinary").v2;

const app = express();

let expenses = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "pages"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { expenses });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", upload.single("image"), (req, res) => {
  const { content, email, amount } = req.body;
  const imageUrl = req.file?.path || null;
  const publicId = req.file?.filename || null;

  const id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;

  expenses.push({
    id,
    content,
    email,
    amount: parseFloat(amount),
    imageUrl,
    publicId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  res.redirect("/");
});

app.get("/:id/details", (req, res) => {
  const id = Number(req.params.id);
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return res.status(404).send("Expense not found");
  res.render("details", { expense });
});

app.get("/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return res.status(404).send("Expense not found");
  res.render("edit", { expense });
});

app.post("/:id/edit", upload.single("image"), async (req, res) => {
  const id = Number(req.params.id);
  const expenseIndex = expenses.findIndex((e) => e.id === id);
  if (expenseIndex === -1) return res.status(404).send("Expense not found");

  const { content, email, amount } = req.body;
  const imageUrl = req.file?.path;
  const publicId = req.file?.filename;

  expenses[expenseIndex].content = content;
  expenses[expenseIndex].email = email;

  if (amount !== "") {
    expenses[expenseIndex].amount = parseFloat(amount);
  }

  if (imageUrl) {
    if (expenses[expenseIndex].publicId) {
      try {
        await cloudinary.uploader.destroy(expenses[expenseIndex].publicId);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    expenses[expenseIndex].imageUrl = imageUrl;
    expenses[expenseIndex].publicId = publicId;
  }

  expenses[expenseIndex].updatedAt = new Date().toISOString();

  res.redirect("/");
});

app.post("/:id/delete", async (req, res) => {
  const id = Number(req.params.id);
  const expense = expenses.find((e) => e.id === id);

  if (expense?.publicId) {
    try {
      await cloudinary.uploader.destroy(expense.publicId);
    } catch (err) {
      console.error("Error deleting image:", err.message);
    }
  }

  expenses = expenses.filter((e) => e.id !== id);
  res.redirect("/");
});

app.listen(5050, () => {
  console.log(`Server running at http://localhost:5050`);
});
