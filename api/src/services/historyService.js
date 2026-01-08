import historyRepository from '../repositories/historyRepository.js';

function recordPlay(userId, trackId) {
  const playedAt = new Date().toISOString();
  return historyRepository.add({ userId, trackId, playedAt });
}

function listHistory(userId) {
  const entries = historyRepository.listByUserId(userId);
  return entries.slice().sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

function clearHistory(userId) {
  return historyRepository.clearByUserId(userId);
}

export default {
  recordPlay,
  listHistory,
  clearHistory,
};
