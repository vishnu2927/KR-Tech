const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krtech_super_secret_jwt_key_2026_production');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      req.sessionId = decoded.sessionId;
      return next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
  }
};

// Sprint 7.15: RBAC Role Verification Middleware
const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized: Authentication required' });
    }
    // superAdmin always possesses full systemic override permissions
    if (req.user.role === 'superAdmin') {
      return next();
    }
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `Access denied: Role '${req.user.role}' lacks required permissions [${roles.join(', ')}]`,
    });
  };
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krtech_super_secret_jwt_key_2026_production');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        req.user = { _id: decoded.id, email: decoded.email, role: decoded.role || 'student' };
      }
    } catch {
      // ignore invalid token in optional mode
    }
  }
  next();
};

const verifyJWT = protect;

module.exports = {
  protect,
  admin,
  optionalAuth,
  verifyJWT,
  verifyRole,
};
