import { table } from 'console';
import mongoose, { Document, Schema } from 'mongoose';
import { Tables } from '../constants/Tables';

export interface IUser extends Document {
  _id: string | mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  mobileNumber?: string;
  password?: string;
  role?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId
    },
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 150,
      match: /.+\@.+\..+/,
    },
    mobileNumber: {
      type: String,
      maxlength: 20,
      unique: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
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

export default mongoose.model<IUser>(Tables.users, userSchema);
