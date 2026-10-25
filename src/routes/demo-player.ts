/** Interactive terminal demo for the marketing homepage. */

export const demoPlayerStyles = `
  .demo {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-move: cubic-bezier(0.77, 0, 0.175, 1);
    --demo-line: #243024;
    margin: 0;
    background: var(--field-1, #000);
    overflow: hidden;
  }
  .demo-caption {
    display: grid;
    gap: .35rem;
    padding: 1rem 1.1rem .85rem;
    background: var(--surface, #162a17);
  }
  .demo-step {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    color: var(--accent);
    margin: 0;
  }
  .demo-title {
    font-family: "Stack Sans Headline", system-ui, sans-serif;
    font-size: clamp(1.35rem, 2.2vw, 1.75rem);
    font-weight: 300;
    letter-spacing: -.02em;
    margin: 0;
    line-height: 1.1;
  }
  .demo-detail {
    margin: 0;
    color: var(--muted);
    font-size: 1rem;
    max-width: 40rem;
  }
  .demo-run {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
    margin-top: .45rem;
  }
  .demo-run label {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    color: var(--muted);
  }
  .demo-run code {
    font-size: 12.5px;
    background: #0a120b;
    padding: .35rem .55rem;
    color: var(--ink);
  }
  .demo-copy {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    margin: 0;
    padding: .35rem .55rem;
    border: 0;
    background: #0a120b;
    color: var(--muted);
    cursor: pointer;
  }
  .demo-copy:hover { color: var(--ink); }
  .demo-copy:active { transform: scale(0.97); }
  .demo-stage-wrap {
    position: relative;
    height: min(400px, 56vw);
    background: #0a120b;
    overflow: hidden;
  }
  .demo-stage {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    transform-origin: 50% 45%;
    transition: transform 700ms var(--ease-move);
    will-change: transform;
  }
  .demo-machine {
    width: min(92%, 640px);
    background: #121910;
    transition: opacity 400ms var(--ease-out), transform 700ms var(--ease-move);
  }
  .demo-machine[data-who="teammate"] { outline: 1px solid #3a4a3a; }
  .demo-chrome {
    display: flex;
    align-items: center;
    gap: .45rem;
    padding: .55rem .75rem;
    background: #162216;
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: 13px;
    color: var(--muted);
  }
  .demo-dot { width: 8px; height: 8px; border-radius: 50%; background: #3a4a3a; }
  .demo-dot:nth-child(1) { background: #ff5f57; }
  .demo-dot:nth-child(2) { background: #febc2e; }
  .demo-dot:nth-child(3) { background: #28c840; }
  .demo-chrome-title { margin-left: .35rem; }
  .demo-term {
    margin: 0;
    padding: .85rem 1rem 1.1rem;
    min-height: 210px;
    font-family: "IBM Plex Mono", ui-monospace, monospace; /* taste-skill-ignore: data-ui terminal body */
    font-size: 12.5px;
    line-height: 1.55;
    color: #d8d4c8;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .demo-term .prompt { color: var(--accent); }
  .demo-term .dim { color: #7a8a7a; }
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
  .demo-transport {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .55rem;
    padding: .7rem 1rem;
    background: var(--surface, #162a17);
  }
  .demo-transport button {
    margin: 0;
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    padding: .45rem .7rem;
    border: 0;
    background: #0a120b;
    color: var(--ink);
    cursor: pointer;
  }
  .demo-transport button.primary {
    background: var(--accent);
    color: var(--accent-ink, #0f1f10);
  }
  .demo-transport button:active:not(:disabled) { transform: scale(0.97); }
  .demo-transport button:disabled { opacity: .45; cursor: default; }
  .demo-progress {
    flex: 1;
    min-width: 120px;
    height: 3px;
    background: #243024;
    overflow: hidden;
  }
  .demo-progress > i {
    display: block;
    height: 100%;
    width: 0%;
    background: var(--accent);
    transition: width 280ms var(--ease-out);
  }
  .demo-pills {
    display: flex;
    flex-wrap: wrap;
    gap: .35rem;
    width: 100%;
  }
  .demo-pill {
    font-family: "Stack Sans Text", system-ui, sans-serif;
    font-size: var(--step-small, 0.875rem);
    padding: .3rem .5rem;
    border: 0;
    color: #6f7b6f;
    background: transparent;
    cursor: pointer;
    margin: 0;
  }
  .demo-pill[aria-current="true"] {
    color: var(--accent-ink, #0f1f10);
    background: var(--accent);
  }
  @media (prefers-reduced-motion: reduce) {
    .demo-stage, .demo-machine, .demo-progress > i { transition: none !important; }
    .demo-term .cursor { animation: none; opacity: 1; }
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
      <button type="button" class="demo-copy" data-demo-copy>Copy</button>
    </div>
  </figcaption>
  <div class="demo-stage-wrap">
    <div class="demo-stage" data-demo-stage>
      <div class="demo-machine" data-demo-machine data-who="you">
        <div class="demo-chrome">
          <span class="demo-dot"></span><span class="demo-dot"></span><span class="demo-dot"></span>
          <span class="demo-chrome-title" data-demo-who>you@laptop - zsh</span>
        </div>
        <pre class="demo-term" data-demo-term aria-live="polite"></pre>
      </div>
    </div>
  </div>
  <div class="demo-transport">
    <button type="button" class="primary" data-demo-toggle>Pause</button>
    <button type="button" data-demo-restart>Restart</button>
    <div class="demo-progress" aria-hidden="true"><i data-demo-bar></i></div>
    <div class="demo-pills" data-demo-pills></div>
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
    stage: root.querySelector("[data-demo-stage]"),
    machine: root.querySelector("[data-demo-machine]"),
    who: root.querySelector("[data-demo-who]"),
    term: root.querySelector("[data-demo-term]"),
    toggle: root.querySelector("[data-demo-toggle]"),
    restart: root.querySelector("[data-demo-restart]"),
    bar: root.querySelector("[data-demo-bar]"),
    pills: root.querySelector("[data-demo-pills]"),
  };

  const scenes = [
    {
      title: "Install the CLI",
      detail: "macOS / Linux one-liner. On Windows use the PowerShell install script from the docs.",
      cmd: "curl -fsSL https://raw.githubusercontent.com/RovierrHQ/envy/main/scripts/install.sh | sh",
      who: "you",
      zoom: { s: 1.08, x: 0, y: 8 },
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
      zoom: { s: 1.35, x: 0, y: 18 },
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
      zoom: { s: 1.28, x: -4, y: 12 },
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
      zoom: { s: 1.4, x: 6, y: 22 },
      lines: [
        { kind: "in", text: "printf 'DATABASE_URL=postgres://...\nSTRIPE_KEY=sk_...\n' > .env" },
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
      zoom: { s: 1.32, x: 0, y: 14 },
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
      zoom: { s: 1.22, x: 0, y: 10 },
      lines: [
        { kind: "dim", text: "# on a second machine, after install + login" },
        { kind: "in", text: "envy invite accept envy_inv_3c9k..." },
        { kind: "ok", text: "Joined project prj_8f2a...)" },
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
      zoom: { s: 1.38, x: -2, y: 20 },
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

  scenes.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "demo-pill";
    b.textContent = s.title.split(" ").slice(0, 2).join(" ");
    b.addEventListener("click", () => {
      playing = true;
      el.toggle.textContent = "Pause";
      go(i);
    });
    el.pills.appendChild(b);
  });

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
    [...el.pills.children].forEach((p, j) => p.setAttribute("aria-current", j === i ? "true" : "false"));
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
      // store for cancel; not needed beyond token
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
    await sleep(reduce ? 50 : 420, token);
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
      for (let i = start; i < scenes.length; i++) {
        idx = i;
        await playScene(i, token);
      }
      // soft reset zoom
      setZoom({ s: 1, x: 0, y: 0 });
      el.toggle.textContent = "Replay";
      playing = false;
    } catch (e) {
      if (e && e.pause) {
        el.toggle.textContent = "Play";
        return;
      }
      if (e && e.cancel) return;
      throw e;
    }
  }

  function go(i) {
    runToken++;
    playing = true;
    el.toggle.textContent = "Pause";
    loopFrom(i);
  }

  el.toggle.addEventListener("click", () => {
    if (el.toggle.textContent === "Replay") {
      go(0);
      return;
    }
    playing = !playing;
    el.toggle.textContent = playing ? "Pause" : "Play";
    if (playing) loopFrom(idx);
  });

  el.restart.addEventListener("click", () => go(0));

  el.copy.addEventListener("click", async () => {
    const text = el.cmd.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      el.copy.textContent = "Copied";
      setTimeout(() => { el.copy.textContent = "Copy"; }, 1200);
    } catch {
      el.copy.textContent = "Select & copy";
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting) && !started) {
        started = true;
        go(0);
      }
    },
    { threshold: 0.35 },
  );
  io.observe(root);
})();
`;
