import { getRecommendations } from '../services/recommendationService.js';

export async function list(req, res, next) {
  try {
    const items = await getRecommendations(req.user.id);
    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
}
