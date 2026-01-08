import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import { HttpError } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';
const ROLES = new Set(['USER', 'ARTIST', 'ADMIN']);

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, hash] = passwordHash.split(':');
  if (!salt || !hash) {
    return false;
  }
  const candidate = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
}

function sanitizeUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

function register({ email, password, role }) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!normalizedEmail || !password) {
    throw new HttpError(400, 'Email and password are required');
  }
  if (password.length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters');
  }
  if (userRepository.findByEmail(normalizedEmail)) {
    throw new HttpError(409, 'Email already registered');
  }
  const normalizedRole = role ? role.toUpperCase() : 'USER';
  if (!ROLES.has(normalizedRole)) {
    throw new HttpError(400, 'Invalid role');
  }

  const user = userRepository.create({
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: normalizedRole,
  });
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
  return { user: sanitizeUser(user), token };
}

function login({ email, password }) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!normalizedEmail || !password) {
    throw new HttpError(400, 'Email and password are required');
  }
  const user = userRepository.findByEmail(normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new HttpError(401, 'Invalid credentials');
  }
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
  return { user: sanitizeUser(user), token };
}

function getUserById(id) {
  const user = userRepository.findById(id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  return sanitizeUser(user);
}

export default {
  register,
  login,
  getUserById,
};
