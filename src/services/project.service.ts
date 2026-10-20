import { and, eq } from "drizzle-orm";
import type { DB } from "../db";
import { projectMembers, projects } from "../db/schema";
import { newId } from "../lib/tokens";

export type Role = "owner" | "write" | "read";

export async function createProject(db: DB, userId: string, name: string) {
  const id = newId();
  const now = Date.now();
  await db.batch([
    db.insert(projects).values({
      id,
      name: name.trim() || "untitled",
      createdAt: now,
      createdBy: userId,
    }),
    db.insert(projectMembers).values({
      projectId: id,
      userId,
      role: "owner",
      createdAt: now,
    }),
  ]);
  return { project_id: id };
}

export async function memberRole(db: DB, projectId: string, userId: string): Promise<Role | null> {
  const rows = await db
    .select({ role: projectMembers.role })
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
    .limit(1);
  const role = rows[0]?.role;
  if (role === "owner" || role === "write" || role === "read") return role;
  return null;
}

export async function upsertMember(db: DB, projectId: string, userId: string, role: Role) {
  const existing = await memberRole(db, projectId, userId);
  if (existing === "owner") return;
  if (existing) {
    await db
      .update(projectMembers)
      .set({ role })
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
    return;
  }
  await db.insert(projectMembers).values({
    projectId,
    userId,
    role,
    createdAt: Date.now(),
  });
}
