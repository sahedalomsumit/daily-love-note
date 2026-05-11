const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secret = process.env.APP_SECRET;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = authMiddleware;
