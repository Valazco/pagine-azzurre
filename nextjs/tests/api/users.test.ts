import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/users/route';
import { GET as getSellers } from '@/app/api/users/sellers/route';
import { createRequest, parseResponse } from '../utils/request';
import UserModel from '@/lib/db/models/User';

// Mock email service
vi.mock('@/lib/services/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('POST /api/users - User Registration', () => {
  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    sellername: 'Test Seller',
  };

  it('should register a new user successfully', async () => {
    const request = createRequest('/api/users', {
      method: 'POST',
      body: validUser,
    });

    const response = await POST(request);
    const data = await parseResponse<{ username: string; email: string; account: string }>(response);

    expect(response.status).toBe(200);
    expect(data.username).toBe('TESTUSER');
    expect(data.email).toBe('test@example.com');
    expect(data.account).toMatch(/^0x[a-fA-F0-9]{40}$/); // Ethereum address
  });

  it('should reject registration with missing fields', async () => {
    const request = createRequest('/api/users', {
      method: 'POST',
      body: { username: 'test' },
    });

    const response = await POST(request);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('Campi obbligatori mancanti');
  });

  it('should reject registration with invalid email', async () => {
    const request = createRequest('/api/users', {
      method: 'POST',
      body: { ...validUser, email: 'invalid-email' },
    });

    const response = await POST(request);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('Email non valida');
  });

  it('should reject registration with short password', async () => {
    const request = createRequest('/api/users', {
      method: 'POST',
      body: { ...validUser, password: '12345' },
    });

    const response = await POST(request);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('La password deve avere almeno 6 caratteri');
  });

  it('should reject duplicate email', async () => {
    // Create first user
    const request1 = createRequest('/api/users', {
      method: 'POST',
      body: validUser,
    });
    await POST(request1);

    // Try to create second user with same email
    const request2 = createRequest('/api/users', {
      method: 'POST',
      body: { ...validUser, username: 'different', sellername: 'Different Seller' },
    });

    const response = await POST(request2);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('Indirizzo email già in uso');
  });

  it('should reject duplicate username', async () => {
    // Create first user
    const request1 = createRequest('/api/users', {
      method: 'POST',
      body: validUser,
    });
    await POST(request1);

    // Try to create second user with same username
    const request2 = createRequest('/api/users', {
      method: 'POST',
      body: { ...validUser, email: 'different@example.com', sellername: 'Different Seller' },
    });

    const response = await POST(request2);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('Username già in uso');
  });

  it('should reject duplicate sellername', async () => {
    // Create first user
    const request1 = createRequest('/api/users', {
      method: 'POST',
      body: validUser,
    });
    await POST(request1);

    // Try to create second user with same sellername
    const request2 = createRequest('/api/users', {
      method: 'POST',
      body: { ...validUser, username: 'different', email: 'different@example.com' },
    });

    const response = await POST(request2);
    const data = await parseResponse<{ message: string }>(response);

    expect(response.status).toBe(400);
    expect(data.message).toBe('Nome venditore già in uso');
  });
});

describe('GET /api/users/sellers - List Sellers', () => {
  beforeEach(async () => {
    // Create a test seller
    const request = createRequest('/api/users', {
      method: 'POST',
      body: {
        username: 'seller1',
        email: 'seller1@example.com',
        password: 'password123',
        sellername: 'Test Seller 1',
      },
    });
    await POST(request);
  });

  it('should return list of sellers', async () => {
    const request = createRequest('/api/users/sellers');
    const response = await getSellers();
    const data = await parseResponse<Array<{ username: string; seller: { name: string } }>>(response);

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].seller.name).toBe('Test Seller 1');
  });
});
