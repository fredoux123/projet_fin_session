import History from '../models/History.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    userId: obj.userId,
    trackId: obj.trackId,
    playedAt: new Date(obj.playedAt).toISOString(),
  };
}

async function add({ userId, trackId, playedAt }) {
  const entry = await History.create({ userId, trackId, playedAt });
  return toDTO(entry);
}

async function listByUserId(userId) {
  const entries = await History.find({ userId }).lean();
  return entries.map(toDTO);
}

async function clearByUserId(userId) {
  const result = await History.deleteMany({ userId });
  return result.deletedCount || 0;
}

export default {
  add,
  listByUserId,
  clearByUserId,
};
