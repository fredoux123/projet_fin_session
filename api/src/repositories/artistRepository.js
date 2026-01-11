import Artist from '../models/Artist.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    stageName: obj.stageName,
    bio: obj.bio,
    city: obj.city,
    photoUrl: obj.photoUrl,
    userId: obj.userId,
  };
}

async function create({ stageName, bio, city, photoUrl, userId }) {
  const artist = await Artist.create({ stageName, bio, city, photoUrl, userId });
  return toDTO(artist);
}

async function findById(id) {
  const artist = await Artist.findById(id).lean();
  return toDTO(artist);
}

async function findAll() {
  const artists = await Artist.find({}).lean();
  return artists.map(toDTO);
}

async function update(id, updates) {
  const artist = await Artist.findByIdAndUpdate(id, updates, { new: true }).lean();
  return toDTO(artist);
}

async function remove(id) {
  const artist = await Artist.findByIdAndDelete(id).lean();
  return toDTO(artist);
}

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};
