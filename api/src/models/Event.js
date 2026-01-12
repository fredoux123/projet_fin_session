import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    city: { type: String, default: '' },
    venue: { type: String, default: '' },
    startAt: { type: Date, required: true },
    endAt: { type: Date, default: null },
    tags: { type: [String], default: [] },
    artistId: { type: String, required: true },
    createdBy: { type: String, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    moderationReason: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Event', EventSchema);
