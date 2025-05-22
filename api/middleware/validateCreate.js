const validateCreateExpense = (req, res, next) => {
    const email = req.headers['email'];
    const content = req.body?.content;
    if (!email) return res.status(401).json({ error: 'Email header is required' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    next();
  };

module.exports = { validateCreateExpense };