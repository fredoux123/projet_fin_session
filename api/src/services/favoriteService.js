import favoriteRepository from '../repositories/favoriteRepository.js';
import artistRepository from '../repositories/artistRepository.js';
import { HttpError } from '../utils/errors.js';

function addFavorite(userId, artistId) {
  if (!artistId) {
    throw new HttpError(400, 'Artist ID is required');
  }
  const artist = artistRepository.findById(artistId);
  if (!artist) {
    throw new HttpError(404, 'Artist not found');
  }
  const existing = favoriteRepository.findByUserAndArtist(userId, artistId);
  if (existing) {
    return existing;
  }
  return favoriteRepository.create({ userId, artistId });
}

function listFavorites(userId, { withArtists = true } = {}) {
  const favorites = favoriteRepository.listByUser(userId);
  if (!withArtists) {
    return favorites;
  }
  return favorites.map((fav) => ({
    ...fav,
    artist: artistRepository.findById(fav.artistId),
  }));
}

function removeFavorite(userId, artistId) {
  if (!artistId) {
    throw new HttpError(400, 'Artist ID is required');
  }
  const removed = favoriteRepository.removeByUserAndArtist(userId, artistId);
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
