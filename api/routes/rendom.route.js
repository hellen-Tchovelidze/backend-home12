const express = require("express");
const router = express.Router();
const { randomBlocker } = require("../middleware/randomBlocker");

router.get("/", randomBlocker, (req, res) => {
  const facts = [
    "bikes are the most stolen vehicles in the world.",
    "gym memberships are often unused.",
    "backend developer is a job title.",
    "mr. david is a great teacher.",
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  res.json({ fact: randomFact });
});

module.exports = router;
