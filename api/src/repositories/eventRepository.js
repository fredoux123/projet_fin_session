import Event from '../models/Event.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    city: obj.city,
    venue: obj.venue,
    startAt: obj.startAt?.toISOString?.() || obj.startAt,
    endAt: obj.endAt?.toISOString?.() || obj.endAt,
    tags: obj.tags || [],
    artistId: obj.artistId,
    createdBy: obj.createdBy,
    status: obj.status,
    moderationReason: obj.moderationReason || '',
  };
}

async function create(data) {
  const event = await Event.create(data);
  return toDTO(event);
}

async function findById(id) {
  const event = await Event.findById(id).lean();
  return toDTO(event);
}

async function findAll(filter = {}) {
  const events = await Event.find(filter).lean();
  return events.map(toDTO);
}

async function update(id, updates) {
  const event = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();
  return toDTO(event);
}

async function remove(id) {
  const event = await Event.findByIdAndDelete(id).lean();
  return toDTO(event);
}

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};
