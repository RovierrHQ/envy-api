/** Interactive terminal demo for the marketing homepage. */

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

export const demoPlayerStyles = `
  .demo {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-move: cubic-bezier(0.77, 0, 0.175, 1);
    margin: 0;
    background: var(--field-1, #060b18);
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(10, 18, 40, 0.35);
    position: relative;
  }
  .demo-caption {
    display: grid;
    gap: .3rem;
    padding: .85rem 1rem .7rem;
    background: var(--surface, #121c36);
  }
  .demo-step {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    color: var(--accent);
    margin: 0;
  }
  .demo-title {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 300;
    letter-spacing: -.02em;
    margin: 0;
    line-height: 1.1;
  }
  .demo-detail {
    margin: 0;
    color: var(--muted);
    font-size: .95rem;
    max-width: 40rem;
  }
  .demo-run {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .45rem;
    margin-top: .4rem;
  }
  .demo-run label {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    color: var(--muted);
  }
  .demo-run code {
    font-size: 12px;
    background: #060b18;
    padding: .3rem .5rem;
    color: #e8f0ff;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .demo-copy, .copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: .35rem;
    border: 0;
    background: #060b18;
    color: var(--muted);
    cursor: pointer;
    transition: color 160ms var(--ease-out), transform 140ms var(--ease-out), background 160ms ease;
  }
  .demo-copy:hover, .copy-btn:hover { color: var(--ink); }
  .demo-copy:active, .copy-btn:active { transform: scale(0.97); }
  .demo-copy[data-ok], .copy-btn[data-ok] { color: var(--accent); }
  .demo-stage-wrap {
    position: relative;
    height: min(300px, 46vw);
    background: #060b18;
    overflow: hidden;
    cursor: pointer;
  }
  .demo-stage-wrap:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
  .demo-stage {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 0.75rem 1rem;
    transform-origin: 50% 50%;
    transition: transform 360ms var(--ease-move);
    will-change: transform;
  }
  .demo-machine {
    width: 100%;
    max-width: 560px;
    background: #0e1628;
    transition: opacity 240ms var(--ease-out);
  }
  .demo-machine[data-who="teammate"] { outline: 1px solid #2a3a5a; }
  .demo-chrome {
    display: flex;
    align-items: center;
    gap: .45rem;
    padding: .4rem .65rem;
    background: #121c36;
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 12px;
    color: var(--muted);
  }
  .demo-dot { width: 8px; height: 8px; border-radius: 50%; background: #2a3a5a; }
  .demo-dot:nth-child(1) { background: #ff5f57; }
  .demo-dot:nth-child(2) { background: #febc2e; }
  .demo-dot:nth-child(3) { background: #28c840; }
  .demo-chrome-title { margin-left: .35rem; }
  .demo-term {
    margin: 0;
    padding: .65rem .8rem .85rem;
    min-height: 168px;
    font-family: "IBM Plex Mono", ui-monospace, monospace; /* taste-skill-ignore: data-ui terminal body */
    font-size: 11.5px;
    line-height: 1.5;
    color: #c8d6ef;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .demo-term .prompt { color: var(--accent); }
  .demo-term .dim { color: #6a7e9e; }
  .demo-term .ok { color: var(--accent); }
  .demo-term .warn { color: #e6c07b; }
  .demo-term .cursor {
    display: inline-block;
    width: .55ch;
    height: 1.05em;
    margin-left: 1px;
    background: var(--accent);
    vertical-align: text-bottom;
    animation: demo-blink 1s steps(1) infinite;
  }
  @keyframes demo-blink { 50% { opacity: 0; } }
  .demo-progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: #1a2744;
    pointer-events: none;
  }
  .demo-progress > i {
    display: block;
    height: 100%;
    width: 0%;
    background: var(--accent);
    transition: width 220ms var(--ease-out);
  }
  .demo-paused-hint {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(6, 11, 24, 0.45);
    color: #e8f0ff;
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms var(--ease-out);
  }
  .demo-stage-wrap[data-paused] .demo-paused-hint { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .demo-stage, .demo-progress > i { transition: none !important; }
    .demo-term .cursor { animation: none; opacity: 1; }
  }

  /* Shared copyable code blocks (docs, etc.) */
  .code-block {
    position: relative;
    margin: 0.5rem 0 1rem;
  }
  .code-block pre {
    margin: 0;
    padding-right: 2.5rem;
  }
  .code-block .copy-btn {
    position: absolute;
    top: 0.55rem;
    right: 0.55rem;
    background: rgba(18, 28, 54, 0.9);
    color: #8fa3c4;
  }
  html.light .code-block .copy-btn {
    background: rgba(10, 18, 40, 0.85);
    color: #a8d4ff;
  }
`;

export const demoPlayerMarkup = `
<figure class="demo" id="envy-demo" data-ui aria-label="Interactive envy terminal walkthrough">
  <figcaption class="demo-caption">
    <p class="demo-step" data-demo-step>Part 1 of 7</p>
    <h2 class="demo-title" data-demo-title>Install the CLI</h2>
    <p class="demo-detail" data-demo-detail>One-liner. No Go toolchain required.</p>
    <div class="demo-run">
      <label>Run this</label>
      <code data-demo-cmd></code>
      <button type="button" class="demo-copy" data-demo-copy aria-label="Copy command">${COPY_ICON}</button>
    </div>
  </figcaption>
  <div class="demo-stage-wrap" data-demo-stage-wrap tabindex="0" role="button" aria-label="Pause or resume demo">
    <div class="demo-stage" data-demo-stage>
      <div class="demo-machine" data-demo-machine data-who="you">
        <div class="demo-chrome">
          <span class="demo-dot"></span><span class="demo-dot"></span><span class="demo-dot"></span>
          <span class="demo-chrome-title" data-demo-who>you@laptop - zsh</span>
        </div>
        <pre class="demo-term" data-demo-term aria-live="polite"></pre>
      </div>
    </div>
    <div class="demo-paused-hint">Paused · click to play</div>
    <div class="demo-progress" aria-hidden="true"><i data-demo-bar></i></div>
  </div>
</figure>
`;

export const demoPlayerScript = `
(function () {
  const root = document.getElementById("envy-demo");
  if (!root) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = {
    step: root.querySelector("[data-demo-step]"),
    title: root.querySelector("[data-demo-title]"),
    detail: root.querySelector("[data-demo-detail]"),
    cmd: root.querySelector("[data-demo-cmd]"),
    copy: root.querySelector("[data-demo-copy]"),
    wrap: root.querySelector("[data-demo-stage-wrap]"),
    stage: root.querySelector("[data-demo-stage]"),
    machine: root.querySelector("[data-demo-machine]"),
    who: root.querySelector("[data-demo-who]"),
    term: root.querySelector("[data-demo-term]"),
    bar: root.querySelector("[data-demo-bar]"),
  };

  const scenes = [
    {
      title: "Install the CLI",
      detail: "macOS / Linux one-liner. On Windows use the PowerShell install script from the docs.",
      cmd: "curl -fsSL https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.sh | sh",
      who: "you",
      zoom: { s: 1, x: 0, y: 0 },
      lines: [
        { kind: "dim", text: "# from any directory" },
        { kind: "in", text: "curl -fsSL https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.sh | sh" },
        { kind: "out", text: "Installing envy v0.2.1 (darwin/arm64) -> ~/.local/bin" },
        { kind: "ok", text: "Installed ~/.local/bin/envy (0.2.1)" },
        { kind: "dim", text: "Open a new terminal, then verify:" },
        { kind: "in", text: "envy version" },
        { kind: "out", text: "0.2.1" },
      ],
      hold: 1600,
    },
    {
      title: "Sign in to the hosted API",
      detail: "Device login opens a browser. Approve the code. The CLI stores a token in your OS keychain.",
      cmd: "envy login",
      who: "you",
      zoom: { s: 1.04, x: 0, y: 0 },
      lines: [
        { kind: "in", text: "envy login" },
        { kind: "out", text: "Open https://envy-api.rovierr.workers.dev/device" },
        { kind: "warn", text: "Code: WX7K-9P2M" },
        { kind: "dim", text: "Waiting for approval..." },
        { kind: "ok", text: "Logged in; token stored in OS keyring" },
      ],
      hold: 1400,
    },
    {
      title: "Initialize the project",
      detail: "Creates .envy.json (commit this). Defaults to the hosted API and registers a project.",
      cmd: "envy init",
      who: "you",
      zoom: { s: 1.03, x: 0, y: 0 },
      lines: [
        { kind: "dim", text: "~/acme-api" },
        { kind: "in", text: "envy init" },
        { kind: "dim", text: "Project passphrase: ********" },
        { kind: "dim", text: "Confirm passphrase: ********" },
        { kind: "ok", text: "Initialized .envy.json (project_id=prj_8f2a...)" },
        { kind: "dim", text: "Share the passphrase out-of-band (1Password), never in git." },
      ],
      hold: 1500,
    },
    {
      title: "Encrypt and push",
      detail: "Plaintext stays local. Only ciphertext + version hit the server.",
      cmd: "envy push --env dev",
      who: "you",
      zoom: { s: 1.05, x: 0, y: 0 },
      lines: [
        { kind: "in", text: "printf 'DATABASE_URL=postgres://...\\\\nSTRIPE_KEY=sk_...\\\\n' > .env" },
        { kind: "in", text: "envy push --env dev" },
        { kind: "ok", text: "Pushed .env -> env=dev version=1" },
      ],
      hold: 1400,
    },
    {
      title: "Invite a teammate",
      detail: "48-hour single-use code. Role can be read or write.",
      cmd: "envy invite create --role write",
      who: "you",
      zoom: { s: 1.03, x: 0, y: 0 },
      lines: [
        { kind: "in", text: "envy invite create --role write" },
        { kind: "ok", text: "Invite envy_inv_3c9k... (expires in 48h)" },
        { kind: "dim", text: "Send code + passphrase via your team vault." },
      ],
      hold: 1300,
    },
    {
      title: "Teammate joins",
      detail: "They install envy, log in, accept the invite, then unlock with the shared passphrase.",
      cmd: "envy invite accept envy_inv_... && envy unlock",
      who: "teammate",
      zoom: { s: 1.04, x: 0, y: 0 },
      lines: [
        { kind: "dim", text: "# on a second machine, after install + login" },
        { kind: "in", text: "envy invite accept envy_inv_3c9k..." },
        { kind: "ok", text: "Joined project prj_8f2a..." },
        { kind: "in", text: "envy unlock" },
        { kind: "dim", text: "Project passphrase: ********" },
        { kind: "ok", text: "Project key stored in OS keyring" },
      ],
      hold: 1500,
    },
    {
      title: "Pull secrets locally",
      detail: "Decrypts onto disk. Commit .envy.json. Never commit .env.",
      cmd: "envy pull --env dev",
      who: "teammate",
      zoom: { s: 1.05, x: 0, y: 0 },
      lines: [
        { kind: "in", text: "git clone git@github.com:acme/api.git && cd api" },
        { kind: "in", text: "envy pull --env dev" },
        { kind: "ok", text: "Pulled env=dev version=1 -> .env" },
        { kind: "in", text: "grep -c . .env" },
        { kind: "out", text: "2" },
      ],
      hold: 1800,
    },
  ];

  let idx = 0;
  let playing = true;
  let runToken = 0;
  let started = false;
  const copyIcon = el.copy.innerHTML;

  function setPausedUi(paused) {
    if (paused) el.wrap.setAttribute("data-paused", "");
    else el.wrap.removeAttribute("data-paused");
    el.wrap.setAttribute("aria-label", paused ? "Resume demo" : "Pause demo");
  }

  function setZoom(z) {
    if (reduce) {
      el.stage.style.transform = "none";
      return;
    }
    el.stage.style.transform = "translate(" + z.x + "px," + z.y + "px) scale(" + z.s + ")";
  }

  function renderCaption(scene, i) {
    el.step.textContent = "Part " + (i + 1) + " of " + scenes.length;
    el.title.textContent = scene.title;
    el.detail.textContent = scene.detail;
    el.cmd.textContent = scene.cmd;
    el.who.textContent = scene.who === "teammate" ? "teammate@laptop - zsh" : "you@laptop - zsh";
    el.machine.dataset.who = scene.who;
    el.bar.style.width = ((i + 1) / scenes.length) * 100 + "%";
  }

  function sleep(ms, token) {
    return new Promise((resolve, reject) => {
      if (!playing) return reject(Object.assign(new Error("pause"), { pause: true }));
      const t = setTimeout(() => {
        if (token !== runToken) return reject(Object.assign(new Error("cancel"), { cancel: true }));
        if (!playing) return reject(Object.assign(new Error("pause"), { pause: true }));
        resolve();
      }, reduce ? Math.min(ms, 80) : ms);
      void t;
    });
  }

  async function typeLine(line, token) {
    const prompt = '<span class="prompt">$</span> ';
    if (line.kind === "in") {
      el.term.innerHTML += prompt;
      const chars = line.text.split("");
      for (const ch of chars) {
        if (token !== runToken) throw Object.assign(new Error("cancel"), { cancel: true });
        while (!playing) await new Promise((r) => setTimeout(r, 80));
        el.term.innerHTML += ch.replace(/</g, "&lt;");
        await sleep(reduce ? 0 : 14 + Math.random() * 22, token);
      }
      el.term.innerHTML += "\\n";
      return;
    }
    const cls = line.kind === "ok" ? "ok" : line.kind === "warn" ? "warn" : line.kind === "dim" ? "dim" : "";
    const html = cls
      ? '<span class="' + cls + '">' + line.text.replace(/</g, "&lt;") + "</span>\\n"
      : line.text.replace(/</g, "&lt;") + "\\n";
    el.term.innerHTML += html;
    await sleep(reduce ? 40 : line.kind === "dim" ? 220 : 320, token);
  }

  async function playScene(i, token) {
    const scene = scenes[i];
    renderCaption(scene, i);
    setZoom(scene.zoom);
    el.term.innerHTML = "";
    await sleep(reduce ? 50 : 320, token);
    for (const line of scene.lines) {
      await typeLine(line, token);
    }
    el.term.innerHTML += '<span class="cursor" aria-hidden="true"></span>';
    await sleep(scene.hold, token);
  }

  async function loopFrom(start) {
    const token = ++runToken;
    idx = start;
    try {
      for (let i = start; ; i = (i + 1) % scenes.length) {
        idx = i;
        await playScene(i, token);
      }
    } catch (e) {
      if (e && e.pause) {
        setPausedUi(true);
        return;
      }
      if (e && e.cancel) return;
      throw e;
    }
  }

  function go(i) {
    runToken++;
    playing = true;
    setPausedUi(false);
    loopFrom(i);
  }

  function togglePlay() {
    playing = !playing;
    setPausedUi(!playing);
    if (playing) loopFrom(idx);
  }

  el.wrap.addEventListener("click", togglePlay);
  el.wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  });

  el.copy.addEventListener("click", async (e) => {
    e.stopPropagation();
    const text = el.cmd.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      el.copy.setAttribute("data-ok", "");
      el.copy.setAttribute("aria-label", "Copied");
      setTimeout(() => {
        el.copy.removeAttribute("data-ok");
        el.copy.setAttribute("aria-label", "Copy command");
        el.copy.innerHTML = copyIcon;
      }, 1000);
    } catch {
      el.copy.setAttribute("aria-label", "Copy failed");
    }
  });

  function kick() {
    if (started) return;
    started = true;
    go(0);
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) kick();
    },
    { threshold: 0.12 },
  );
  io.observe(root);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick, { once: true });
  setTimeout(kick, 400);
})();
`;

/** Wrap a command string in a copyable <pre> block. */
export function codeBlock(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<div class="code-block"><pre>${escaped}</pre><button type="button" class="copy-btn" aria-label="Copy">${COPY_ICON}</button></div>`;
}

export const copyBlocksScript = `
(function () {
  const icon = '${COPY_ICON.replace(/'/g, "\\'")}';
  document.querySelectorAll(".code-block .copy-btn, .demo-copy").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
  });
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest && e.target.closest(".code-block .copy-btn");
    if (!btn) return;
    const pre = btn.parentElement && btn.parentElement.querySelector("pre");
    if (!pre) return;
    try {
      await navigator.clipboard.writeText(pre.textContent || "");
      btn.setAttribute("data-ok", "");
      btn.setAttribute("aria-label", "Copied");
      setTimeout(() => {
        btn.removeAttribute("data-ok");
        btn.setAttribute("aria-label", "Copy");
        btn.innerHTML = icon;
      }, 1000);
    } catch {}
  });
})();
`;
