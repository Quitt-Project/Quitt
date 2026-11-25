// expo-secure-store has no web implementation, so the browser build falls back to
// localStorage. This is not secure storage and is only meant for local web development.
const TOKEN_KEY = 'authToken';

export async function getToken(): Promise<string | null> {
  return localStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  localStorage.setItem(TOKEN_KEY, token);
}

export async function deleteToken(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
}
