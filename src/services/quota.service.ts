import { and, eq, gt, lt, sql } from "drizzle-orm";
import type { DB } from "../db";
import { projects, writeLog } from "../db/schema";
import { newId } from "../lib/tokens";

export const MAX_PROJECTS_PER_USER = 5;
export const MAX_WRITES_PER_WINDOW = 30;
export const WRITE_WINDOW_MS = 10 * 60 * 1000;

export class QuotaError extends Error {
  constructor(
    readonly status: 403 | 429,
    message: string,
  ) {
    super(message);
  }
}

export async function assertCanCreateProject(db: DB, userId: string) {
  const rows = await db
    .select({ n: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.createdBy, userId));
  if (Number(rows[0]?.n ?? 0) >= MAX_PROJECTS_PER_USER) {
    throw new QuotaError(403, "project limit reached (5). Self-host envy-api for more.");
  }
}

export async function assertWriteAllowed(db: DB, userId: string) {
  const since = Date.now() - WRITE_WINDOW_MS;
  const rows = await db
    .select({ n: sql<number>`count(*)` })
    .from(writeLog)
    .where(and(eq(writeLog.userId, userId), gt(writeLog.createdAt, since)));
  if (Number(rows[0]?.n ?? 0) >= MAX_WRITES_PER_WINDOW) {
    throw new QuotaError(429, "write rate exceeded. Try again shortly, or self-host envy-api.");
  }
  const now = Date.now();
  await db.insert(writeLog).values({ id: newId(), userId, createdAt: now });
  await db.delete(writeLog).where(lt(writeLog.createdAt, now - 24 * 60 * 60 * 1000));
}
