import { Hono } from "hono";
import type { AppEnv } from "../types";
import { githubConfigured } from "../auth";
import { approveDevice } from "../services/device.service";
import { createPat, listPats, revokePat } from "../services/pat.service";
import { layout } from "./layout";
import { mountMarketing } from "./marketing";

const shell = layout;

export function pageRoutes() {
  const pages = new Hono<AppEnv>();
  mountMarketing(pages);

  pages.get("/device", (c) =>
    c.html(
      shell(
        "Approve CLI — envy",
        `<h1>Approve CLI</h1>
        <p>Enter the code from <code>envy login</code>.</p>
        <form id="f">
          <input name="code" maxlength="8" autocomplete="off" placeholder="CODE" required>
          <button type="submit">Approve</button>
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
        </script>`,
      ),
    ),
  );

  pages.post("/device/approve", async (c) => {
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "sign in required", login: "/settings/tokens" }, 401);
    const body = await c.req.json<{ code?: string }>();
    if (!body.code) return c.json({ error: "code required" }, 400);
    const ok = await approveDevice(c.get("db"), body.code, session.user.id);
    if (!ok) return c.json({ error: "unknown or expired code" }, 400);
    return c.json({ ok: true });
  });

  pages.get("/settings/tokens", async (c) => {
    if (!githubConfigured(c.env)) {
      return c.html(shell("envy tokens", `<h1>Tokens</h1><p class="err">GitHub OAuth is not configured on this Worker.</p>`), 503);
    }
    const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.html(
        shell(
          "envy tokens",
          `<h1>Tokens</h1><p>Sign in with GitHub to mint a personal access token.</p><button id="gh">Continue with GitHub</button>
          <script>
            document.getElementById('gh').onclick = async () => {
              const res = await fetch('/api/auth/sign-in/social', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ provider:'github', callbackURL:'/settings/tokens' }) });
              const data = await res.json();
              if (data.url) location.href = data.url; else alert(data.message || 'sign-in failed');
            };
          </script>`,
        ),
      );
    }
    return c.html(
      shell(
        "envy tokens",
        `<h1>Tokens</h1><p>Signed in as ${escapeHtml(session.user.email)}</p>
        <form id="create"><input name="name" placeholder="token name" value="cli"><button>Create token</button></form>
        <pre id="once" hidden></pre>
        <ul id="list"></ul>
        <script>
          const list = document.getElementById('list');
          async function refresh() {
            const rows = await (await fetch('/settings/tokens/list')).json();
            list.innerHTML = rows.map(r => '<li><code>'+r.prefix+'…</code> '+r.name+' <button data-id="'+r.id+'">revoke</button></li>').join('');
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
        </script>`,
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

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}
