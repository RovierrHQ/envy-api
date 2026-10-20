import { Hono } from "hono";
import { createAuth } from "./auth";
import { createDb } from "./db";
import { pageRoutes } from "./routes/pages";
import { v1Routes } from "./routes/v1";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  const db = createDb(c.env.DB);
  c.set("db", db);
  c.set("auth", createAuth(c.env, db));
  await next();
});

app.get("/health", (c) => c.json({ ok: true }));

app.on(["GET", "POST"], "/api/auth/*", (c) => c.get("auth").handler(c.req.raw));

app.route("/", pageRoutes());
app.route("/v1", v1Routes());

export default app;
