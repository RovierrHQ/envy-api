/** Ambient Three.js field for the homepage hero. Loaded from CDN. */

export const threeBgMarkup = `<canvas id="envy-webgl" aria-hidden="true"></canvas>`;

export const threeBgScript = `
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.170.0/build/three.module.js"}}
</script>
<script type="module">
import * as THREE from "three";

const canvas = document.getElementById("envy-webgl");
if (!canvas) throw new Error("missing canvas");

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dark = () => !document.documentElement.classList.contains("light");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0.15, 4.2);

const group = new THREE.Group();
scene.add(group);

const envelopeGeo = new THREE.BoxGeometry(1.15, 0.72, 0.04);
const sealGeo = new THREE.CircleGeometry(0.14, 32);
const particleGeo = new THREE.SphereGeometry(0.018, 8, 8);

function palette() {
  if (dark()) {
    return {
      env: 0x1a2744,
      envEdge: 0x7eb6ff,
      seal: 0xa8d4ff,
      particle: 0x5b8fd9,
      fog: 0x0a1228,
    };
  }
  return {
    env: 0x9ec9f5,
    envEdge: 0x1a5fad,
    seal: 0x3d8fd9,
    particle: 0x4a90d9,
    fog: 0xe8f4ff,
  };
}

let envMat, sealMat, particleMat;
const envelopes = [];
const particles = [];

function rebuildMaterials() {
  const p = palette();
  envMat = new THREE.MeshStandardMaterial({
    color: p.env,
    metalness: 0.15,
    roughness: 0.55,
    transparent: true,
    opacity: 0.92,
  });
  sealMat = new THREE.MeshStandardMaterial({
    color: p.seal,
    metalness: 0.35,
    roughness: 0.35,
    emissive: p.seal,
    emissiveIntensity: dark() ? 0.25 : 0.12,
  });
  particleMat = new THREE.MeshBasicMaterial({ color: p.particle, transparent: true, opacity: 0.55 });
  for (const m of envelopes) {
    m.mesh.material = envMat;
    m.seal.material = sealMat;
    m.edge.material.color.setHex(p.envEdge);
    m.edge.material.opacity = dark() ? 0.4 : 0.65;
  }
  for (const pt of particles) pt.material = particleMat;
}

for (let i = 0; i < 7; i++) {
  const mesh = new THREE.Mesh(envelopeGeo, envMat);
  const seal = new THREE.Mesh(sealGeo, sealMat);
  seal.position.z = 0.025;
  mesh.add(seal);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x7eb6ff, transparent: true, opacity: 0.45 });
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(envelopeGeo), edgeMat);
  mesh.add(edge);
  group.add(mesh);
  envelopes.push({
    mesh,
    seal,
    edge,
    phase: Math.random() * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.2,
    radius: 0.9 + Math.random() * 1.4,
    tilt: (Math.random() - 0.5) * 0.6,
  });
}

for (let i = 0; i < 48; i++) {
  const pt = new THREE.Mesh(particleGeo, particleMat);
  pt.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3);
  group.add(pt);
  particles.push(pt);
}

const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(2.5, 3, 4);
scene.add(key);
scene.add(new THREE.AmbientLight(0xffffff, 0.45));

rebuildMaterials();

const light = new THREE.PointLight(0xa8d4ff, 1.2, 12);
light.position.set(-1.5, 1.2, 2.5);
scene.add(light);

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize", resize);

const mouse = { x: 0, y: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

const themeObs = new MutationObserver(() => rebuildMaterials());
themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

let t0 = performance.now();
function frame(now) {
  const t = (now - t0) / 1000;
  if (!reduce) {
    envelopes.forEach((e, i) => {
      const a = t * e.speed + e.phase;
      e.mesh.position.set(
        Math.cos(a) * e.radius * 0.55,
        Math.sin(a * 0.85) * 0.55 + e.tilt,
        Math.sin(a) * e.radius * 0.35 - 0.4,
      );
      e.mesh.rotation.set(0.2 + Math.sin(a) * 0.15, a * 0.4, e.tilt * 0.5);
      e.mesh.scale.setScalar(0.55 + (i % 3) * 0.12);
    });
    group.rotation.y = mouse.x * 0.12;
    group.rotation.x = -mouse.y * 0.08;
    light.intensity = 1.05 + Math.sin(t * 0.8) * 0.15;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>
`;
