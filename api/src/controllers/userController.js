import authService from '../services/authService.js';

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ item: user });
  } catch (err) {
    next(err);
  }
}
