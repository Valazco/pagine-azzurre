import apiClient from './client';
import type { User, LoginResponse, RegisterData } from '@/types';

// Sign in
export async function signin(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/users/signin', { email, password });
  return response.data;
}

// Register
export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await apiClient.post('/users/register', data);
  return response.data;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<User> {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

// Update user profile
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  const response = await apiClient.put('/users/profile', data);
  return response.data;
}

// Get top sellers
export async function getTopSellers(): Promise<User[]> {
  const response = await apiClient.get('/users/top-sellers');
  return response.data;
}

// Get all sellers
export async function getSellers(): Promise<User[]> {
  const response = await apiClient.get('/users/sellers');
  return response.data;
}

// Password recovery
export async function requestPasswordRecovery(email: string): Promise<void> {
  await apiClient.post('/users/password-recovery', { email });
}

// Change password
export async function changePassword(recoveryId: string, newPassword: string): Promise<void> {
  await apiClient.post(`/users/password-recovery/${recoveryId}`, { password: newPassword });
}

// Get user details (full profile)
export async function getUserDetails(userId: string): Promise<User> {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

// Update newsletter subscription
export async function updateNewsletter(username: string, email: string): Promise<void> {
  await apiClient.post('/users/newsletter', { username, email });
}

// Upload seller logo to S3
export async function uploadSellerLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post('/uploads/s3', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
