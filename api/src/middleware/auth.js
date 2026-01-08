import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authenticate(req, res, next) {
  const header = req.header('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    next(new HttpError(401, 'Missing or invalid authorization header'));
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function requireRole(...roles) {
  const allowedRoles = roles.length === 1 && Array.isArray(roles[0]) ? roles[0] : roles;
  const allowed = new Set(allowedRoles);
  return (req, res, next) => {
    if (!req.user || !allowed.has(req.user.role)) {
      next(new HttpError(403, 'Forbidden'));
      return;
    }
    next();
  };
}
