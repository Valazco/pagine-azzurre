export { default as UserModel } from './User';
export type { User, UserDocument, Seller, Verify } from './User';
export type { UserModel as UserModelType } from './User';

export { default as ProductModel } from './Product';
export type { Product, ProductDocument, Review, ProductSection } from './Product';
export type { ProductModel as ProductModelType } from './Product';

export { default as OrderModel } from './Order';
export type {
  Order,
  OrderDocument,
  OrderItem,
  ShippingAddress,
  PaymentResult,
  ValPaymentStatus,
} from './Order';
export type { OrderModel as OrderModelType } from './Order';

export { default as NewsletterModel } from './Newsletter';
export type { Newsletter, NewsletterDocument } from './Newsletter';
export type { NewsletterModel as NewsletterModelType } from './Newsletter';

export { default as MessageModel } from './Message';
export type { Message, MessageDocument } from './Message';
export type { MessageModel as MessageModelType } from './Message';
