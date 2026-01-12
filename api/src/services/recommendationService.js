import artistRepository from '../repositories/artistRepository.js';
import favoriteRepository from '../repositories/favoriteRepository.js';
import historyRepository from '../repositories/historyRepository.js';
import trackRepository from '../repositories/trackRepository.js';
import { HttpError } from '../utils/errors.js';

const HISTORY_LIMIT = 50;

export async function getRecommendations(userId) {
  const history = await historyRepository.listByUserId(userId);
  const recentHistory = history
    .slice()
    .sort((a, b) => b.playedAt.localeCompare(a.playedAt))
    .slice(0, HISTORY_LIMIT)
    .map((entry) => ({ trackId: entry.trackId, playedAt: entry.playedAt }));

  const favorites = await favoriteRepository.listByUser(userId);
  const favoriteArtists = favorites.map((fav) => ({ artistId: fav.artistId }));

  const artists = await artistRepository.findAll();
  const tracks = await trackRepository.findAll();

  const payload = {
    userId,
    history: recentHistory,
    favorites: favoriteArtists,
    artists: artists.map((artist) => ({
      id: artist.id,
      stageName: artist.stageName,
    })),
    tracks: tracks.map((track) => ({
      id: track.id,
      artistId: track.artistId,
      genre: track.genre,
      playCount: track.playCount,
    })),
  };

  const iaUrl = process.env.IA_URL || 'http://localhost:8001';
  try {
    const response = await fetch(`${iaUrl}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new HttpError(502, 'IA service unreachable');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.items)) {
      throw new HttpError(502, 'Invalid IA response');
    }
    return data.items;
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(502, 'IA service unreachable');
  }
}
