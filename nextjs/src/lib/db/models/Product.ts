import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Review subdocument interface
export interface Review {
  name: string;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product section type
export type ProductSection = 'offro' | 'cerco' | 'avviso' | 'propongo';

// Main Product interface
export interface Product {
  name: string;
  seller: Types.ObjectId;
  image: string[];
  brand?: string;
  category?: string;
  description?: string;
  priceVal: number;
  priceEuro?: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  section: ProductSection;
  isService: boolean;
  isGift: boolean;
  auxPhone?: string;
  delivery: string;
  expiry: Date;
  pause: boolean;
  country?: string;
  state?: string;
  city: string;
  municipality?: string;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface ProductDocument extends Product, Document {
  _id: Types.ObjectId;
}

// Model interface
export interface ProductModel extends Model<ProductDocument> {}

const reviewSchema = new Schema<Review>(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: [String], required: true },
    brand: { type: String, required: false, uppercase: true },
    category: { type: String, required: false, uppercase: true },
    description: { type: String, required: false },
    priceVal: { type: Number, required: false, default: 1 },
    priceEuro: { type: Number, required: false },
    countInStock: { type: Number, required: false, default: 1 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    section: {
      type: String,
      required: true,
      default: 'offro',
      enum: ['offro', 'cerco', 'avviso', 'propongo'],
    },
    isService: { type: Boolean, required: true, default: false },
    isGift: { type: Boolean, required: false, default: false },
    auxPhone: { type: String, required: false },
    delivery: { type: String, required: false, default: 'no preferences' },
    expiry: {
      type: Date,
      required: false,
      default: () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      },
    },
    pause: { type: Boolean, required: true, default: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: true, default: '_', uppercase: true },
    municipality: { type: String, required: false },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const ProductModel =
  (mongoose.models.Product as ProductModel) ||
  mongoose.model<ProductDocument, ProductModel>('Product', productSchema);

export default ProductModel;
