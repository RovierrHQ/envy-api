import { and, eq, sql } from "drizzle-orm";
import type { DB } from "../db";
import { secrets } from "../db/schema";
import { MAX_CIPHERTEXT_BYTES } from "../env";

export class ConflictError extends Error {
  constructor(readonly remoteVersion: number) {
    super("conflict");
  }
}

export class PayloadTooLarge extends Error {
  constructor() {
    super("ciphertext exceeds 256 KiB");
  }
}

function decodedSize(b64: string): number {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
}

export async function putSecret(
  db: DB,
  projectId: string,
  environment: string,
  ciphertext: string,
  baseVersion: number,
  userId: string,
) {
  if (decodedSize(ciphertext) > MAX_CIPHERTEXT_BYTES) throw new PayloadTooLarge();
  const now = Date.now();
  if (baseVersion === 0) {
    const existing = await db
      .select({ version: secrets.version })
      .from(secrets)
      .where(and(eq(secrets.projectId, projectId), eq(secrets.environment, environment)))
      .limit(1);
    if (existing[0]) throw new ConflictError(existing[0].version);
    await db.insert(secrets).values({
      projectId,
      environment,
      ciphertext,
      version: 1,
      updatedAt: now,
      updatedBy: userId,
    });
    return 1;
  }
  const res = await db
    .update(secrets)
    .set({
      ciphertext,
      version: sql`${secrets.version} + 1`,
      updatedAt: now,
      updatedBy: userId,
    })
    .where(and(eq(secrets.projectId, projectId), eq(secrets.environment, environment), eq(secrets.version, baseVersion)));
  if (res.meta.changes === 0) {
    const current = await db
      .select({ version: secrets.version })
      .from(secrets)
      .where(and(eq(secrets.projectId, projectId), eq(secrets.environment, environment)))
      .limit(1);
    throw new ConflictError(current[0]?.version ?? 0);
  }
  return baseVersion + 1;
}

export async function getSecret(db: DB, projectId: string, environment: string) {
  const rows = await db
    .select({ ciphertext: secrets.ciphertext, version: secrets.version })
    .from(secrets)
    .where(and(eq(secrets.projectId, projectId), eq(secrets.environment, environment)))
    .limit(1);
  return rows[0] ?? null;
}
