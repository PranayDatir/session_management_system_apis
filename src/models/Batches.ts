import mongoose, { Document, Schema } from 'mongoose';
import { Tables } from '../constants/Tables';

export interface IBatch extends Document {
  _id: string | mongoose.Schema.Types.ObjectId;
  batchName: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },
    batchName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    description: {
      type: String,
      maxlength: 500,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Batch = mongoose.model<IBatch>(Tables.batch, batchSchema);
