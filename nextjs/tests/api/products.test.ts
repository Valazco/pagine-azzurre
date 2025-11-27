import { describe, it, expect, beforeEach } from 'vitest';
import { GET } from '@/app/api/products/route';
import { GET as getCategories } from '@/app/api/products/categories/route';
import { createRequest, parseResponse } from '../utils/request';
import ProductModel from '@/lib/db/models/Product';
import UserModel from '@/lib/db/models/User';
import connectDB from '@/lib/db/mongoose';
import { Types } from 'mongoose';

// Helper to create a test user and return their ObjectId
async function createTestUser(name: string): Promise<Types.ObjectId> {
  await connectDB();
  const user = await UserModel.create({
    account: `0x${Math.random().toString(16).slice(2, 42)}`,
    accountKey: 'test-key',
    username: name.toUpperCase(),
    email: `${name.toLowerCase()}@example.com`,
    password: 'hashedpassword',
    seller: { name: `${name} Seller` },
    isSeller: true,
    verify: { trusted_link: 'test-link', verified: true },
  });
  return user._id;
}

describe('GET /api/products - List Products', () => {
  it('should return empty list when no products', async () => {
    const request = createRequest('/api/products');
    const response = await GET(request);
    const data = await parseResponse<{ products: unknown[]; page: number; pages: number }>(response);

    expect(response.status).toBe(200);
    expect(data.products).toEqual([]);
    expect(data.page).toBe(1);
    expect(data.pages).toBe(0);
  });

  it('should return products with pagination', async () => {
    const sellerId = await createTestUser('seller1');

    await ProductModel.create([
      {
        name: 'Product 1',
        category: 'Electronics',
        image: ['/images/p1.jpg'],
        priceVal: 100,
        countInStock: 10,
        brand: 'Brand A',
        rating: 4.5,
        numReviews: 10,
        description: 'Test product 1',
        seller: sellerId,
        city: 'Rome',
      },
      {
        name: 'Product 2',
        category: 'Electronics',
        image: ['/images/p2.jpg'],
        priceVal: 200,
        countInStock: 5,
        brand: 'Brand B',
        rating: 4.0,
        numReviews: 5,
        description: 'Test product 2',
        seller: sellerId,
        city: 'Milan',
      },
    ]);

    const request = createRequest('/api/products');
    const response = await GET(request);
    const data = await parseResponse<{ products: unknown[]; page: number; pages: number }>(response);

    expect(response.status).toBe(200);
    expect(data.products.length).toBe(2);
    expect(data.page).toBe(1);
    expect(data.pages).toBe(1);
  });

  it('should filter products by category', async () => {
    const sellerId = await createTestUser('seller2');

    await ProductModel.create([
      {
        name: 'Electronics Item',
        category: 'ELECTRONICS',
        image: ['/images/e1.jpg'],
        priceVal: 100,
        countInStock: 10,
        brand: 'Brand A',
        rating: 4.5,
        numReviews: 10,
        description: 'Electronics item',
        seller: sellerId,
        city: 'Rome',
      },
      {
        name: 'Clothing Item',
        category: 'CLOTHING',
        image: ['/images/c1.jpg'],
        priceVal: 50,
        countInStock: 20,
        brand: 'Brand B',
        rating: 4.0,
        numReviews: 5,
        description: 'Clothing item',
        seller: sellerId,
        city: 'Milan',
      },
    ]);

    const request = createRequest('/api/products', {
      searchParams: { category: 'ELECTRONICS' },
    });
    const response = await GET(request);
    const data = await parseResponse<{ products: Array<{ category: string }> }>(response);

    expect(response.status).toBe(200);
    expect(data.products.length).toBe(1);
    expect(data.products[0].category).toBe('ELECTRONICS');
  });

  it('should search products by keyword', async () => {
    const sellerId = await createTestUser('seller3');

    await ProductModel.create([
      {
        name: 'Blue Shirt',
        category: 'Clothing',
        image: ['/images/bs.jpg'],
        priceVal: 30,
        countInStock: 10,
        brand: 'Fashion',
        rating: 4.5,
        numReviews: 10,
        description: 'A nice blue shirt',
        seller: sellerId,
        city: 'Rome',
      },
      {
        name: 'Red Pants',
        category: 'Clothing',
        image: ['/images/rp.jpg'],
        priceVal: 50,
        countInStock: 5,
        brand: 'Fashion',
        rating: 4.0,
        numReviews: 5,
        description: 'Red pants',
        seller: sellerId,
        city: 'Milan',
      },
    ]);

    const request = createRequest('/api/products', {
      searchParams: { name: 'Blue Shirt' },
    });
    const response = await GET(request);
    const data = await parseResponse<{ products: Array<{ name: string }> }>(response);

    expect(response.status).toBe(200);
    expect(data.products.length).toBe(1);
    expect(data.products[0].name).toBe('Blue Shirt');
  });
});

describe('GET /api/products/categories - Product Categories', () => {
  beforeEach(async () => {
    const sellerId = await createTestUser('categoryseller');

    await ProductModel.create([
      {
        name: 'Electronic Device',
        category: 'Electronics',
        image: ['/images/ed.jpg'],
        priceVal: 200,
        countInStock: 10,
        brand: 'Tech',
        rating: 4.5,
        numReviews: 20,
        description: 'Electronic device',
        seller: sellerId,
        city: 'Rome',
      },
      {
        name: 'Fashion Item',
        category: 'Fashion',
        image: ['/images/fi.jpg'],
        priceVal: 80,
        countInStock: 15,
        brand: 'Style',
        rating: 4.0,
        numReviews: 15,
        description: 'Fashion item',
        seller: sellerId,
        city: 'Milan',
      },
    ]);
  });

  it('should return list of unique categories', async () => {
    const response = await getCategories();
    const data = await parseResponse<string[]>(response);

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });
});
