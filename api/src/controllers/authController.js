import authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ item: user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ item: user, token });
  } catch (err) {
    next(err);
  }
}
