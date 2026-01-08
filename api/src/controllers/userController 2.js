export function me(req, res, next) {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}
