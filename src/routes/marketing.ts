import type { Context, Hono } from "hono";
import type { AppEnv } from "../types";
import { codeBlock, copyBlocksScript, demoPlayerMarkup, demoPlayerScript } from "./demo-player";
import { layout, releaseUrl, type LayoutUser } from "./layout";
import { threeBgMarkup, threeBgScript } from "./three-bg";

async function userOf(c: Context<AppEnv>): Promise<LayoutUser> {
  const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return null;
  return { email: session.user.email, name: session.user.name };
}

export function mountMarketing(pages: Hono<AppEnv>) {
  pages.get("/", async (c) => {
    const user = await userOf(c);
    return c.html(
      layout(
        "envy - encrypted env sync",
        `<section class="home-hero">
          ${threeBgMarkup}
          <div class="shell">
            <div class="hero-copy">
              <h1><span class="mask-line"><span>Secrets stay</span></span><span class="mask-line"><span>on the laptop.</span></span></h1>
              <p class="lede">envy encrypts <code>.env</code> before upload. This API keeps ciphertext, a version, and membership. The passphrase never arrives.</p>
              <div class="row">
                <a class="btn primary" href="#walkthrough">See it run</a>
                <a class="btn" href="/docs">Install and docs</a>
              </div>
            </div>
            <div class="hero-demo" id="walkthrough">
              ${demoPlayerMarkup}
            </div>
          </div>
        </section>

        <div class="shell">
          <section class="moves" data-reveal>
            <div class="move"><h3>Lock</h3><p>Derive once. Keychain holds the key. Passphrase stays in the team vault.</p></div>
            <div class="move"><h3>Ship</h3><p><code>envy push</code> uploads ciphertext only. Stale versions get 409.</p></div>
            <div class="move"><h3>Invite</h3><p>48-hour codes for read or write. Teammates Sign in with GitHub.</p></div>
            <div class="move"><h3>Pull</h3><p>Decrypt onto disk. Commit <code>.envy.json</code>. Never <code>.env</code>.</p></div>
          </section>
        </div>

        <section class="band">
          <div class="shell band-grid" data-reveal>
            <div>
              <h2>What the server may know</h2>
              <p>Argon2id on your machine. The 32-byte key never crosses the wire. Push sends an <code>envy1</code> AES-GCM envelope &mdash; the mailroom, not the letter.</p>
              <div class="row" style="margin-bottom:0">
                <a class="btn primary" href="${user ? "/account" : "/login"}">${user ? "Open account" : "Sign in with GitHub"}</a>
                <a class="btn" href="/pricing">Limits</a>
              </div>
            </div>
            <div data-ui class="ui-frag" aria-label="Example token list fragment">
              <div class="bar"><span class="sel">Tokens</span><span>Device</span><span>Sign out</span></div>
              <div class="rowline"><span>cli</span><span class="ok"><code>envy_pat_8f&hellip;</code></span></div>
              <div class="rowline"><span>ci</span><span class="ok"><code>envy_pat_2a&hellip;</code></span></div>
              <div class="rowline"><span>laptop</span><span>revoked</span></div>
            </div>
          </div>
        </section>

        <div class="shell">
          <section class="compact-split" data-reveal>
            <article>
              <h2>Device or PAT</h2>
              <p><code>envy login</code> opens device approval, or mint a PAT after Sign in. Tokens live in your keychain.</p>
            </article>
            <article>
              <h2>Free hosted. Or yours.</h2>
              <p>This origin is free for normal teams. Outgrow it? Deploy envy-api on your Cloudflare account.</p>
            </article>
          </section>

          <section class="faq-grid" id="faq" data-reveal>
            <div class="faq-sticky"><h2>Questions</h2></div>
            <div>
              <details class="faq" name="faq"><summary>Where do I run the install?</summary><div class="ans">macOS/Linux: <code>curl -fsSL https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.sh | sh</code>. Windows PowerShell: <code>irm https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.ps1 | iex</code>. Or Homebrew / Scoop; see Docs.</div></details>
              <details class="faq" name="faq"><summary>Does the server see my secrets?</summary><div class="ans">No. Encryption is local. The API stores ciphertext, version, and membership &mdash; not the passphrase or plaintext.</div></details>
              <details class="faq" name="faq"><summary>How does a teammate join?</summary><div class="ans">They install envy, Sign in, run <code>envy invite accept</code> with your code, then <code>envy unlock</code> with the shared passphrase and <code>envy pull</code>.</div></details>
              <details class="faq" name="faq"><summary>What if we lose the passphrase?</summary><div class="ans">Remote ciphertext cannot be recovered. Keep the passphrase in a team vault. A derived key in someone's OS keychain is the only local backup.</div></details>
              <details class="faq" name="faq"><summary>Sign in vs Tokens?</summary><div class="ans">Sign in is GitHub OAuth for this site. Tokens are PATs you mint afterward for <code>envy login --token</code>. Device approval from the CLI uses the same session.</div></details>
              <details class="faq" name="faq"><summary>Can I self-host?</summary><div class="ans">Yes. Deploy <a href="https://github.com/RovierrHQ/envy-api">envy-api</a> with your GitHub OAuth app and D1. Point the CLI at your Worker origin.</div></details>
            </div>
          </section>

          <section class="cta-block" data-reveal>
            <h2 class="big">Install envy. Sync sealed files.</h2>
            <div class="row">
              <a class="btn primary" href="/docs">Get the CLI</a>
              <a class="btn" href="${user ? "/account" : "/login"}">${user ? "Account" : "Sign in"}</a>
            </div>
          </section>

          <footer class="foot" data-reveal>
            <div class="tile">
              <p class="label">Hosted</p>
              <p>Free API on this origin. Heavy use should self-host.</p>
              <p class="fine">&copy; Rovierr &middot; MIT CLI</p>
            </div>
            <div class="tile">
              <p class="label">Navigate</p>
              <ul>
                <li><a href="/docs">Docs</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/changelog">Changelog</a></li>
                <li><a href="${releaseUrl}">Releases</a></li>
              </ul>
            </div>
            <div class="tile">
              <p class="label">Source</p>
              <p><a href="https://github.com/RovierrHQ/envy">github.com/RovierrHQ/envy</a></p>
              <p class="fine">Passphrase stays out of band</p>
            </div>
          </footer>
        </div>`,
        { user, scripts: `<script>${demoPlayerScript}</script><script>${copyBlocksScript}</script>${threeBgScript}` },
      ),
    );
  });

  pages.get("/docs", async (c) => {
    const user = await userOf(c);
    return c.html(
      layout(
        "Docs - envy",
        `<div class="shell" style="padding:2rem 0 4rem">
          <h1>Install, then sync.</h1>
          <p class="lede">Hosted API is this origin. The passphrase never arrives here.</p>
          <div class="prose">
            <h2>Install</h2>
            <p>macOS / Linux</p>
            ${codeBlock("curl -fsSL https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.sh | sh")}
            <p>Windows (PowerShell)</p>
            ${codeBlock("irm https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.ps1 | iex")}
            <p>Or <a href="${releaseUrl}">GitHub Releases</a>, <code>brew tap RovierrHQ/envy https://github.com/RovierrHQ/envy && brew install envy</code>, or Scoop. See the <a href="https://github.com/RovierrHQ/envy#install">CLI README</a>.</p>
            <h2>Hosted flow</h2>
            ${codeBlock("envy login\nenvy init\nenvy push --env dev\nenvy pull --env dev")}
            <p><code>envy init</code> defaults to this API. <code>envy login</code> opens <a href="/device">/device</a> with a code. Or <a href="${user ? "/account" : "/login"}">Sign in</a>, mint a token, then <code>envy login --token</code>.</p>
            <h2>A second person</h2>
            ${codeBlock("envy invite create --role write\nenvy invite accept envy_inv_...")}
            <p>They Sign in first, accept, unlock with the shared passphrase, then pull. Passphrase stays in your team vault.</p>
            <h2 id="self-host">Self-host</h2>
            <p>Clone <a href="https://github.com/RovierrHQ/envy-api">envy-api</a>, create a GitHub OAuth app with callback <code>https://&lt;your-worker&gt;/api/auth/callback/github</code>, then:</p>
            ${codeBlock("npx wrangler login\nnpx wrangler secret put BETTER_AUTH_SECRET\nnpx wrangler secret put GITHUB_CLIENT_ID\nnpx wrangler secret put GITHUB_CLIENT_SECRET\nnpx wrangler d1 migrations apply envy --remote\nnpx wrangler deploy")}
            <p>Point the CLI with <code>--api-url</code>. Set <code>BETTER_AUTH_URL</code> in wrangler to that origin.</p>
          </div>
        </div>`,
        { user, scripts: `<script>${copyBlocksScript}</script>` },
      ),
    );
  });

  pages.get("/pricing", async (c) => {
    const user = await userOf(c);
    return c.html(
      layout(
        "Pricing - envy",
        `<div class="shell" style="padding:2rem 0 4rem">
          <h1>Free for teams. Self-host when you outgrow it.</h1>
          <p class="lede">The CLI is open source. No card. No upgrade path on this origin.</p>
          <table class="plans">
            <thead>
              <tr>
                <th>Compare</th>
                <th class="rec">Hosted<span class="price">$0</span></th>
                <th>Self-host<span class="price">Your Cloudflare bill</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td data-label="Item">Projects you create</td><td class="rec" data-label="Hosted">5</td><td data-label="Self-host">Yours to set</td></tr>
              <tr><td data-label="Item">Secret writes</td><td class="rec" data-label="Hosted">30 per 10 minutes</td><td data-label="Self-host">Yours to set</td></tr>
              <tr><td data-label="Item">Blob size</td><td class="rec" data-label="Hosted">256 KiB per env</td><td data-label="Self-host">Yours to set</td></tr>
              <tr><td data-label="Item">Encryption</td><td class="rec" data-label="Hosted">Local, zero-knowledge</td><td data-label="Self-host">Same CLI</td></tr>
              <tr><td data-label="Item">Auth</td><td class="rec" data-label="Hosted">GitHub + device + PAT</td><td data-label="Self-host">Your OAuth app</td></tr>
              <tr>
                <td data-label="Item"></td>
                <td class="rec" data-label="Hosted"><a class="btn" style="background:var(--accent-ink);color:var(--accent)" href="${user ? "/account" : "/login"}">${user ? "Account" : "Sign in"}</a></td>
                <td data-label="Self-host"><a class="btn" href="/docs#self-host">Deploy guide</a></td>
              </tr>
            </tbody>
          </table>
        </div>`,
        { user },
      ),
    );
  });

  pages.get("/changelog", async (c) => {
    const user = await userOf(c);
    return c.html(
      layout(
        "Changelog - envy",
        `<div class="shell" style="padding:2rem 0 4rem">
          <h1>Changelog</h1>
          <div class="prose">
            <h2>0.2.1</h2>
            <ul>
              <li>Install scripts with checksums, PATH, upgrade messaging, uninstall</li>
              <li><code>envy version</code> via release ldflags</li>
              <li>Homebrew formula and Scoop manifest in the CLI repo</li>
              <li><code>envy init</code> defaults to the hosted API</li>
            </ul>
            <h2>0.2.0</h2>
            <ul>
              <li>Cross-platform install one-liners</li>
              <li>Explorer / no-TTY launch guidance on Windows</li>
            </ul>
            <h2>0.1.0</h2>
            <ul>
              <li>CLI: init, unlock, login, push, pull, invite</li>
              <li>Hosted API with GitHub sign-in, device approval, PATs</li>
              <li>Quotas: 5 projects, 30 writes / 10 minutes, 256 KiB blobs</li>
            </ul>
            <p><a href="${releaseUrl}">Release binaries</a></p>
          </div>
        </div>`,
        { user },
      ),
    );
  });
}
