const randomBlocker = (req, res, next) => {
    const allow = Math.random() > 0.5;
    if (!allow) return res.status(403).json({ error: 'Access blocked randomly!' });
    next();
  };


module.exports = { randomBlocker };