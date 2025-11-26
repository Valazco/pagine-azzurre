import mongoose, { Document, Model, Schema } from 'mongoose';

// Seller subdocument interface
export interface Seller {
  name: string;
  link?: string;
  logo?: string;
  description?: string;
  rating: number;
  numReviews: number;
}

// Verify subdocument interface
export interface Verify {
  verified: boolean;
  trusted_link?: string;
}

// Main User interface
export interface User {
  account: string;
  accountKey: string;
  username: string;
  name?: string;
  surname?: string;
  birthday?: string;
  birthplace?: string;
  gender?: 'M' | 'F';
  cf?: string;
  partitaIva?: string;
  email: string;
  city?: string;
  zipCode?: number;
  phone?: string;
  password: string;
  recoveryPasswordId?: string;
  referer?: string[];
  isAdmin: boolean;
  isSeller: boolean;
  hasAd: boolean;
  activity: number;
  inscriptionBlock: number;
  verify: Verify;
  seller: Seller;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface for instance methods
export interface UserDocument extends User, Document {
  _id: mongoose.Types.ObjectId;
}

// Model interface for static methods
export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>(
  {
    account: { type: String, required: true, unique: true },
    accountKey: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: false },
    surname: { type: String, required: false },
    birthday: { type: String, required: false },
    birthplace: { type: String, required: false, uppercase: true },
    gender: { type: String, enum: ['M', 'F'], required: false },
    cf: { type: String, required: false, unique: true, sparse: true, uppercase: true },
    partitaIva: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      default: () => Date.now().toString()
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    city: { type: String, required: false, uppercase: true },
    zipCode: { type: Number, required: false },
    phone: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
    recoveryPasswordId: { type: String, required: false, default: '' },
    referer: { type: [String], required: false },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: true, required: true },
    hasAd: { type: Boolean, default: false, required: true },
    activity: { type: Number, default: 0, required: false },
    inscriptionBlock: { type: Number, required: true, default: 0 },
    verify: {
      verified: { type: Boolean, default: false },
      trusted_link: { type: String, required: false },
    },
    seller: {
      name: { type: String, required: true, unique: true },
      link: { type: String, required: false },
      logo: { type: String },
      description: { type: String },
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// Automatically exclude sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.accountKey;
  delete user.password;
  delete user.recoveryPasswordId;
  return user;
};

// Prevent model recompilation in development
const UserModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model<UserDocument, UserModel>('User', userSchema);

export default UserModel;
