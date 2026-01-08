import historyService from '../services/historyService.js';

export function list(req, res, next) {
  try {
    const entries = historyService.listHistory(req.user.id);
    res.status(200).json({ items: entries });
  } catch (err) {
    next(err);
  }
}

export function clear(req, res, next) {
  try {
    historyService.clearHistory(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
