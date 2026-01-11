import Track from '../models/Track.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    title: obj.title,
    durationSec: obj.durationSec,
    genre: obj.genre,
    audioUrl: obj.audioUrl,
    coverUrl: obj.coverUrl,
    artistId: obj.artistId,
    userId: obj.userId,
    playCount: obj.playCount,
  };
}

async function create({ title, durationSec, genre, audioUrl, coverUrl, artistId, userId }) {
  const track = await Track.create({
    title,
    durationSec,
    genre,
    audioUrl,
    coverUrl,
    artistId,
    userId,
  });
  return toDTO(track);
}

async function findById(id) {
  const track = await Track.findById(id).lean();
  return toDTO(track);
}

async function findAll() {
  const tracks = await Track.find({}).lean();
  return tracks.map(toDTO);
}

async function update(id, updates) {
  const track = await Track.findByIdAndUpdate(id, updates, { new: true }).lean();
  return toDTO(track);
}

async function remove(id) {
  const track = await Track.findByIdAndDelete(id).lean();
  return toDTO(track);
}

async function incrementPlayCount(id) {
  const track = await Track.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true }).lean();
  return toDTO(track);
}

export default {
  create,
  findById,
  findAll,
  update,
  remove,
  incrementPlayCount,
};
