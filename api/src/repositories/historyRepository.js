import crypto from 'node:crypto';

const history = [];

function add({ userId, trackId, playedAt }) {
  const entry = {
    id: crypto.randomUUID(),
    userId,
    trackId,
    playedAt,
  };
  history.push(entry);
  return entry;
}

function listByUserId(userId) {
  return history.filter((entry) => entry.userId === userId);
}

function clearByUserId(userId) {
  let removed = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i].userId === userId) {
      history.splice(i, 1);
      removed += 1;
    }
  }
  return removed;
}

export default {
  add,
  listByUserId,
  clearByUserId,
};
