import { demoPlayerStyles } from "./demo-player";

export const releaseUrl = "https://github.com/RovierrHQ/envy/releases/latest";

export type LayoutUser = { email: string; name?: string | null } | null;

export type LayoutOpts = {
  styles?: string;
  scripts?: string;
  user?: LayoutUser;
};

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

function authNav(user: LayoutUser) {
  if (user) {
    const label = escapeHtml(user.name || user.email);
    return `<a class="nav-account" href="/account">${label}</a>
    <button type="button" class="nav-signout" id="nav-signout">Sign out</button>
    <script>
      document.getElementById('nav-signout')?.addEventListener('click', async () => {
        await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
        location.href = '/';
      });
    </script>`;
  }
  return `<a class="nav-cta" href="/login">Sign in</a>`;
}

export function layout(title: string, body: string, opts?: LayoutOpts) {
  const extraStyles = opts?.styles ?? "";
  const scripts = opts?.scripts ?? "";
  const user = opts?.user ?? null;
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<script>
(() => {
  const k = "envy-theme";
  const saved = localStorage.getItem(k);
  const preferLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  if (saved === "light" || (!saved && preferLight)) document.documentElement.classList.add("light");
})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@300&family=Stack+Sans+Text:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><!-- taste-skill-ignore: mono loaded only for pre/code and data-ui fragments -->
<style>
  :root {
    color-scheme: dark;
    --bg: #0a1228;
    --surface: #121c36;
    --ink: #e8f0ff;
    --muted: #8fa3c4;
    --accent: #7eb6ff;
    --accent-ink: #0a1228;
    --field-1: #060b18;
    --field-1-ink: #e8f0ff;
    --field-2: #d6ebff;
    --field-2-ink: #0a1228;
    --glow: rgba(126, 182, 255, 0.14);
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-move: cubic-bezier(0.77, 0, 0.175, 1);
    --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
    --step-body: clamp(1rem, 0.95rem + 0.2vw, 1.0625rem);
    --step-lead: clamp(1.15rem, 1.05rem + 0.45vw, 1.35rem);
    --step-head: clamp(1.65rem, 1.2rem + 1.8vw, 2.4rem);
    --pad: clamp(1rem, 2.5vw, 1.5rem);
    --max: 1040px;
  }
  html.light {
    color-scheme: light;
    --bg: #e8f4ff;
    --surface: #ffffff;
    --ink: #0a1a36;
    --muted: #4a6a8a;
    --accent: #3d8fd9;
    --accent-ink: #ffffff;
    --field-1: #0a1228;
    --field-1-ink: #e8f0ff;
    --field-2: #0a1228;
    --field-2-ink: #e8f0ff;
    --glow: rgba(61, 143, 217, 0.12);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
  }
  p { color: var(--ink); font-size: 16px; max-width: 58ch; margin: 0 0 0.75rem; }
  .credit-note, .tile p, nav.site, .demo-step, .demo-run label { font-size: 14px; }
  a { color: inherit; }
  img { display: block; max-width: 100%; height: auto; }
  .shell { width: min(var(--max), calc(100% - 2 * var(--pad))); margin-inline: auto; }
  header.site {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 0;
    gap: 1rem;
    position: relative;
    z-index: 2;
  }
  .mark {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    text-decoration: none;
  }
  nav.site {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem 1rem;
    font-size: var(--step-small);
  }
  nav.site a { text-decoration: none; color: var(--muted); transition: color 160ms var(--ease-out); }
  nav.site a:hover { color: var(--ink); }
  nav.site .nav-cta {
    color: var(--accent-ink);
    background: var(--accent);
    padding: 0.4rem 0.7rem;
    text-decoration: none;
    transition: transform 140ms var(--ease-out), opacity 160ms ease;
  }
  nav.site .nav-cta:active { transform: scale(0.97); }
  nav.site .nav-account { color: var(--ink); max-width: 12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  nav.site .nav-signout, .theme-toggle {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
    font: inherit;
    font-size: var(--step-small);
    cursor: pointer;
    transition: color 160ms var(--ease-out), transform 140ms var(--ease-out);
  }
  nav.site .nav-signout:hover, .theme-toggle:hover { color: var(--ink); }
  .theme-toggle:active { transform: scale(0.97); }
  h1, h2, h3 {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    letter-spacing: -0.022em;
    line-height: 1.08;
    margin: 0 0 0.5rem;
  }
  h1 { font-size: clamp(2.1rem, 1rem + 3.2vw, 3.4rem); max-width: 12ch; }
  h2 { font-size: var(--step-head); }
  h3 { font-size: var(--step-lead); }
  .lede {
    max-width: 34rem;
    color: var(--ink);
    font-size: clamp(1.05rem, 0.95rem + 0.35vw, 1.2rem);
    line-height: 1.4;
    margin: 0 0 1rem;
    opacity: 0.9;
  }
  .row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.85rem 0 1.1rem; }
  .btn {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-size: var(--step-small);
    font-weight: 500;
    padding: 0.55rem 0.85rem;
    background: var(--surface);
    color: var(--ink);
    border: 0;
    cursor: pointer;
    transition: transform 140ms var(--ease-out), opacity 160ms ease;
  }
  .btn.primary { background: var(--accent); color: var(--accent-ink); }
  .btn:active { transform: scale(0.97); }
  @media (hover: hover) and (pointer: fine) {
    .btn:hover { opacity: 0.92; }
  }
  pre, code { font-family: "IBM Plex Mono", ui-monospace, monospace; }
  pre {
    background: var(--field-1);
    color: var(--field-1-ink);
    padding: 0.85rem 1rem;
    overflow: auto;
    font-size: 0.8125rem;
    line-height: 1.55;
    margin: 0.5rem 0 1rem;
  }
  code { font-size: 0.9em; }
  .prose p { color: var(--muted); max-width: 62ch; }
  .prose h2 { margin-top: 1.75rem; }
  input, textarea {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border: 0;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
  }
  button.solid {
    margin-top: 0.65rem;
    background: var(--accent);
    color: var(--accent-ink);
    border: 0;
    padding: 0.55rem 0.85rem;
    cursor: pointer;
    font: inherit;
    font-weight: 500;
    font-size: var(--step-small);
    transition: transform 140ms var(--ease-out);
  }
  button.solid:active { transform: scale(0.97); }
  .err { color: #ff9b8a; }

  /* Homepage hero + webgl */
  .home-hero {
    position: relative;
    padding: 0.75rem 0 1.25rem;
    overflow: hidden;
  }
  #envy-webgl {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.85;
  }
  html.light #envy-webgl { opacity: 0.72; }
  .home-hero .shell {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
    gap: clamp(1rem, 3vw, 2rem);
    align-items: start;
  }
  @media (max-width: 860px) {
    .home-hero .shell { grid-template-columns: 1fr; }
    h1 { max-width: none; }
    #envy-webgl { height: 48%; top: 0; bottom: auto; opacity: 0.5; }
  }
  .hero-copy { padding-top: 0.35rem; }
  .hero-demo { min-width: 0; }

  .moves {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    padding: 1.75rem 0 0.5rem;
  }
  @media (max-width: 800px) { .moves { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .moves { grid-template-columns: 1fr; } }
  .move {
    background: var(--surface);
    padding: 0.95rem 0.9rem 1.05rem;
    box-shadow: 0 0 0 1px var(--glow);
    transition: transform 180ms var(--ease-out);
  }
  .move:active { transform: scale(0.985); }
  .move h3 { font-size: 1.15rem; margin-bottom: 0.3rem; }
  .move p { margin: 0; color: var(--muted); font-size: 14px; max-width: none; }

  .band {
    background: var(--field-1);
    color: var(--field-1-ink);
    padding: 1.75rem 0;
    margin: 1.5rem 0 0;
  }
  .band .shell > h2 { color: var(--field-1-ink); margin-bottom: 0.75rem; }
  .band p { color: #a8b8d4; }
  .band-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1.25rem;
    align-items: center;
  }
  @media (max-width: 700px) { .band-grid { grid-template-columns: 1fr; } }
  .ui-frag {
    background: #0e1628;
    padding: 0.85rem;
    font-size: 13px;
    line-height: 1.45;
  }
  html.light .ui-frag { background: #121c36; color: #e8f0ff; }
  .ui-frag code, .ui-frag .ok {
    font-family: "IBM Plex Mono", ui-monospace, monospace; /* taste-skill-ignore: literal token prefixes */
  }
  .ui-frag .bar { display: flex; gap: 0.5rem; color: var(--muted); margin-bottom: 0.55rem; font-size: 11px; }
  .ui-frag .sel { color: var(--accent); }
  .ui-frag .rowline { display: flex; justify-content: space-between; gap: 1rem; padding: 0.4rem 0.3rem; }
  .ui-frag .rowline + .rowline { background: rgba(126, 182, 255, 0.06); }
  .ui-frag .ok { color: var(--accent); }

  .compact-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1.75rem 0 0.5rem;
  }
  @media (max-width: 700px) { .compact-split { grid-template-columns: 1fr; } }
  .compact-split article {
    background: var(--surface);
    padding: 1.1rem 1rem;
  }
  .compact-split p { color: var(--muted); margin: 0; font-size: 15px; }

  .faq-grid {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
    gap: 1.25rem;
    padding: 2rem 0 1rem;
  }
  @media (max-width: 800px) { .faq-grid { grid-template-columns: 1fr; } }
  .faq-sticky { position: sticky; top: 1rem; align-self: start; }
  @media (max-width: 800px) { .faq-sticky { position: static; } }
  details.faq {
    background: var(--surface);
    margin: 0 0 0.4rem;
    padding: 0;
  }
  details.faq summary {
    list-style: none;
    cursor: pointer;
    padding: 0.85rem 0.95rem;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    transition: background 160ms ease;
  }
  details.faq summary::-webkit-details-marker { display: none; }
  details.faq summary::after { content: "+"; font-weight: 400; color: var(--muted); }
  details.faq[open] { background: var(--accent); color: var(--accent-ink); }
  details.faq[open] summary::after { content: "–"; color: var(--accent-ink); }
  details.faq .ans { padding: 0 0.95rem 0.9rem; max-width: 52ch; font-size: 0.95rem; }
  details.faq[open] .ans { color: var(--accent-ink); opacity: 0.9; }

  .cta-block { padding: 2rem 0 1.25rem; }
  .cta-block h2.big {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    letter-spacing: -0.02em;
    line-height: 1.12;
    max-width: 16ch;
    margin: 0 0 0.85rem;
  }
  .foot {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    padding: 0 0 2.5rem;
    border-top: 1px solid var(--glow);
    margin-top: 0.5rem;
    padding-top: 1.25rem;
  }
  .tile {
    background: var(--surface);
    padding: 1rem 1.05rem;
    min-height: 7.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .tile .label {
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0;
  }
  .tile p, .tile ul { margin: 0; color: var(--ink); font-size: var(--step-small); opacity: 0.88; }
  .tile ul { list-style: none; padding: 0; display: grid; gap: 0.35rem; }
  .tile a { text-decoration: none; color: var(--ink); transition: color 160ms var(--ease-out); }
  .tile a:hover { color: var(--accent); }
  .tile .fine { margin-top: auto; color: var(--muted); opacity: 1; font-size: 12px; }
  @media (max-width: 700px) {
    .foot { grid-template-columns: 1fr; }
    .tile { min-height: 0; }
  }

  .plans {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0 0;
    font-size: 1rem;
  }
  .plans th, .plans td {
    text-align: left;
    padding: 0.7rem 0.85rem;
    vertical-align: top;
  }
  .plans thead th { font-family: "Stack Sans Headline", system-ui, sans-serif; font-weight: 300; font-size: clamp(1.25rem, 2vw, 1.75rem); letter-spacing: -0.02em; }
  .plans thead .price { font-size: var(--step-body); font-family: "Stack Sans Text", system-ui, sans-serif; font-weight: 400; color: var(--muted); display: block; margin-top: 0.2rem; }
  .plans tbody tr:nth-child(even) { background: var(--surface); }
  .plans .rec { background: var(--accent); color: var(--accent-ink); }
  .plans .rec .price { color: var(--accent-ink); opacity: 0.8; }
  @media (max-width: 700px) {
    .plans, .plans thead, .plans tbody, .plans th, .plans td, .plans tr { display: block; width: 100%; }
    .plans thead { display: none; }
    .plans tr { margin-bottom: 0.75rem; background: var(--surface); padding: 0.85rem; }
    .plans td { padding: 0.3rem 0; }
    .plans td::before { content: attr(data-label); display: block; color: var(--muted); font-size: var(--step-small); }
  }

  [data-reveal] {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 420ms var(--ease-out), transform 420ms var(--ease-out);
  }
  [data-reveal].in { opacity: 1; transform: none; }
  .mask-line { display: block; overflow: hidden; }
  .mask-line > span {
    display: block;
    transform: translateY(105%);
    transition: transform 520ms var(--ease-out);
  }
  .mask-line.in > span { transform: none; }
  .mask-line:nth-child(2) > span { transition-delay: 70ms; }
  @media (prefers-reduced-motion: reduce) {
    [data-reveal], .mask-line > span { opacity: 1; transform: none; transition: none; }
  }
  ${demoPlayerStyles}
  ${extraStyles}
</style>
<header class="site shell">
  <a class="mark" href="/">envy</a>
  <nav class="site" aria-label="Primary">
    <a href="/docs">Docs</a>
    <a href="/pricing">Pricing</a>
    <a href="/changelog">Changelog</a>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme">Theme</button>
    ${authNav(user)}
  </nav>
</header>
<main>
${body}
</main>
${scripts}
<script>
(() => {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const apply = () => { btn && (btn.textContent = root.classList.contains("light") ? "Dark" : "Light"); };
  apply();
  btn?.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("envy-theme", root.classList.contains("light") ? "light" : "dark");
    apply();
  });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
  }, { threshold: 0.14 });
  document.querySelectorAll("[data-reveal], .mask-line").forEach((n) => io.observe(n));
})();
</script>
</html>`;
}
