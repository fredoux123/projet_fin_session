import eventRepository from '../repositories/eventRepository.js';
import artistRepository from '../repositories/artistRepository.js';
import { HttpError } from '../utils/errors.js';

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function listPublicEvents(query) {
  const city = normalizeQuery(query.city);
  const artistId = normalizeQuery(query.artistId);
  const tag = normalizeQuery(query.tag);
  const from = parseDate(query.from);
  const to = parseDate(query.to);

  const filter = { status: 'APPROVED' };
  if (city) filter.city = city;
  if (artistId) filter.artistId = artistId;
  if (tag) filter.tags = tag;
  if (from || to) {
    filter.startAt = {};
    if (from) filter.startAt.$gte = from;
    if (to) filter.startAt.$lte = to;
  }

  const events = await eventRepository.findAll(filter);
  return events;
}

export async function getPublicEvent(id) {
  const event = await eventRepository.findById(id);
  if (!event || event.status !== 'APPROVED') {
    throw new HttpError(404, 'Event not found');
  }
  return event;
}

export async function createEvent(data, user) {
  if (!data.title || typeof data.title !== 'string') {
    throw new HttpError(400, 'Title is required');
  }
  if (!data.startAt) {
    throw new HttpError(400, 'startAt is required');
  }
  if (!data.artistId || typeof data.artistId !== 'string') {
    throw new HttpError(400, 'artistId is required');
  }
  const artist = await artistRepository.findById(data.artistId);
  if (!artist) {
    throw new HttpError(404, 'Artist not found');
  }

  const status = user.role === 'ADMIN' ? 'APPROVED' : 'PENDING';
  return eventRepository.create({
    title: data.title.trim(),
    description: data.description || '',
    city: (data.city || '').toLowerCase(),
    venue: data.venue || '',
    startAt: new Date(data.startAt),
    endAt: data.endAt ? new Date(data.endAt) : null,
    tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t).toLowerCase()) : [],
    artistId: data.artistId,
    createdBy: user.id,
    status,
    moderationReason: '',
  });
}

export async function updateEvent(id, data, user) {
  const event = await eventRepository.findById(id);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  if (user.role !== 'ADMIN' && event.createdBy !== user.id) {
    throw new HttpError(403, 'Forbidden');
  }
  const updates = {};
  if (typeof data.title === 'string') updates.title = data.title.trim();
  if (typeof data.description === 'string') updates.description = data.description;
  if (typeof data.city === 'string') updates.city = data.city.toLowerCase();
  if (typeof data.venue === 'string') updates.venue = data.venue;
  if (data.startAt) updates.startAt = new Date(data.startAt);
  if (data.endAt) updates.endAt = new Date(data.endAt);
  if (Array.isArray(data.tags)) updates.tags = data.tags.map((t) => String(t).toLowerCase());

  return eventRepository.update(id, updates);
}

export async function deleteEvent(id) {
  const removed = await eventRepository.remove(id);
  if (!removed) {
    throw new HttpError(404, 'Event not found');
  }
  return removed;
}

export async function approveEvent(id) {
  const event = await eventRepository.update(id, { status: 'APPROVED', moderationReason: '' });
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  return event;
}

export async function rejectEvent(id, reason) {
  const event = await eventRepository.update(id, {
    status: 'REJECTED',
    moderationReason: reason || 'Rejected',
  });
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  return event;
}
