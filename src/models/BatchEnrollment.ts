import mongoose, { Document, Schema } from 'mongoose';
import { Tables } from '../constants/Tables';

export interface IBatchEnrollment extends Document {
  _id: string | mongoose.Schema.Types.ObjectId;
  batchId: string | mongoose.Schema.Types.ObjectId;
  candidateId: string | mongoose.Schema.Types.ObjectId;
  enrollmentDate: Date;
  isActive: boolean;
//   totalFees?: number;
  createdAt: Date;
  updatedAt?: Date;
}

const batchEnrollmentSchema = new Schema<IBatchEnrollment>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId, ref: Tables.batch, required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId, ref: Tables.users, required: true, 
    },
    enrollmentDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // totalFees: {
    //   type: Number,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

batchEnrollmentSchema.index(
  { batchId: 1, candidateId: 1 },
  { unique: true }
);

export const BatchEnrollment = mongoose.model<IBatchEnrollment>(
  Tables.batchEnrollment,
  batchEnrollmentSchema
);
