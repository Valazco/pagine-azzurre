// User Types
export interface User {
  _id: string;
  account: string;
  username: string;
  name?: string;
  surname?: string;
  email: string;
  phone?: string;
  cf?: string;
  city?: string;
  zipCode?: number;
  birthday?: string;
  birthplace?: string;
  gender?: 'M' | 'F';
  partitaIva?: string;
  isAdmin: boolean;
  isSeller: boolean;
  hasAd: boolean;
  verify?: {
    verified: boolean;
    trusted_link?: string;
  };
  seller?: {
    name: string;
    link?: string;
    logo?: string;
    description?: string;
    rating: number;
    numReviews: number;
  };
  referer?: string[];
  newsletter?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  image: string[];
  brand?: string;
  category: string;
  description: string;
  price?: number; // Legacy field
  priceVal: number;
  priceEuro: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  section: 'offro' | 'cerco' | 'propongo' | 'avviso' | 'dono';
  isService: boolean;
  isGift?: boolean;
  auxPhone?: string;
  delivery?: string;
  expiry?: string;
  pause: boolean;
  country?: string;
  state?: string;
  city?: string;
  municipality?: string;
  seller: {
    _id: string;
    seller: {
      name: string;
      logo?: string;
      rating: number;
      numReviews: number;
    };
  };
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

// Cart Types
export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  priceVal: number;
  countInStock: number;
  qty: number;
  seller: string;
}

// Order Types
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string | User;
  seller?: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginResponse {
  _id: string;
  account: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  hasAd: boolean;
  token: string;
  verified: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  cf?: string;
  sellername?: string;
  referer?: string;
  newsletter?: boolean;
}

// Web3 Config Types
export interface Web3Config {
  infuraUrl: string;
  networkId: number;
}

// Pagination Types
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

// Product list response (matches backend format)
export interface ProductListResponse {
  products: Product[];
  page: number;
  pages: number;
}
