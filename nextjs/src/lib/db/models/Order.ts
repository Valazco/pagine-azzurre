import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Order item interface
export interface OrderItem {
  name: string;
  qty: number;
  image: string[];
  priceVal: number;
  priceEuro?: number;
  product: Types.ObjectId;
}

// Shipping address interface
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

// Payment result interface
export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

// Val payment status type
export type ValPaymentStatus = 'unanswered' | 'pending' | 'completed' | 'failed';

// Main Order interface
export interface Order {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  valPayment: ValPaymentStatus;
  itemsPriceVal: number;
  itemsPriceEuro?: number;
  totalPriceVal: number;
  totalPriceEuro?: number;
  user: Types.ObjectId;
  seller?: Types.ObjectId;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface OrderDocument extends Order, Document {
  _id: Types.ObjectId;
}

// Model interface
export interface OrderModel extends Model<OrderDocument> {}

const orderSchema = new Schema<OrderDocument>(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: [String], required: true },
        priceVal: { type: Number, required: true },
        priceEuro: { type: Number, required: false },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: false },
      lat: { type: Number },
      lng: { type: Number },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    valPayment: {
      type: String,
      required: true,
      default: 'unanswered',
      enum: ['unanswered', 'pending', 'completed', 'failed'],
    },
    itemsPriceVal: { type: Number, required: true },
    itemsPriceEuro: { type: Number, required: false },
    totalPriceVal: { type: Number, required: true },
    totalPriceEuro: { type: Number, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const OrderModel =
  (mongoose.models.Order as OrderModel) ||
  mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export default OrderModel;
