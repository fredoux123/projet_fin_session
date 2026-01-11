import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    trackId: { type: String, required: true },
    playedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('History', HistorySchema);
