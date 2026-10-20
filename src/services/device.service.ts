import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { deviceGrants } from "../db/schema";
import { DEVICE_TTL_MS } from "../env";
import { newDeviceCode, newId, newUserCode, sha256Hex } from "../lib/tokens";
import { createPat } from "./pat.service";

export async function startDevice(db: DB, verificationUri: string) {
  const deviceCode = newDeviceCode();
  const userCode = newUserCode();
  const expiresAt = Date.now() + DEVICE_TTL_MS;
  await db.insert(deviceGrants).values({
    id: newId(),
    deviceCodeHash: await sha256Hex(deviceCode),
    userCode,
    status: "pending",
    userId: null,
    issuedToken: null,
    expiresAt,
    createdAt: Date.now(),
  });
  return {
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: verificationUri,
    expires_in: Math.floor(DEVICE_TTL_MS / 1000),
    interval: 5,
  };
}

export async function approveDevice(db: DB, userCode: string, userId: string) {
  const rows = await db.select().from(deviceGrants).where(eq(deviceGrants.userCode, userCode.toUpperCase())).limit(1);
  const grant = rows[0];
  if (!grant || grant.status !== "pending" || grant.expiresAt < Date.now()) return false;
  const minted = await createPat(db, userId, "device");
  const res = await db
    .update(deviceGrants)
    .set({ status: "approved", userId, issuedToken: minted.token })
    .where(eq(deviceGrants.id, grant.id));
  return res.meta.changes > 0;
}

export async function pollDevice(db: DB, deviceCode: string) {
  const hash = await sha256Hex(deviceCode);
  const rows = await db.select().from(deviceGrants).where(eq(deviceGrants.deviceCodeHash, hash)).limit(1);
  const grant = rows[0];
  if (!grant || grant.expiresAt < Date.now()) return { status: "expired" as const };
  if (grant.status === "pending") return { status: "pending" as const };
  if (grant.status !== "approved" || !grant.issuedToken) return { status: "denied" as const };
  await db.update(deviceGrants).set({ issuedToken: null, status: "consumed" }).where(eq(deviceGrants.id, grant.id));
  return { status: "ok" as const, access_token: grant.issuedToken };
}
