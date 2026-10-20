import { Hono } from "hono";
import type { AppEnv } from "../types";
import { requirePat } from "../middleware/pat";
import { acceptInvite, createInvite } from "../services/invite.service";
import { memberRole } from "../services/project.service";
import { createProject } from "../services/project.service";
import { ConflictError, PayloadTooLarge, getSecret, putSecret } from "../services/secret.service";
import { pollDevice, startDevice } from "../services/device.service";

const ENV_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/;

export function v1Routes() {
  const v1 = new Hono<AppEnv>();

  v1.post("/device/code", async (c) => {
    const origin = new URL(c.env.BETTER_AUTH_URL).origin;
    return c.json(await startDevice(c.get("db"), `${origin}/device`));
  });

  v1.post("/device/token", async (c) => {
    const body = await c.req.json<{ device_code?: string }>();
    if (!body.device_code) return c.json({ error: "device_code required" }, 400);
    const result = await pollDevice(c.get("db"), body.device_code);
    if (result.status === "pending") return c.json({ error: "authorization_pending" }, 400);
    if (result.status === "expired") return c.json({ error: "expired_token" }, 400);
    if (result.status === "denied") return c.json({ error: "access_denied" }, 400);
    return c.json({ access_token: result.access_token, token_type: "Bearer" });
  });

  const authed = new Hono<AppEnv>();
  authed.use("*", requirePat);

  authed.post("/projects", async (c) => {
    const body = await c.req.json<{ name?: string }>().catch(() => ({ name: "" }));
    const created = await createProject(c.get("db"), c.get("userId"), body.name ?? "");
    return c.json(created, 201);
  });

  authed.put("/projects/:id/secrets/:env", async (c) => {
    const projectId = c.req.param("id");
    const environment = c.req.param("env");
    if (!ENV_RE.test(environment)) return c.json({ error: "invalid environment" }, 400);
    const role = await memberRole(c.get("db"), projectId, c.get("userId"));
    if (!role) return c.json({ error: "not found" }, 404);
    if (role === "read") return c.json({ error: "forbidden" }, 403);
    const body = await c.req.json<{ ciphertext?: string; version?: number }>();
    if (typeof body.ciphertext !== "string" || typeof body.version !== "number") {
      return c.json({ error: "ciphertext and version required" }, 400);
    }
    try {
      const version = await putSecret(c.get("db"), projectId, environment, body.ciphertext, body.version, c.get("userId"));
      return c.json({ ciphertext: body.ciphertext, version });
    } catch (err) {
      if (err instanceof ConflictError) return c.json({ version: err.remoteVersion, error: "conflict" }, 409);
      if (err instanceof PayloadTooLarge) return c.json({ error: err.message }, 413);
      throw err;
    }
  });

  authed.get("/projects/:id/secrets/:env", async (c) => {
    const projectId = c.req.param("id");
    const environment = c.req.param("env");
    const role = await memberRole(c.get("db"), projectId, c.get("userId"));
    if (!role) return c.json({ error: "not found" }, 404);
    const row = await getSecret(c.get("db"), projectId, environment);
    if (!row) return c.json({ error: "not found" }, 404);
    return c.json(row);
  });

  authed.post("/projects/:id/invites", async (c) => {
    const projectId = c.req.param("id");
    const role = await memberRole(c.get("db"), projectId, c.get("userId"));
    if (role !== "owner") return c.json({ error: "forbidden" }, role ? 403 : 404);
    const body = await c.req.json<{ role?: string }>();
    if (body.role !== "read" && body.role !== "write") return c.json({ error: "role must be read or write" }, 400);
    return c.json(await createInvite(c.get("db"), projectId, c.get("userId"), body.role), 201);
  });

  authed.post("/invites/accept", async (c) => {
    const body = await c.req.json<{ code?: string }>();
    if (!body.code) return c.json({ error: "code required" }, 400);
    const result = await acceptInvite(c.get("db"), body.code, c.get("userId"));
    if ("error" in result) return c.json({ error: result.error }, 400);
    return c.json(result);
  });

  v1.route("/", authed);
  return v1;
}
