import { and, desc, eq, isNull } from "drizzle-orm";
import type { DB } from "../db";
import { personalAccessTokens } from "../db/schema";
import { newId, newPat, sha256Hex } from "../lib/tokens";

export async function createPat(db: DB, userId: string, name: string) {
  const { token, prefix } = newPat();
  const id = newId();
  await db.insert(personalAccessTokens).values({
    id,
    userId,
    tokenHash: await sha256Hex(token),
    name: name.trim() || "cli",
    prefix,
    createdAt: Date.now(),
    revokedAt: null,
  });
  return { id, token, prefix, name: name.trim() || "cli" };
}

export async function listPats(db: DB, userId: string) {
  return db
    .select({
      id: personalAccessTokens.id,
      name: personalAccessTokens.name,
      prefix: personalAccessTokens.prefix,
      createdAt: personalAccessTokens.createdAt,
      revokedAt: personalAccessTokens.revokedAt,
    })
    .from(personalAccessTokens)
    .where(eq(personalAccessTokens.userId, userId))
    .orderBy(desc(personalAccessTokens.createdAt));
}

export async function revokePat(db: DB, userId: string, id: string) {
  const res = await db
    .update(personalAccessTokens)
    .set({ revokedAt: Date.now() })
    .where(and(eq(personalAccessTokens.id, id), eq(personalAccessTokens.userId, userId), isNull(personalAccessTokens.revokedAt)));
  return res.meta.changes > 0;
}

export async function userIdForToken(db: DB, token: string): Promise<string | null> {
  if (!token.startsWith("envy_pat_")) return null;
  const hash = await sha256Hex(token);
  const rows = await db
    .select({ userId: personalAccessTokens.userId, revokedAt: personalAccessTokens.revokedAt })
    .from(personalAccessTokens)
    .where(eq(personalAccessTokens.tokenHash, hash))
    .limit(1);
  const row = rows[0];
  if (!row || row.revokedAt) return null;
  return row.userId;
}
