import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform float uGlow;
uniform float uSaturation;
uniform float uRepulsion;
uniform float uMouseActive;
varying vec2 vUv;
#define PI 3.14159265359

float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec3 hsv(vec3 c){ vec4 K = vec4(1.0, 0.6667, 0.3333, 3.0); vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); }
float star(vec2 p, float glow){ float d = max(length(p), 0.001); float core = 0.012 / d; float cross = smoothstep(0.0, 1.0, 1.0 - abs(p.x * p.y * 900.0)); return (core + cross * glow * 0.25) * smoothstep(1.0, 0.08, d); }

void main(){
  vec2 uv = (vUv * uResolution - 0.5 * uResolution) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float md = length(uv - mouse);
  uv += normalize(uv - mouse) * (uRepulsion / (md + 0.18)) * 0.055 * uMouseActive;
  float a = uTime * 0.035;
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  uv = rot * uv;
  vec3 col = vec3(0.0);
  for(float layer = 0.0; layer < 4.0; layer += 1.0){
    float depth = fract(layer * 0.23 + uTime * uSpeed * 0.035);
    float scale = mix(18.0 * uDensity, 0.65 * uDensity, depth);
    vec2 grid = uv * scale + layer * 47.3;
    vec2 id = floor(grid);
    vec2 local = fract(grid) - 0.5;
    for(int y=-1; y<=1; y++) for(int x=-1; x<=1; x++){
      vec2 cell = id + vec2(float(x), float(y));
      float seed = hash21(cell);
      float size = fract(seed * 341.7);
      vec2 drift = vec2(sin(uTime * (0.18 + seed * 0.5) + seed * 6.0), cos(uTime * (0.13 + seed * 0.4) + seed * 8.0)) * 0.16;
      vec2 p = local - vec2(float(x), float(y)) - drift;
      float intensity = star(p, smoothstep(0.82, 1.0, size) * uGlow);
      float hue = fract(uHueShift / 360.0 + seed * 0.08 + 0.52);
      vec3 tint = hsv(vec3(hue, uSaturation, 0.45 + size * 0.55));
      float twinkle = 0.72 + 0.28 * sin(uTime * (1.4 + seed * 2.0) + seed * 20.0);
      col += intensity * tint * twinkle * depth;
    }
  }
  float vignette = smoothstep(1.15, 0.18, length((vUv - 0.5) * vec2(1.4, 1.0)));
  col *= vignette;
  gl_FragColor = vec4(col, min(0.92, length(col) * 1.4));
}
`;

type GalaxyProps = {
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  mouseInteraction?: boolean;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  disableAnimation?: boolean;
  className?: string;
};

export default function Galaxy({
  density = 0.78,
  hueShift = 176,
  speed = 0.62,
  glowIntensity = 0.38,
  saturation = 0.72,
  mouseInteraction = true,
  mouseRepulsion = true,
  repulsionStrength = 1.2,
  disableAnimation = false,
  className = "",
}: GalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 700px)").matches || navigator.maxTouchPoints > 0;
    const renderer = new Renderer({ alpha: true, dpr: mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uDensity: { value: mobile ? density * 0.58 : density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uGlow: { value: mobile ? glowIntensity * 0.72 : glowIntensity },
        uSaturation: { value: saturation },
        uRepulsion: { value: !mobile && mouseRepulsion ? repulsionStrength : 0 },
        uMouseActive: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    gl.canvas.setAttribute("aria-hidden", "true");

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height];
      program.uniforms.uMouseActive.value = 1;
    };
    const onLeave = () => { program.uniforms.uMouseActive.value = 0; };
    let frame = 0;
    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      program.uniforms.uTime.value = reducedMotion || disableAnimation ? 0 : time * 0.001;
      renderer.render({ scene: mesh });
    };
    resize();
    window.addEventListener("resize", resize);
    if (mouseInteraction && !mobile) {
      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
    }
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [density, hueShift, speed, glowIntensity, saturation, mouseInteraction, mouseRepulsion, repulsionStrength, disableAnimation]);

  return <div ref={containerRef} className={`galaxy-container ${className}`} aria-label="Interactive starfield background" />;
}
