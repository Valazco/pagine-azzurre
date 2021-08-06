import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    account: { type: String, required: true, unique: true},
    accountKey: { type: String, required: true, unique: true }, 
    username: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: false },
    surname: { type: String, required: false },
    birthday: { type: String, required: false },
    birthplace: { type: String, required: false, uppercase: true },
    gender: { type: String, enum:["M", "F"], required: false },
    cf: { type: String, required: false, unique: true, uppercase: true },
    partitaIva: { type: String, required: false, unique: true, default: new Date()},
    email: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: false, uppercase: true },
    zipCode: { type: Number, required: false },
    phone: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    recoveryPasswordId: { type: String, require: false, default: ''},
    referer: {type: Array , required: false },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: true, required: true },
    hasAd: { type: Boolean, default: false, required: true },
    activity: { type: Number, default: 0, require: false },
    seller: {
      name: { type: String, required: true, unique: true },
      link: { type: String, require: false },
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
export default User;
