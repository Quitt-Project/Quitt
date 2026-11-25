import { apiRequest } from './client';

export type User = {
  id: number;
  name: string;
  email: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export function register(name: string, email: string, password: string): Promise<User> {
  return apiRequest<User>('/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export async function login(email: string, password: string): Promise<string> {
  const data = await apiRequest<LoginResponse>('/login', {
    method: 'POST',
    body: { email, password },
  });

  return data.access_token;
}

export function getMe(token: string): Promise<User> {
  return apiRequest<User>('/me', { token });
}
