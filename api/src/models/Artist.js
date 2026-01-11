import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema(
  {
    stageName: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    city: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Artist', ArtistSchema);
