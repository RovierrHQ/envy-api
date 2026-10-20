export interface Env {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export const MAX_CIPHERTEXT_BYTES = 256 * 1024;
export const INVITE_TTL_MS = 48 * 60 * 60 * 1000;
export const DEVICE_TTL_MS = 10 * 60 * 1000;
