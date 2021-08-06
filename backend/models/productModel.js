import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Corresponds to username of reviewer
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
// TODO: Just concider if priceVal required true is better.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    image: { type: Array, required: true },
    brand: { type: String, required: false, uppercase: true },
    category: { type: String, required: false, uppercase: true },
    description: { type: String, required: false },
    priceVal: { type: Number, required: false, default: 1 },
    priceEuro: { type: Number, required: false },
    countInStock: { type: Number, required: false, default: 1 },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    section: { type: String, required: true, default: 'offro' },
    isService: { type: Boolean, required: true, default: false },
    auxPhone: { type: String, required: false },
    delivery: { type: String, required: false, default: 'no preferences'},
    expiry: { type: Date, required: false, default: new Date().setFullYear(new Date().getFullYear() + 1)},
    pause: { type: Boolean, required: true , default: false},
    country: { type: String, required: false},
    state: { type: String, required: false },
    city: { type: String, required: true, default: '_', uppercase: true }, 
    municipality: { type: String, required: false },

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model('Product', productSchema);

export default Product;
