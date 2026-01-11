import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    durationSec: { type: Number, default: null },
    genre: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    artistId: { type: String, required: true },
    userId: { type: String, required: true },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Track', TrackSchema);
