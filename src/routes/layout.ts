const RELEASE = "https://github.com/RovierrHQ/envy/releases/latest";

export function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,450;6..72,560&display=swap" rel="stylesheet">
<style>
  :root { color-scheme: dark; --bg:#10120f; --ink:#f4f1e8; --muted:#b7b2a6; --line:#2a2d27; --accent:#d6ff4a; --card:#181b16; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.5 "Newsreader", Georgia, serif; }
  a { color:inherit; }
  header, main, footer { width:min(980px, calc(100% - 2.5rem)); margin-inline:auto; }
  header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 0; }
  nav { display:flex; gap:1.1rem; font-family:"IBM Plex Mono", ui-monospace, monospace; font-size:13px; }
  nav a { color:var(--muted); text-decoration:none; }
  nav a:hover { color:var(--ink); }
  .mark { font-family:"IBM Plex Mono", ui-monospace, monospace; letter-spacing:.08em; text-decoration:none; }
  h1 { font-size:clamp(2.6rem, 6vw, 4.4rem); font-weight:560; letter-spacing:-.03em; line-height:.95; margin:.2rem 0 1rem; }
  h2 { font-size:1.7rem; font-weight:560; letter-spacing:-.02em; }
  .lede { max-width:38rem; color:var(--muted); font-size:1.2rem; }
  .row { display:flex; flex-wrap:wrap; gap:.6rem; margin:1.5rem 0 2rem; }
  .btn { font-family:"IBM Plex Mono", ui-monospace, monospace; font-size:13px; text-decoration:none; border:1px solid var(--line); padding:.65rem .85rem; background:var(--card); }
  .btn.primary { background:var(--accent); color:#14160f; border-color:var(--accent); }
  pre, code { font-family:"IBM Plex Mono", ui-monospace, monospace; }
  pre { background:var(--card); border:1px solid var(--line); padding:1rem 1.1rem; overflow:auto; font-size:13px; line-height:1.55; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin:2rem 0 3rem; }
  .card { border-top:1px solid var(--line); padding-top:.8rem; }
  .card p, .prose p { color:var(--muted); }
  .kicker { font-family:"IBM Plex Mono", ui-monospace, monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
  input, button { font:inherit; }
  input { width:100%; padding:.6rem .7rem; border:1px solid var(--line); background:#0d0f0c; color:var(--ink); }
  button { margin-top:.75rem; background:var(--accent); color:#14160f; border:0; padding:.55rem .9rem; cursor:pointer; font-family:"IBM Plex Mono", ui-monospace, monospace; font-size:13px; }
  footer { padding:2.5rem 0 3rem; color:var(--muted); font-family:"IBM Plex Mono", ui-monospace, monospace; font-size:12px; }
  ul { padding-left:1.1rem; }
  li { margin:.35rem 0; color:var(--muted); }
  .err { color:#ffb4a8; }
</style>
<header>
  <a class="mark" href="/">ENVY</a>
  <nav>
    <a href="/docs">Docs</a>
    <a href="/pricing">Pricing</a>
    <a href="/changelog">Changelog</a>
    <a href="/settings/tokens">Sign in</a>
  </nav>
</header>
<main>
${body}
</main>
<footer>Free hosted API on this origin. Heavy use should <a href="/docs#self-host">self-host</a>.</footer>
</html>`;
}

export const releaseUrl = RELEASE;
