const checkDeleteSecret = (req, res, next) => {
    const secret = req.headers['secret'];
    if (!secret || secret !== 'random123') {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing secret key' });
    }
    next();
  };


module.exports = { checkDeleteSecret };