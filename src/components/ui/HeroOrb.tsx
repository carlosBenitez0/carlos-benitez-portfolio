import { useEffect, useRef } from "react";
import * as THREE from "three";
import { onVisibilityChange } from "../../utils/visibility";

// Orbe 3D líquido detrás de la foto del header: una esfera cuya superficie se
// deforma con ruido, con un borde iridiscente (violeta, magenta y cian) que
// cambia con el ángulo. Gira y se ilumina hacia el puntero; al acercarse, la
// superficie se agita más. La foto queda delante en 2D, siempre nítida.

// Ruido simplex 3D (Ashima Arts / Stefan Gustavson, licencia MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAgitation;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;
${NOISE}

float displacement(vec3 p) {
  // Ondas amplias y lentas (líquido), con un relieve fino muy leve
  float slow = snoise(p * 0.85 + vec3(0.0, uTime * 0.18, uTime * 0.1));
  float fine = snoise(p * 1.9 - vec3(uTime * 0.25));
  return (slow * 0.1 + fine * 0.018) * (1.0 + uAgitation * 0.7);
}

void main() {
  // Normal desplazada a partir de dos vecinos sobre la superficie
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
  vec3 bitangent = cross(normal, tangent);
  float eps = 0.012;
  vec3 p0 = position + normal * displacement(position);
  vec3 pt = position + tangent * eps;
  vec3 pb = position + bitangent * eps;
  vec3 p1 = pt + normalize(pt) * displacement(pt);
  vec3 p2 = pb + normalize(pb) * displacement(pb);
  vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));

  vNoise = displacement(position);
  vec4 viewPosition = modelViewMatrix * vec4(p0, 1.0);
  vNormal = normalize(normalMatrix * displacedNormal);
  vViewDir = normalize(-viewPosition.xyz);
  gl_Position = projectionMatrix * viewPosition;
}
`;

const FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uLight;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;

void main() {
  vec3 n = normalize(vNormal);
  float facing = max(dot(n, vViewDir), 0.0);
  float fresnel = pow(1.0 - facing, 3.0);

  // Iridiscencia: el tono recorre violeta → magenta → cian según el ángulo,
  // el relieve y el tiempo (como una película fina sobre la superficie)
  float t = fresnel * 1.1 + vNoise * 3.0 + uTime * 0.05;
  vec3 violet = vec3(0.48, 0.17, 0.75);
  vec3 magenta = vec3(0.84, 0.0, 0.98);
  vec3 cyan = vec3(0.31, 0.86, 1.0);
  float w = fract(t);
  vec3 irid = w < 0.5
    ? mix(violet, magenta, smoothstep(0.0, 0.5, w))
    : mix(magenta, cyan, smoothstep(0.5, 1.0, w));
  irid = mix(irid, violet, 0.12);

  // Centro oscuro para que la foto destaque; luz suave de color (no blanca)
  // Vidrio oscuro y profundo: poca luz difusa, el color vive en el borde
  vec3 base = vec3(0.045, 0.008, 0.11);
  float diffuse = max(dot(n, normalize(uLight)), 0.0);
  vec3 lit = base + vec3(0.3, 0.1, 0.52) * diffuse * 0.22;
  vec3 halfVector = normalize(normalize(uLight) + vViewDir);
  float sheen = pow(max(dot(n, halfVector), 0.0), 24.0);

  vec3 color = lit + irid * fresnel * 1.9 + vec3(0.7, 0.5, 1.0) * sheen * 0.22;
  gl_FragColor = vec4(color, 0.96);
}
`;

interface HeroOrbProps {
  // Se llama cuando el orbe ya está dibujado (para ocultar la burbuja CSS)
  onReady?: () => void;
}

export default function HeroOrb({ onReady }: HeroOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // Sin WebGL se queda la burbuja CSS
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // La esfera (radio 1 + relieve) ocupa ~62% del lienzo
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.z = 5.1;

    const uniforms = {
      uTime: { value: 0 },
      uAgitation: { value: 0 },
      uLight: { value: new THREE.Vector3(-0.6, 0.7, 1) },
    };
    const isSmall = mount.clientWidth < 400;
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, isSmall ? 28 : 40),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
      }),
    );
    scene.add(orb);

    const resize = () => {
      const size = mount.clientWidth;
      if (!size) return;
      renderer.setSize(size, size);
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(mount);
    resize();

    // Puntero: dirección (gira el orbe y mueve la luz) y cercanía (agita)
    const target = { x: 0, y: 0, near: 0 };
    const current = { x: 0, y: 0, near: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      target.x = Math.max(
        -1,
        Math.min(1, (event.clientX - cx) / (window.innerWidth / 2)),
      );
      target.y = Math.max(
        -1,
        Math.min(1, (event.clientY - cy) / (window.innerHeight / 2)),
      );
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      target.near = Math.max(0, 1 - distance / (rect.width * 0.9));
    };
    const onPointerLeave = () => {
      target.near = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    let elapsed = 0;
    const render = () => {
      uniforms.uTime.value = elapsed;
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      current.near += (target.near - current.near) * 0.04;
      uniforms.uAgitation.value = current.near;
      uniforms.uLight.value.set(
        current.x * 1.2 - 0.3,
        -current.y * 1.2 + 0.5,
        1,
      );
      orb.rotation.y = elapsed * 0.08 + current.x * 0.45;
      orb.rotation.x = current.y * 0.35;
      renderer.render(scene, camera);
    };

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let running = false;
    let last = 0;
    let disposed = false;
    let readyTimer = 0;
    let stopWatching = () => {};
    const loop = (now: number) => {
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;
      render();
      frame = requestAnimationFrame(loop);
    };

    // Los shaders se compilan sin bloquear la página (si el navegador lo
    // permite); el primer render síncrono congelaba la entrada ~200 ms.
    // Luego el lienzo aparece con un fundido sobre la burbuja CSS.
    renderer
      .compileAsync(scene, camera)
      .catch(() => {})
      .then(() => {
        if (disposed) return;
        elapsed = 2;
        render();
        mount.classList.add("is-ready");
        readyTimer = window.setTimeout(() => onReady?.(), 800);

        // Solo se anima mientras el hero está en pantalla
        stopWatching = onVisibilityChange(mount, (visible) => {
          if (reducedMotion) return;
          if (visible && !running) {
            running = true;
            last = performance.now();
            frame = requestAnimationFrame(loop);
          } else if (!visible && running) {
            running = false;
            cancelAnimationFrame(frame);
          }
        });
      });

    return () => {
      disposed = true;
      window.clearTimeout(readyTimer);
      cancelAnimationFrame(frame);
      stopWatching();
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      orb.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={mountRef} className="hero-orb" />;
}
