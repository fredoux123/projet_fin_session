import trackRepository from '../repositories/trackRepository.js';
import artistRepository from '../repositories/artistRepository.js';
import { HttpError } from '../utils/errors.js';

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function listTracks({ artistId, genre }) {
  const artistFilter = normalizeQuery(artistId);
  const genreFilter = normalizeQuery(genre);

  const tracks = await trackRepository.findAll();
  return tracks.filter((track) => {
    if (artistFilter && track.artistId.toLowerCase() !== artistFilter) {
      return false;
    }
    if (genreFilter && track.genre.toLowerCase() !== genreFilter) {
      return false;
    }
    return true;
  });
}

async function getTrack(id) {
  const track = await trackRepository.findById(id);
  if (!track) {
    throw new HttpError(404, 'Track not found');
  }
  return track;
}

async function createTrack({ title, durationSec, genre, audioUrl, coverUrl, artistId }, user) {
  if (!title || typeof title !== 'string') {
    throw new HttpError(400, 'Title is required');
  }
  if (!artistId || typeof artistId !== 'string') {
    throw new HttpError(400, 'Artist ID is required');
  }
  const artist = await artistRepository.findById(artistId);
  if (!artist) {
    throw new HttpError(404, 'Artist not found');
  }
  if (user.role !== 'ADMIN' && artist.userId !== user.id) {
    throw new HttpError(403, 'Forbidden');
  }
  return trackRepository.create({
    title: title.trim(),
    durationSec: Number.isFinite(Number(durationSec)) ? Number(durationSec) : null,
    genre,
    audioUrl,
    coverUrl,
    artistId,
    userId: user.id,
  });
}

async function updateTrack(id, updates, user) {
  const track = await getTrack(id);
  if (user.role !== 'ADMIN' && track.userId !== user.id) {
    throw new HttpError(403, 'Forbidden');
  }
  const sanitized = {};
  if (updates.title) {
    sanitized.title = updates.title.trim();
  }
  if (Number.isFinite(Number(updates.durationSec))) {
    sanitized.durationSec = Number(updates.durationSec);
  }
  if (typeof updates.genre === 'string') {
    sanitized.genre = updates.genre;
  }
  if (typeof updates.audioUrl === 'string') {
    sanitized.audioUrl = updates.audioUrl;
  }
  if (typeof updates.coverUrl === 'string') {
    sanitized.coverUrl = updates.coverUrl;
  }
  return trackRepository.update(id, sanitized);
}

async function deleteTrack(id) {
  const removed = await trackRepository.remove(id);
  if (!removed) {
    throw new HttpError(404, 'Track not found');
  }
  return removed;
}

async function playTrack(id) {
  const track = await trackRepository.incrementPlayCount(id);
  if (!track) {
    throw new HttpError(404, 'Track not found');
  }
  return track;
}

export default {
  listTracks,
  getTrack,
  createTrack,
  updateTrack,
  deleteTrack,
  playTrack,
};
