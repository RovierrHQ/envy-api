import { demoPlayerStyles } from "./demo-player";

const RELEASE = "https://github.com/RovierrHQ/envy/releases/latest";

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@300&family=Stack+Sans+Text:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><!-- taste-skill-ignore: mono loaded only for pre/code and data-ui fragments -->
<style>
  :root {
    color-scheme: dark;
    --bg: #0f1f10;
    --surface: #162a17;
    --ink: #ffffff;
    --muted: #9aa39a;
    --accent: #c6f19d;
    --accent-ink: #0f1f10;
    --field-1: #000000;
    --field-1-ink: #ffffff;
    --field-2: #ffffff;
    --field-2-ink: #0f1f10;
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
    --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
    --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
    --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
    --step-display: clamp(2.75rem, 1.2rem + 5vw, 5.5rem);
    --pad: clamp(1rem, 3vw, 1.75rem);
    --max: 1120px;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 18px;
    line-height: 1.5;
    font-weight: 400;
  }
  p { color: var(--ink); font-size: 18px; max-width: 60ch; }
  .credit-note, .tile p, nav.site, .demo-step, .demo-run label { font-size: 15px; }
  a { color: inherit; }
  img { display: block; max-width: 100%; height: auto; }
  .shell { width: min(var(--max), calc(100% - 2 * var(--pad))); margin-inline: auto; }
  header.site {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 0;
    gap: 1rem;
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
    gap: 0.85rem 1.15rem;
    font-size: var(--step-small);
  }
  nav.site a { text-decoration: none; color: var(--muted); }
  nav.site a:hover { color: var(--ink); }
  nav.site .nav-cta {
    color: var(--accent-ink);
    background: var(--accent);
    padding: 0.45rem 0.75rem;
    text-decoration: none;
  }
  nav.site .nav-account { color: var(--ink); max-width: 14rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  nav.site .nav-signout {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
    font: inherit;
    font-size: var(--step-small);
    cursor: pointer;
  }
  nav.site .nav-signout:hover { color: var(--ink); }
  h1, h2, h3 {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    letter-spacing: -0.022em;
    line-height: 1.05;
    margin: 0 0 0.65rem;
  }
  h1 { font-size: clamp(2.4rem, 1.1rem + 4vw, 4.5rem); max-width: 11ch; }
  h2 { font-size: var(--step-head); }
  h3 { font-size: var(--step-lead); }
  .lede {
    max-width: 36rem;
    color: var(--ink);
    font-size: clamp(1.15rem, 1rem + 0.5vw, 1.35rem);
    line-height: 1.35;
    margin: 0 0 1.25rem;
    opacity: 0.88;
  }
  .row { display: flex; flex-wrap: wrap; gap: 0.65rem; margin: 1.25rem 0 1.75rem; }
  .btn {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-size: var(--step-small);
    font-weight: 500;
    padding: 0.7rem 0.95rem;
    background: var(--surface);
    color: var(--ink);
    border: 0;
    cursor: pointer;
  }
  .btn.primary { background: var(--accent); color: var(--accent-ink); }
  .btn:active { transform: scale(0.97); }
  pre, code { font-family: "IBM Plex Mono", ui-monospace, monospace; }
  pre {
    background: var(--field-1);
    color: var(--field-1-ink);
    padding: 1rem 1.1rem;
    overflow: auto;
    font-size: 0.8125rem;
    line-height: 1.55;
    margin: 0.75rem 0 1.25rem;
  }
  code { font-size: 0.9em; }
  .prose p { color: var(--muted); max-width: 62ch; }
  .prose h2 { margin-top: 2.5rem; }
  input, textarea {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 0;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
  }
  button.solid {
    margin-top: 0.75rem;
    background: var(--accent);
    color: var(--accent-ink);
    border: 0;
    padding: 0.6rem 0.95rem;
    cursor: pointer;
    font: inherit;
    font-weight: 500;
    font-size: var(--step-small);
  }
  button.solid:active { transform: scale(0.97); }
  .err { color: #ffb4a8; }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(1.5rem, 4vw, 3rem);
    align-items: end;
    padding: 1.5rem 0 2.5rem;
  }
  .hero-copy { padding-bottom: 0.5rem; }
  .hero-demo { min-width: 0; }
  @media (max-width: 860px) {
    .hero { grid-template-columns: 1fr; }
    h1 { max-width: none; }
  }
  .split {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: clamp(1.25rem, 3vw, 2.5rem);
    align-items: start;
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }
  .split.reverse { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
  .split.reverse .split-copy { order: 2; }
  @media (max-width: 800px) {
    .split, .split.reverse { grid-template-columns: 1fr; }
    .split.reverse .split-copy { order: 0; }
  }
  .split-copy p { color: var(--ink); max-width: 36ch; margin: 0 0 0.85rem; opacity: 0.9; }
  .band {
    background: var(--field-1);
    color: var(--field-1-ink);
    padding: clamp(3rem, 7vw, 5rem) 0;
  }
  .band .shell > h2 { color: var(--field-1-ink); }
  .band p { color: #b7beb7; }
  .fields {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  @media (max-width: 800px) { .fields { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .fields { grid-template-columns: 1fr; } }
  .field {
    background: var(--surface);
    padding: 1.15rem 1rem 1.35rem;
    min-height: 9.5rem;
  }
  .field h3 { font-size: var(--step-lead); margin-bottom: 0.4rem; }
  .field p { margin: 0; color: var(--ink); font-size: 16px; opacity: 0.88; max-width: none; }
  .pic {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--surface);
  }
  .pic.tall { aspect-ratio: 3 / 4; }
  .pic.wide { aspect-ratio: 16 / 9; }
  .credit-note { font-size: var(--step-small); color: var(--muted); margin-top: 0.5rem; }
  .plans {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0 0;
    font-size: 1.05rem;
  }
  .plans th, .plans td {
    text-align: left;
    padding: 0.85rem 1rem;
    vertical-align: top;
  }
  .plans thead th { font-family: "Stack Sans Headline", system-ui, sans-serif; font-weight: 300; font-size: clamp(1.4rem, 2.5vw, 2rem); letter-spacing: -0.02em; }
  .plans thead .price { font-size: var(--step-body); font-family: "Stack Sans Text", system-ui, sans-serif; font-weight: 400; color: var(--muted); display: block; margin-top: 0.25rem; }
  .plans tbody tr:nth-child(even) { background: var(--surface); }
  .plans .rec { background: var(--accent); color: var(--accent-ink); }
  .plans .rec .price { color: #3a4f2a; }
  @media (max-width: 700px) {
    .plans, .plans thead, .plans tbody, .plans th, .plans td, .plans tr { display: block; width: 100%; }
    .plans thead { display: none; }
    .plans tr { margin-bottom: 1rem; background: var(--surface); padding: 1rem; }
    .plans td { padding: 0.35rem 0; }
    .plans td::before { content: attr(data-label); display: block; color: var(--muted); font-size: var(--step-small); }
  }
  .faq-grid {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 1.5rem;
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }
  @media (max-width: 800px) { .faq-grid { grid-template-columns: 1fr; } }
  .faq-sticky { position: sticky; top: 1.25rem; align-self: start; }
  @media (max-width: 800px) { .faq-sticky { position: static; } }
  details.faq {
    background: var(--surface);
    margin: 0 0 0.5rem;
    padding: 0;
  }
  details.faq summary {
    list-style: none;
    cursor: pointer;
    padding: 1.15rem 1.1rem;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  details.faq summary::-webkit-details-marker { display: none; }
  details.faq summary::after { content: "+"; font-weight: 400; color: var(--muted); }
  details.faq[open] { background: var(--accent); color: var(--accent-ink); }
  details.faq[open] summary::after { content: "–"; color: var(--accent-ink); }
  details.faq .ans { padding: 0 1.1rem 1.15rem; max-width: 52ch; font-size: 1rem; }
  details.faq[open] .ans { color: #2a3a22; }
  .cta-block { padding: clamp(3.5rem, 9vw, 6.5rem) 0; }
  .cta-block h2.big {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    letter-spacing: -0.02em;
    line-height: 1.1;
    max-width: 14ch;
    margin: 0 0 1rem;
  }
  .foot {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 0.5rem;
    padding: 0 0 2.5rem;
  }
  .tile {
    background: var(--surface);
    padding: 1.15rem;
    min-height: 8rem;
  }
  .tile.span-4 { grid-column: span 4; }
  .tile.span-3 { grid-column: span 3; }
  .tile.span-2 { grid-column: span 2; }
  .tile.span-8 { grid-column: span 8; min-height: 11rem; display: grid; place-items: center; background: var(--field-1); color: var(--field-1-ink); }
  .tile.span-4.accent {
    grid-column: span 4;
    background: var(--accent);
    color: var(--accent-ink);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 11rem;
  }
  .tile .wm {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-weight: 300;
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    letter-spacing: -0.03em;
    line-height: 0.9;
  }
  .tile p, .tile ul { margin: 0; color: var(--muted); font-size: var(--step-small); }
  .tile.accent p { color: #3a4f2a; }
  .tile ul { list-style: none; padding: 0; }
  .tile li { margin: 0.25rem 0; }
  .tile a { text-decoration: none; }
  .credits {
    font-size: var(--step-small);
    color: var(--muted);
    padding: 0 0 3rem;
    max-width: 70ch;
  }
  @media (max-width: 800px) {
    .foot { grid-template-columns: 1fr 1fr; }
    .tile.span-4, .tile.span-3, .tile.span-2, .tile.span-8, .tile.span-4.accent { grid-column: span 2; }
  }
  [data-reveal] {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out);
  }
  [data-reveal].in { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1; transform: none; transition: none; }
  }
  .ui-frag {
    background: #121510;
    padding: 1rem;
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }
  .ui-frag code, .ui-frag .ok {
    font-family: "IBM Plex Mono", ui-monospace, monospace; /* taste-skill-ignore: literal token prefixes */
  }
  .ui-frag .bar { display: flex; gap: 0.5rem; color: var(--muted); margin-bottom: 0.75rem; font-size: 11px; }
  .ui-frag .sel { color: var(--accent); }
  .ui-frag .rowline { display: flex; justify-content: space-between; gap: 1rem; padding: 0.55rem 0.35rem; }
  .ui-frag .rowline + .rowline { background: #162216; }
  .ui-frag .ok { color: var(--accent); }
  .mask-line {
    display: block;
    overflow: hidden;
  }
  .mask-line > span {
    display: block;
    transform: translateY(110%);
    transition: transform 900ms var(--ease-out);
  }
  .mask-line.in > span { transform: none; }
  .mask-line:nth-child(2) > span { transition-delay: 110ms; }
  ${demoPlayerStyles}
  ${extraStyles}
</style>
<header class="site shell">
  <a class="mark" href="/">envy</a>
  <nav class="site" aria-label="Primary">
    <a href="/docs">Docs</a>
    <a href="/pricing">Pricing</a>
    <a href="/changelog">Changelog</a>
    ${authNav(user)}
  </nav>
</header>
<main>
${body}
</main>
${scripts}
<script>
(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add('in');
  }, { threshold: 0.18 });
  document.querySelectorAll('[data-reveal], .mask-line').forEach((n) => io.observe(n));
})();
</script>
</html>`;
}

export const releaseUrl = RELEASE;
