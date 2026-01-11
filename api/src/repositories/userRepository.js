import User from '../models/User.js';

function toDTO(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id.toString(),
    email: obj.email,
    passwordHash: obj.passwordHash,
    role: obj.role,
  };
}

async function create({ email, passwordHash, role }) {
  const user = await User.create({ email, passwordHash, role });
  return toDTO(user);
}

async function findByEmail(email) {
  const user = await User.findOne({ email }).lean();
  return toDTO(user);
}

async function findById(id) {
  const user = await User.findById(id).lean();
  return toDTO(user);
}

export default {
  create,
  findByEmail,
  findById,
};
