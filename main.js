const express = require("express");
const expenseRoutes = require("./api/routes/expenses");
const randomFactRoutes = require("./api/routes/rendom.route");

const app = express();

app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/random-fact", randomFactRoutes);

app.get("/", (req, res) => {
  const secret = req.headers["secret"];
  if (secret === "12345") return res.send("This is secret message");
  res.send('<h1 style="color:red;">Hello World!</h1>');
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
