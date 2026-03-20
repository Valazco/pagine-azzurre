import apiClient from './client';
import type { Product, ProductListResponse } from '@/types';

export interface ProductFilters {
  name?: string;
  category?: string;
  min?: number;
  max?: number;
  rating?: number;
  order?: 'lowest' | 'highest' | 'toprated' | 'newest';
  pageNumber?: number;
  pageSize?: number;
}

// Get all products with filters
export async function getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
  const params = new URLSearchParams();

  if (filters?.name) params.append('name', filters.name);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.min !== undefined) params.append('min', filters.min.toString());
  if (filters?.max !== undefined) params.append('max', filters.max.toString());
  if (filters?.rating) params.append('rating', filters.rating.toString());
  if (filters?.order) params.append('order', filters.order);
  if (filters?.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
  if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

  const response = await apiClient.get(`/products?${params.toString()}`);
  return response.data;
}

// Get single product by ID
export async function getProduct(id: string): Promise<Product> {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
}

// Get product categories
export async function getProductCategories(): Promise<string[]> {
  const response = await apiClient.get('/products/categories');
  return response.data;
}

// Create product (seller/admin only)
export async function createProduct(): Promise<Product> {
  const response = await apiClient.post('/products');
  return response.data;
}

// Update product (seller/admin only)
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data;
}

// Delete product (seller/admin only)
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

// Create product review
export async function createProductReview(
  productId: string,
  review: { rating: number; comment: string }
): Promise<void> {
  await apiClient.post(`/products/${productId}/reviews`, review);
}
