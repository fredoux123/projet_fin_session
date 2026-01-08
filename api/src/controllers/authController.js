import authService from '../services/authService.js';

export function register(req, res, next) {
  try {
    const { user, token } = authService.register(req.body);
    res.status(201).json({ item: user, token });
  } catch (err) {
    next(err);
  }
}

export function login(req, res, next) {
  try {
    const { user, token } = authService.login(req.body);
    res.status(200).json({ item: user, token });
  } catch (err) {
    next(err);
  }
}
