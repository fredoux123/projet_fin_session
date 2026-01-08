import crypto from 'node:crypto';

const artists = [];

function create({ stageName, bio, city, photoUrl, userId }) {
  const artist = {
    id: crypto.randomUUID(),
    stageName,
    bio: bio || '',
    city: city || '',
    photoUrl: photoUrl || '',
    userId,
  };
  artists.push(artist);
  return artist;
}

function findById(id) {
  return artists.find((artist) => artist.id === id) || null;
}

function findAll() {
  return [...artists];
}

function update(id, updates) {
  const artist = findById(id);
  if (!artist) {
    return null;
  }
  Object.assign(artist, updates);
  return artist;
}

function remove(id) {
  const index = artists.findIndex((artist) => artist.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = artists.splice(index, 1);
  return removed;
}

export default {
  create,
  findById,
  findAll,
  update,
  remove,
};
