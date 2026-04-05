import mongoose, { Document, Schema } from 'mongoose';
import { Tables } from '../constants/Tables';

export interface IBatchSession extends Document {
  _id: string | mongoose.Schema.Types.ObjectId;
  batchId: string | mongoose.Schema.Types.ObjectId;
  topicName: string;
  topicDescription?: string;
  youtubeVideoId: string;
  durationInMinutes?: number;
  sessionDate: Date;
  displayOrder: number;
  createdAt: Date;
  updatedAt?: Date;
}

const batchSessionSchema = new Schema<IBatchSession>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId, ref: Tables.batch, required: true,
    },
    topicName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    topicDescription: {
      type: String,
      maxlength: 500,
      default: null,
    },
    youtubeVideoId: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    durationInMinutes: {
      type: Number,
      default: null,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    displayOrder: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BatchSession = mongoose.model<IBatchSession>(
  Tables.batchSession,
  batchSessionSchema
);
