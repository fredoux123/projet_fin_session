import authService from '../services/authService.js';

export function me(req, res, next) {
  try {
    const user = authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}
