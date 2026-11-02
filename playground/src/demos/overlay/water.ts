/**
 * The water the droplet is made of, drawn by a WebGL fragment shader: glassy liquid (the
 * drop, its puddle, the jet and the droplets of a splash, blended into one), the rings it
 * sends over the water and the shadow it casts. Shapes are signed distances in CSS px
 * from the canvas center, y up; `droplet.ts` moves them.
 */

export const DROPS = 11;
export const RIPPLES = 14;
/** How flat the water looks: a ring on it is this much as tall as it is wide. */
export const ASPECT = 0.34;

export interface WaterScene {
  /** The drop's round end: where its center is. */
  bodyAt: Float32Array;
  /** The inverse of the drop's shape transform (column-major, for GL). */
  bodyInverse: Float32Array;
  /** How much that transform shrinks distances; 0 without a drop. */
  bodyScale: number;
  /** The puddle the drop spreads into: center and radii; no radii, no puddle. */
  puddle: Float32Array;
  /** The jet rising from the middle of a splash: base, height, radius. */
  jet: Float32Array;
  /** Flying droplets: x, y, radius (0: none) each. */
  drops: Float32Array;
  /** Rings on the water: x, y, radius, strength (0: none) each. */
  ripples: Float32Array;
  /** The shadow on the water: offset, softness, strength. */
  shadow: Float32Array;
}

export const createScene = (): WaterScene => ({
  bodyAt: new Float32Array(2),
  bodyInverse: new Float32Array([1, 0, 0, 1]),
  bodyScale: 0,
  puddle: new Float32Array(4),
  jet: new Float32Array(4),
  drops: new Float32Array(DROPS * 4),
  ripples: new Float32Array(RIPPLES * 4),
  shadow: new Float32Array(4),
});

const VERTEX = /* glsl */ `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT = /* glsl */ `
precision highp float;

#define DROPS ${DROPS}
#define RIPPLES ${RIPPLES}

uniform vec2 u_size;
uniform float u_dpr;
uniform vec3 u_behind;
uniform vec2 u_bodyAt;
uniform mat2 u_bodyInverse;
uniform float u_bodyScale;
uniform vec4 u_puddle;
uniform vec4 u_jet;
uniform vec4 u_drops[DROPS];
uniform vec4 u_ripples[RIPPLES];
uniform vec4 u_shadow;

const float ASPECT = ${ASPECT};
const float R = 17.0;
const vec3 LIGHT = vec3(-0.5, 0.62, 0.6);
const vec3 TINT = vec3(0.23, 0.51, 0.96);
const vec3 DEEP = vec3(0.03, 0.13, 0.32);

// The drop: round at the bottom (radius R around the origin), narrowing up to a tip.
float tear(vec2 p) {
  const float tip = 2.2;
  const float h = 25.0;
  p.x = abs(p.x);
  float b = (R - tip) / h;
  float a = sqrt(1.0 - b * b);
  float k = dot(p, vec2(-b, a));
  if (k < 0.0) return length(p) - R;
  if (k > a * h) return length(p - vec2(0.0, h)) - tip;
  return dot(p, vec2(a, b)) - R;
}

float ellipse(vec2 p, vec2 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-4);
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0));
}

// A smooth union of distances (x), carrying along how round the liquid is there (y: its
// normals bend over that) and how much of it there is (z: 1 a drop, less a thin film).
vec3 blend(vec3 a, vec3 b, float k) {
  float h = clamp(0.5 + 0.5 * (b.x - a.x) / k, 0.0, 1.0);
  return vec3(mix(b.x, a.x, h) - k * h * (1.0 - h), mix(b.yz, a.yz, h));
}

// The drop as it is moved and squashed: what casts the shadow.
float drop(vec2 p) {
  return u_bodyScale > 0.0 ? tear(u_bodyInverse * (p - u_bodyAt)) * u_bodyScale : 1e4;
}

vec3 liquid(vec2 p) {
  vec3 s = vec3(drop(p), R * u_bodyScale, 1.0);
  if (u_puddle.w > 0.0) s = blend(s, vec3(ellipse(p - u_puddle.xy, u_puddle.zw), 4.0, 0.25), 7.0);
  if (u_jet.w > 0.0) s = blend(s, vec3(segment(p, u_jet.xy, u_jet.xy + vec2(0.0, u_jet.z)) - u_jet.w, u_jet.w, 1.0), 5.0);
  for (int i = 0; i < DROPS; i++) {
    vec4 d = u_drops[i];
    if (d.z > 0.0) s = blend(s, vec3(length(p - d.xy) - d.z, d.z, 1.0), 4.5);
  }
  return s;
}

vec4 over(vec4 top, vec4 bottom) { return top + bottom * (1.0 - top.a); }

void main() {
  vec2 p = gl_FragCoord.xy / u_dpr - u_size * 0.5;
  vec3 light = normalize(LIGHT);
  vec3 halfway = normalize(light + vec3(0.0, 0.0, 1.0));
  vec2 toLight = normalize(light.xy);
  // A light page shows a drop's dark outline, a dark one its glow.
  float page = dot(u_behind, vec3(0.299, 0.587, 0.114));
  float px = 1.0 / u_dpr;
  vec4 color = vec4(0.0);

  // The shadow on the water, and the light the drop focuses into it.
  if (u_shadow.w > 0.0) {
    float shade = 1.0 - smoothstep(-u_shadow.z, u_shadow.z, drop(p - u_shadow.xy));
    color = vec4(0.0, 0.02, 0.06, 1.0) * shade * u_shadow.w * 0.3;
    float focus = 1.0 - smoothstep(-2.5, 3.5, ellipse(p - u_bodyAt - u_shadow.xy * 1.15, vec2(5.5, 3.5) * u_bodyScale + 0.01));
    color = over(vec4(vec3(0.85, 0.95, 1.0), 1.0) * focus * u_shadow.w * 0.55, color);
  }

  // Rings on the water: each a crest ahead and a trough behind (x e^-x^2), lit by its slope.
  vec2 slope = vec2(0.0);
  for (int i = 0; i < RIPPLES; i++) {
    vec4 r = u_ripples[i];
    if (r.w <= 0.0) continue;
    vec2 q = (p - r.xy) / vec2(1.0, ASPECT);
    float rho = length(q);
    float x = (rho - r.z) / (1.6 + r.z * 0.08);
    if (abs(x) > 3.0) continue;
    slope += r.w * (1.0 - 2.0 * x * x) * exp(-x * x) * q / max(rho, 1e-3);
  }
  if (dot(slope, slope) > 1e-6) {
    vec3 n = normalize(vec3(-slope * 0.8, 1.0));
    float facing = dot(n, light) - light.z;
    float glint = pow(max(dot(n, halfway), 0.0), 90.0);
    float bright = clamp(max(facing, 0.0) * 1.6 + glint * 0.9, 0.0, 1.0);
    float dark = clamp(-facing * 1.2, 0.0, 0.5);
    color = over(vec4(DEEP, 1.0) * dark * mix(1.0, 0.4, 1.0 - page), color);
    color = over(vec4(mix(TINT, vec3(1.0), 0.6), 1.0) * bright, color);
  }

  // The liquid itself.
  vec3 s = liquid(p);
  if (s.x < 1.5 * px) {
    float cover = clamp(0.5 - s.x / px, 0.0, 1.0);
    float e = 0.5 * px;
    vec2 g = vec2(liquid(p + vec2(e, 0.0)).x - s.x, liquid(p + vec2(0.0, e)).x - s.x);
    g = dot(g, g) > 1e-10 ? normalize(g) : vec2(0.0, 1.0);
    // A round cap: steep at the outline, flat where the liquid is as deep as it is round.
    float depth = clamp(-s.x / max(s.y, 0.5), 0.0, 1.0);
    float slant = (1.0 - depth) * 0.96;
    vec3 n = vec3(g * slant, sqrt(1.0 - slant * slant));
    float edge = 1.0 - n.z;
    float side = dot(g, toLight);
    float body = s.z;

    // Seen through: the water behind, bluer the more of the drop the light crosses...
    vec3 col = u_behind * mix(vec3(1.0), TINT, (0.2 + 0.4 * depth) * body);
    // ...the shadow under the drop on the side facing the light, the light it focuses on the other.
    col *= 1.0 - 0.55 * smoothstep(0.1, 0.9, side) * smoothstep(0.05, 0.45, edge) * body;
    float caustic = smoothstep(0.1, 0.95, -side) * smoothstep(0.03, 0.22, edge) * (1.0 - smoothstep(0.32, 0.6, edge));
    col += vec3(0.8, 0.94, 1.0) * caustic * mix(0.8, 1.1, 1.0 - page);
    // The outline: light reflected inside the drop, dark on a light page, glowing on a dark one.
    float rim = smoothstep(0.32, 0.72, edge);
    col = mix(col, mix(vec3(0.45, 0.68, 1.0), DEEP, page), rim * mix(0.3, 0.85, body));
    // Reflections: the sky by Fresnel, more on the upper side; the light's highlight and its glow.
    float fresnel = 0.03 + 0.97 * pow(edge / 0.72, 4.0);
    col = mix(col, vec3(0.88, 0.94, 1.0), fresnel * 0.4 * smoothstep(-0.4, 1.0, n.y + 0.3));
    float nh = max(dot(n, halfway), 0.0);
    float highlight = pow(nh, 260.0) * 1.8;
    col += highlight + pow(nh, 22.0) * 0.12;

    // Clear in the middle, the more so the thinner; the outline and the highlights are solid.
    float alpha = clamp(mix(0.15, 0.56, body) + 0.4 * rim * mix(0.5, 1.0, body) + highlight + caustic * 0.3, 0.0, 1.0) * cover;
    color = over(vec4(min(col, 1.0), 1.0) * alpha, color);
  }

  gl_FragColor = color;
}
`;

export interface WaterRenderer {
  draw(scene: WaterScene): void;
  destroy(): void;
}

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

/**
 * Draws on `canvas` at its CSS size, `behind` (sRGB, 0–1) being the color of the page under
 * it. `null` without WebGL.
 */
export const createWaterRenderer = (canvas: HTMLCanvasElement, behind: readonly number[]): WaterRenderer | null => {
  const gl = canvas.getContext('webgl', { antialias: false, depth: false, premultipliedAlpha: true });
  if (!gl) return null;
  const program = gl.createProgram()!;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'a_position');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getShaderInfoLog(fragment) || gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  // One triangle over the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const { clientWidth: width, clientHeight: height } = canvas;
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const at = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform2f(at('u_size'), width, height);
  gl.uniform1f(at('u_dpr'), canvas.width / width);
  gl.uniform3fv(at('u_behind'), behind);
  const uniforms = {
    bodyAt: at('u_bodyAt'),
    bodyInverse: at('u_bodyInverse'),
    bodyScale: at('u_bodyScale'),
    puddle: at('u_puddle'),
    jet: at('u_jet'),
    drops: at('u_drops'),
    ripples: at('u_ripples'),
    shadow: at('u_shadow'),
  };

  return {
    draw(scene) {
      gl.uniform2fv(uniforms.bodyAt, scene.bodyAt);
      gl.uniformMatrix2fv(uniforms.bodyInverse, false, scene.bodyInverse);
      gl.uniform1f(uniforms.bodyScale, scene.bodyScale);
      gl.uniform4fv(uniforms.puddle, scene.puddle);
      gl.uniform4fv(uniforms.jet, scene.jet);
      gl.uniform4fv(uniforms.drops, scene.drops);
      gl.uniform4fv(uniforms.ripples, scene.ripples);
      gl.uniform4fv(uniforms.shadow, scene.shadow);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};
