import crypto from 'node:crypto';

const tracks = [];

function create({ title, durationSec, genre, audioUrl, coverUrl, artistId, userId }) {
  const track = {
    id: crypto.randomUUID(),
    title,
    durationSec,
    genre: genre || '',
    audioUrl: audioUrl || '',
    coverUrl: coverUrl || '',
    artistId,
    userId,
    playCount: 0,
  };
  tracks.push(track);
  return track;
}

function findById(id) {
  return tracks.find((track) => track.id === id) || null;
}

function findAll() {
  return [...tracks];
}

function update(id, updates) {
  const track = findById(id);
  if (!track) {
    return null;
  }
  Object.assign(track, updates);
  return track;
}

function remove(id) {
  const index = tracks.findIndex((track) => track.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = tracks.splice(index, 1);
  return removed;
}

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};
