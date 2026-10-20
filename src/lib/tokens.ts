const HEX = "0123456789abcdef";

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes: number): string {
  const raw = crypto.getRandomValues(new Uint8Array(bytes));
  let out = "";
  for (const b of raw) out += HEX[b >> 4] + HEX[b & 0xf];
  return out;
}

export function newId(): string {
  return randomHex(16);
}

export function newPat(): { token: string; prefix: string } {
  const token = `envy_pat_${randomHex(32)}`;
  return { token, prefix: token.slice(0, 16) };
}

export function newInviteCode(): string {
  return `envy_inv_${randomHex(24)}`;
}

const USER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newUserCode(): string {
  const raw = crypto.getRandomValues(new Uint8Array(8));
  let out = "";
  for (const b of raw) out += USER_ALPHABET[b % USER_ALPHABET.length];
  return out;
}

export function newDeviceCode(): string {
  return randomHex(32);
}
