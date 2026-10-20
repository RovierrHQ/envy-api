import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../types";
import { userIdForToken } from "../services/pat.service";

export const requirePat = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return c.json({ error: "unauthorized" }, 401);
  const userId = await userIdForToken(c.get("db"), token);
  if (!userId) return c.json({ error: "unauthorized" }, 401);
  c.set("userId", userId);
  await next();
});
