import { Hono } from "hono";
import type { AppEnv } from "../types";
import { githubConfigured } from "../auth";
import { approveDevice } from "../services/device.service";
import { createPat, listPats, revokePat } from "../services/pat.service";
import { escapeHtml, layout, type LayoutUser } from "./layout";
import { mountMarketing } from "./marketing";

async function userOf(c: { get: (k: "auth") => AppEnv["Variables"]["auth"]; req: { raw: Request } }): Promise<LayoutUser> {
  const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return null;
  return { email: session.user.email, name: session.user.name };
}

export function pageRoutes() {
  const pages = new Hono<AppEnv>();
  mountMarketing(pages);

  pages.get("/login", async (c) => {
    const user = await userOf(c);
    if (user) return c.redirect("/account");
    if (!githubConfigured(c.env)) {
      return c.html(layout("Sign in - envy", `<div class="shell" style="padding:2rem 0 4rem"><h1>Sign in</h1><p class="err">GitHub OAuth is not configured on this Worker.</p></div>`), 503);
    }
    const next = c.req.query("next") || "/account";
    return c.html(
      layout(
        "Sign in - envy",
        `<div class="shell" style="padding:2.5rem 0 5rem;max-width:32rem">
          <h1>Sign in with GitHub</h1>
          <p class="lede">Approve the CLI from <code>/device</code>, or mint a personal access token for <code>envy login --token</code>.</p>
          <button type="button" class="solid" id="gh">Continue with GitHub</button>
          <script>
            document.getElementById('gh').onclick = async () => {
              const res = await fetch('/api/auth/sign-in/social', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ provider: 'github', callbackURL: ${JSON.stringify(next)} })
              });
              const data = await res.json();
              if (data.url) location.href = data.url;
              else alert(data.message || 'sign-in failed');
            };
          </script>
        </div>`,
        { user: null },
      ),
    );
  });

  pages.get("/account", async (c) => {
    const user = await userOf(c);
    if (!user) return c.redirect("/login?next=/account");
    return c.html(
      layout(
        "Account - envy",
        `<div class="shell" style="padding:2.5rem 0 5rem">
          <h1>Account</h1>
          <p class="lede">Signed in as ${escapeHtml(user.email)}</p>
          <div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
            <a class="field" href="/settings/tokens" style="text-decoration:none;color:inherit">
              <h3>Tokens</h3>
              <p>Create or revoke personal access tokens for the CLI.</p>
            </a>
            <a class="field" href="/device" style="text-decoration:none;color:inherit">
              <h3>Approve device</h3>
              <p>Enter the code printed by <code>envy login</code>.</p>
            </a>
          </div>
        </div>`,
        { user },
      ),
    );
  });

  pages.get("/device", async (c) => {
    const user = await userOf(c);
    if (!user) return c.redirect("/login?next=/device");
    return c.html(
      layout(
        "Approve CLI - envy",
        `<div class="shell" style="padding:2.5rem 0 5rem;max-width:28rem">
          <h1>Approve CLI</h1>
          <p class="lede">Enter the code from <code>envy login</code> on your machine.</p>
          <form id="f">
            <input name="code" maxlength="8" autocomplete="off" placeholder="CODE" required>
            <button class="solid" type="submit">Approve</button>
          </form>
          <p id="msg"></p>
          <script>
            const f = document.getElementById('f');
            f.addEventListener('submit', async (e) => {
              e.preventDefault();
              const code = new FormData(f).get('code');
              const res = await fetch('/device/approve', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ code }) });
              const data = await res.json();
              document.getElementById('msg').textContent = res.ok ? 'Approved. Return to the terminal.' : (data.error || 'Failed');
            });
          </script>
        </div>`,
        { user },
      ),
    );
  });

  pages.post("/device/approve", async (c) => {
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "sign in required", login: "/login?next=/device" }, 401);
    const body = await c.req.json<{ code?: string }>();
    if (!body.code) return c.json({ error: "code required" }, 400);
    const ok = await approveDevice(c.get("db"), body.code, session.user.id);
    if (!ok) return c.json({ error: "unknown or expired code" }, 400);
    return c.json({ ok: true });
  });

  pages.get("/settings/tokens", async (c) => {
    const user = await userOf(c);
    if (!githubConfigured(c.env)) {
      return c.html(layout("Tokens - envy", `<div class="shell" style="padding:2rem 0"><h1>Tokens</h1><p class="err">GitHub OAuth is not configured on this Worker.</p></div>`, { user }), 503);
    }
    if (!user) return c.redirect("/login?next=/settings/tokens");
    return c.html(
      layout(
        "Tokens - envy",
        `<div class="shell" style="padding:2.5rem 0 5rem">
          <h1>Tokens</h1>
          <p class="lede">Signed in as ${escapeHtml(user.email)}. Copy a new token once. It is not shown again.</p>
          <p><a href="/account">Back to Account</a></p>
          <form id="create" style="max-width:24rem;margin:1.5rem 0">
            <input name="name" placeholder="token name" value="cli">
            <button class="solid" type="submit">Create token</button>
          </form>
          <pre id="once" hidden></pre>
          <ul id="list" style="list-style:none;padding:0;max-width:36rem"></ul>
          <script>
            const list = document.getElementById('list');
            async function refresh() {
              const rows = await (await fetch('/settings/tokens/list')).json();
              list.innerHTML = rows.map(r => '<li style="display:flex;gap:1rem;align-items:center;padding:.75rem;margin:.35rem 0;background:#162a17"><code>'+r.prefix+'...'+r.name+'</span> <button class="solid" style="margin:0;background:#243024;color:#fff" data-id="'+r.id+'">Revoke</button></li>').join('');
              list.querySelectorAll('button').forEach(b => b.onclick = async () => {
                await fetch('/settings/tokens/'+b.dataset.id, { method:'DELETE' });
                refresh();
              });
            }
            document.getElementById('create').onsubmit = async (e) => {
              e.preventDefault();
              const name = new FormData(e.target).get('name');
              const res = await fetch('/settings/tokens', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name }) });
              const data = await res.json();
              const once = document.getElementById('once');
              once.hidden = false;
              once.textContent = data.token || data.error;
              refresh();
            };
            refresh();
          </script>
        </div>`,
        { user },
      ),
    );
  });

  pages.get("/settings/tokens/list", async (c) => {
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "unauthorized" }, 401);
    const rows = await listPats(c.get("db"), session.user.id);
    return c.json(rows.filter((r) => !r.revokedAt));
  });

  pages.post("/settings/tokens", async (c) => {
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "unauthorized" }, 401);
    const body = await c.req.json<{ name?: string }>().catch(() => ({ name: "cli" }));
    const created = await createPat(c.get("db"), session.user.id, body.name ?? "cli");
    return c.json({ id: created.id, token: created.token, prefix: created.prefix }, 201);
  });

  pages.delete("/settings/tokens/:id", async (c) => {
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "unauthorized" }, 401);
    const ok = await revokePat(c.get("db"), session.user.id, c.req.param("id"));
    if (!ok) return c.json({ error: "not found" }, 404);
    return c.json({ ok: true });
  });

  return pages;
}
