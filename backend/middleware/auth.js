const jwt = require('jsonwebtoken');

// Verifies the Bearer token and attaches { role, refId, name } to req.user
exports.protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ message: 'Not authorised: token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { role: decoded.role, refId: decoded.refId, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorised: token invalid or expired' });
  }
};

// Restricts a route to one or more roles
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Only ${roles.join(' / ')} can do this` });
    }
    next();
  };
