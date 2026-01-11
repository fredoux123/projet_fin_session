import Favorite from '../models/Favorite.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    userId: obj.userId,
    artistId: obj.artistId,
    createdAt: new Date(obj.createdAt).toISOString(),
  };
}

async function create({ userId, artistId }) {
  const favorite = await Favorite.create({
    userId,
    artistId,
    createdAt: new Date(),
  });
  return toDTO(favorite);
}

async function findByUserAndArtist(userId, artistId) {
  const favorite = await Favorite.findOne({ userId, artistId }).lean();
  return toDTO(favorite);
}

async function listByUser(userId) {
  const favorites = await Favorite.find({ userId }).lean();
  return favorites.map(toDTO);
}

async function removeByUserAndArtist(userId, artistId) {
  const favorite = await Favorite.findOneAndDelete({ userId, artistId }).lean();
  return toDTO(favorite);
}

export default {
  create,
  findByUserAndArtist,
  listByUser,
  removeByUserAndArtist,
};
