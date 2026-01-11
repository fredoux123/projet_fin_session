import favoriteRepository from '../repositories/favoriteRepository.js';
import artistRepository from '../repositories/artistRepository.js';
import { HttpError } from '../utils/errors.js';

async function addFavorite(userId, artistId) {
  if (!artistId) {
    throw new HttpError(400, 'Artist ID is required');
  }
  const artist = await artistRepository.findById(artistId);
  if (!artist) {
    throw new HttpError(404, 'Artist not found');
  }
  const existing = await favoriteRepository.findByUserAndArtist(userId, artistId);
  if (existing) {
    return existing;
  }
  return favoriteRepository.create({ userId, artistId });
}

async function listFavorites(userId, { withArtists = true } = {}) {
  const favorites = await favoriteRepository.listByUser(userId);
  if (!withArtists) {
    return favorites;
  }
  const items = await Promise.all(
    favorites.map(async (fav) => ({
      ...fav,
      artist: await artistRepository.findById(fav.artistId),
    })),
  );
  return items;
}

async function removeFavorite(userId, artistId) {
  if (!artistId) {
    throw new HttpError(400, 'Artist ID is required');
  }
  const removed = await favoriteRepository.removeByUserAndArtist(userId, artistId);
  if (!removed) {
    throw new HttpError(404, 'Favorite not found');
  }
  return removed;
}

export default {
  addFavorite,
  listFavorites,
  removeFavorite,
};
