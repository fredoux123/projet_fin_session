import historyRepository from '../repositories/historyRepository.js';

async function recordPlay(userId, trackId) {
  const playedAt = new Date().toISOString();
  return historyRepository.add({ userId, trackId, playedAt: new Date(playedAt) });
}

async function listHistory(userId) {
  const entries = await historyRepository.listByUserId(userId);
  return entries.slice().sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

async function clearHistory(userId) {
  return historyRepository.clearByUserId(userId);
}

export default {
  recordPlay,
  listHistory,
  clearHistory,
};
