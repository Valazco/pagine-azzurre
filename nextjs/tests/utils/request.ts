import { NextRequest } from 'next/server';

interface CreateRequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}

export function createRequest(
  url: string,
  options: CreateRequestOptions = {}
): NextRequest {
  const { method = 'GET', body, headers = {}, searchParams = {} } = options;

  const urlObj = new URL(url, 'http://localhost:3000');
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
  };

  return new NextRequest(urlObj, init);
}

export async function parseResponse<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
