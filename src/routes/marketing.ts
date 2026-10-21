import type { Hono } from "hono";
import type { AppEnv } from "../types";
import { layout, releaseUrl } from "./layout";

export function mountMarketing(pages: Hono<AppEnv>) {
  pages.get("/", (c) =>
    c.html(
      layout(
        "envy — encrypted env sync",
        `<p class="kicker">For developer teams</p>
        <h1>Secrets stay on your machine.</h1>
        <p class="lede">envy encrypts <code>.env</code> files before they leave the laptop. This server stores ciphertext, a version, and who may read it. The passphrase never arrives.</p>
        <div class="row">
          <a class="btn primary" href="${releaseUrl}">Download</a>
          <a class="btn" href="/docs">Read the docs</a>
          <a class="btn" href="/settings/tokens">Sign in</a>
        </div>
        <pre>go install github.com/RovierrHQ/envy/cmd/envy@latest</pre>
        <div class="grid">
          <section class="card"><h2>Lock</h2><p>A shared passphrase is stretched with Argon2id. The 32-byte key sits in the OS keychain.</p></section>
          <section class="card"><h2>Ship</h2><p><code>envy push</code> sends an <code>envy1</code> AES-GCM envelope. A stale version is rejected.</p></section>
          <section class="card"><h2>Invite</h2><p>Owners mint a 48-hour code for read or write. Accepting it requires your own login.</p></section>
        </div>`,
      ),
    ),
  );

  pages.get("/docs", (c) =>
    c.html(
      layout(
        "Docs — envy",
        `<p class="kicker">Docs</p>
        <h1>Use the hosted API, or run your own.</h1>
        <div class="prose">
          <h2>Install</h2>
          <p>Download a binary from <a href="${releaseUrl}">GitHub Releases</a>, or:</p>
          <pre>go install github.com/RovierrHQ/envy/cmd/envy@latest</pre>
          <h2>Hosted</h2>
          <pre>envy login
envy init --api-url https://envy-api.rovierr.workers.dev --register
envy push --env dev
envy pull --env dev</pre>
          <p><code>envy login</code> prints a code and opens <a href="/device">/device</a>. Approving it stores a personal access token. You can also mint one under <a href="/settings/tokens">Sign in</a> and run <code>envy login --token</code>.</p>
          <h2>A second person</h2>
          <pre>envy invite create --role write
envy invite accept envy_inv_…</pre>
          <p>The teammate logs in first, then accepts. They still need the project passphrase, which you share out of band.</p>
          <h2 id="self-host">Self-host</h2>
          <p>Clone <a href="https://github.com/RovierrHQ/envy-api">envy-api</a>, create a GitHub OAuth app whose callback is <code>https://&lt;your-worker&gt;/api/auth/callback/github</code>, then:</p>
          <pre>npx wrangler login
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler d1 migrations apply envy --remote
npx wrangler deploy</pre>
          <p>Point the CLI at that origin with <code>--api-url</code>. Set <code>BETTER_AUTH_URL</code> in <code>wrangler.jsonc</code> to the same origin before deploy.</p>
        </div>`,
      ),
    ),
  );

  pages.get("/pricing", (c) =>
    c.html(
      layout(
        "Pricing — envy",
        `<p class="kicker">Pricing</p>
        <h1>Free.</h1>
        <p class="lede">The CLI is open source. This hosted API is free for normal team use. There is no account upgrade and no card.</p>
        <div class="grid">
          <section class="card"><h2>Hosted</h2><ul><li>5 projects you create</li><li>30 secret writes per 10 minutes</li><li>256 KiB per environment blob</li></ul></section>
          <section class="card"><h2>Self-host</h2><p>Deploy envy-api on your Cloudflare account when those limits are too small. You pay Cloudflare, not envy.</p></section>
        </div>`,
      ),
    ),
  );

  pages.get("/changelog", (c) =>
    c.html(
      layout(
        "Changelog — envy",
        `<p class="kicker">Changelog</p>
        <h1>0.1.0</h1>
        <ul>
          <li>CLI: init, unlock, login, push, pull, invite</li>
          <li>Hosted API with GitHub sign-in, device approval, and personal access tokens</li>
          <li>Project membership, 48-hour invites, optimistic versions</li>
          <li>Hosted quotas: 5 projects, 30 writes / 10 minutes, 256 KiB blobs</li>
        </ul>
        <p><a href="${releaseUrl}">Release binaries</a></p>`,
      ),
    ),
  );
}
