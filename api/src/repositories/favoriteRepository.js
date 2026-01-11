import crypto from 'node:crypto';

const favorites = [];

function create({ userId, artistId }) {
  const favorite = {
    id: crypto.randomUUID(),
    userId,
    artistId,
    createdAt: new Date().toISOString(),
  };
  favorites.push(favorite);
  return favorite;
}

function findByUserAndArtist(userId, artistId) {
  return favorites.find((fav) => fav.userId === userId && fav.artistId === artistId) || null;
}

function listByUser(userId) {
  return favorites.filter((fav) => fav.userId === userId);
}

function removeByUserAndArtist(userId, artistId) {
  const index = favorites.findIndex((fav) => fav.userId === userId && fav.artistId === artistId);
  if (index === -1) {
    return null;
  }
  const [removed] = favorites.splice(index, 1);
  return removed;
}

export default {
  create,
  findByUserAndArtist,
  listByUser,
  removeByUserAndArtist,
};
