import {
  listPublicEvents,
  getPublicEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/eventService.js';

export async function list(req, res, next) {
  try {
    const items = await listPublicEvents(req.query);
    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const item = await getPublicEvent(req.params.id);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const item = await createEvent(req.body, req.user);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const item = await updateEvent(req.params.id, req.body, req.user);
    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteEvent(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
