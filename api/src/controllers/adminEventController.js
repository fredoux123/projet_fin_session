import { approveEvent, rejectEvent } from '../services/eventService.js';

export async function approve(req, res, next) {
  try {
    const item = await approveEvent(req.params.id);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function reject(req, res, next) {
  try {
    const reason = req.body?.reason;
    const item = await rejectEvent(req.params.id, reason);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}
