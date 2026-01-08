import crypto from 'node:crypto';

const users = [];

function create({ email, passwordHash, role }) {
  const user = { id: crypto.randomUUID(), email, passwordHash, role };
  users.push(user);
  return user;
}

function findByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function findById(id) {
  return users.find((user) => user.id === id) || null;
}

export default {
  create,
  findByEmail,
  findById,
};
