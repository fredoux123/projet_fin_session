import artistRepository from '../repositories/artistRepository.js';
import { HttpError } from '../utils/errors.js';

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function listArtists({ q, city, genre }) {
  const query = normalizeQuery(q);
  const cityQuery = normalizeQuery(city);
  const genreQuery = normalizeQuery(genre);

  const artists = await artistRepository.findAll();
  return artists.filter((artist) => {
    if (query && !artist.stageName.toLowerCase().includes(query)) {
      return false;
    }
    if (cityQuery && artist.city.toLowerCase() !== cityQuery) {
      return false;
    }
    if (genreQuery && !artist.bio.toLowerCase().includes(genreQuery)) {
      return false;
    }
    return true;
  });
}

async function getArtist(id) {
  const artist = await artistRepository.findById(id);
  if (!artist) {
    throw new HttpError(404, 'Artist not found');
  }
  return artist;
}

async function createArtist({ stageName, bio, city, photoUrl }, user) {
  if (!stageName || typeof stageName !== 'string') {
    throw new HttpError(400, 'Stage name is required');
  }
  return artistRepository.create({
    stageName: stageName.trim(),
    bio,
    city,
    photoUrl,
    userId: user.id,
  });
}

async function updateArtist(id, updates, user) {
  const artist = await getArtist(id);
  if (user.role !== 'ADMIN' && artist.userId !== user.id) {
    throw new HttpError(403, 'Forbidden');
  }
  const sanitized = {};
  if (updates.stageName) {
    sanitized.stageName = updates.stageName.trim();
  }
  if (typeof updates.bio === 'string') {
    sanitized.bio = updates.bio;
  }
  if (typeof updates.city === 'string') {
    sanitized.city = updates.city;
  }
  if (typeof updates.photoUrl === 'string') {
    sanitized.photoUrl = updates.photoUrl;
  }
  return artistRepository.update(id, sanitized);
}

async function deleteArtist(id) {
  const removed = await artistRepository.remove(id);
  if (!removed) {
    throw new HttpError(404, 'Artist not found');
  }
  return removed;
}

export default {
  listArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
};
