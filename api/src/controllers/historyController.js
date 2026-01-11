import historyService from '../services/historyService.js';

export async function list(req, res, next) {
  try {
    const entries = await historyService.listHistory(req.user.id);
    res.status(200).json({ items: entries });
  } catch (err) {
    next(err);
  }
}

export async function clear(req, res, next) {
  try {
    await historyService.clearHistory(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
