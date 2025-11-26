import mongoose, { Document, Model, Schema } from 'mongoose';

// Newsletter interface
export interface Newsletter {
  name?: string;
  email: string;
  citybase?: string;
  verified: boolean;
  newsnumber: number;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface NewsletterDocument extends Newsletter, Document {
  _id: mongoose.Types.ObjectId;
}

// Model interface
export interface NewsletterModel extends Model<NewsletterDocument> {}

const newsletterSchema = new Schema<NewsletterDocument>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    citybase: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
    newsnumber: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const NewsletterModel =
  (mongoose.models.Newsletter as NewsletterModel) ||
  mongoose.model<NewsletterDocument, NewsletterModel>('Newsletter', newsletterSchema);

export default NewsletterModel;
