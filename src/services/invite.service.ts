import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { invites } from "../db/schema";
import { INVITE_TTL_MS } from "../env";
import { newId, newInviteCode, sha256Hex } from "../lib/tokens";
import { upsertMember, type Role } from "./project.service";

export async function createInvite(db: DB, projectId: string, userId: string, role: Exclude<Role, "owner">) {
  const code = newInviteCode();
  const id = newId();
  await db.insert(invites).values({
    id,
    codeHash: await sha256Hex(code),
    projectId,
    role,
    createdBy: userId,
    expiresAt: Date.now() + INVITE_TTL_MS,
    usedAt: null,
    usedBy: null,
  });
  return { code, expires_at: Date.now() + INVITE_TTL_MS, role };
}

export async function acceptInvite(db: DB, code: string, userId: string) {
  const hash = await sha256Hex(code);
  const rows = await db.select().from(invites).where(eq(invites.codeHash, hash)).limit(1);
  const invite = rows[0];
  if (!invite || invite.usedAt) return { error: "invalid" as const };
  if (invite.expiresAt < Date.now()) return { error: "expired" as const };
  if (invite.role !== "read" && invite.role !== "write") return { error: "invalid" as const };
  const now = Date.now();
  const claimed = await db
    .update(invites)
    .set({ usedAt: now, usedBy: userId })
    .where(eq(invites.id, invite.id));
  if (claimed.meta.changes === 0) return { error: "invalid" as const };
  await upsertMember(db, invite.projectId, userId, invite.role);
  return { project_id: invite.projectId, role: invite.role };
}
