import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    artistId: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { timestamps: false },
);

FavoriteSchema.index({ userId: 1, artistId: 1 }, { unique: true });

export default mongoose.model('Favorite', FavoriteSchema);
