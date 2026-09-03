function initStickyNavbar() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Inlined Shaders: Zero network round-trips
const vertexShaderSource = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = /* glsl */ `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  const float TIME_SCALE = 0.5;

  float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
  }

  float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + vec3(33.33));
      return fract((p3.x + p3.y) * p3.z);
  }

  vec3 rainLayer(vec2 uv, float scale, float speed, float seed, float t) {
      vec2 q = uv * vec2(scale, scale * 0.68);
      q.y += t * speed;

      vec2 cell = floor(q);
      vec2 f = fract(q) - 0.5;

      float colRand = hash11(cell.x + seed * 17.13);
      float streamLen = floor(mix(10.0, 30.0, colRand));

      float head = mod(t * speed * 8.0 + colRand * streamLen, streamLen);
      float row  = mod(cell.y + streamLen * 10.0, streamLen);
      float dHead = mod(head - row + streamLen, streamLen);

      float trail = exp(-0.23 * dHead);
      trail *= 1.0 - smoothstep(streamLen * 0.65, streamLen * 0.95, dHead);

      vec2 glyphGrid = vec2(3.0, 5.0);
      vec2 gc = floor((f + 0.5) * glyphGrid);
      vec2 guv = fract((f + 0.5) * glyphGrid) - 0.5;

      float pixel = 1.0 - smoothstep(0.28, 0.42, max(abs(guv.x), abs(guv.y)));
      float bit = step(0.5, hash21(cell * vec2(7.31, 11.17) + gc + vec2(seed)));
      float bounds = step(abs(f.x), 0.37) * step(abs(f.y), 0.45);

      float flicker = 0.65 + 0.35 * hash21(cell + vec2(floor(t * 8.0) + seed));

      float glyph = pixel * bit * bounds * trail * flicker;
      float headFlash = exp(-2.4 * dHead) * glyph;

      vec3 steel     = vec3(0.18, 0.24, 0.32);
      vec3 platinum  = vec3(0.55, 0.65, 0.78);
      vec3 starlight = vec3(0.95, 0.98, 1.00);

      float tintMix = hash11(cell.x * 2.7 + seed * 3.1);
      vec3 glyphColor = mix(steel, platinum, tintMix * 0.75);

      return glyph * glyphColor + headFlash * starlight * 1.6;
  }

  vec3 particles(vec2 uv, float t) {
      vec3 color = vec3(0.0);

      vec2 g = uv * 22.0;
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;

      for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
              vec2 offs = vec2(float(i), float(j));
              vec2 cell = id + offs;

              float rnd = hash21(cell + vec2(19.7));

              vec2 basePos = vec2(
                  hash21(cell + vec2(1.3)),
                  hash21(cell + vec2(8.1))
              ) - 0.5;

              vec2 dir = vec2(
                  hash21(cell + vec2(4.7)),
                  hash21(cell + vec2(9.3))
              ) * 2.0 - 1.0;

              dir = normalize(dir + vec2(1e-4));

              float phase = fract(t * (0.03 + rnd * 0.05) + rnd);
              vec2 pos = basePos + dir * ((phase - 0.5) * 0.70);

              vec2 d = f - offs - pos;
              float dist = length(d);

              float spark = exp(-dist * 10.0) * (0.25 + 0.75 * rnd);

              vec3 c = mix(
                  vec3(0.25, 0.40, 0.55),
                  vec3(0.75, 0.90, 1.00),
                  rnd * 0.5
              );

              color += c * spark * 0.08;
          }
      }

      return color;
  }

  void main() {
      float t = u_time * TIME_SCALE;
      float refScale = max(u_resolution.x * 0.42, 600.0);
      vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / refScale;
      vec2 p = uv;

      vec3 color = vec3(0.006, 0.008, 0.012);

      float radial = exp(-length(p) * 1.35);
      color += vec3(0.01, 0.025, 0.045) * radial * 0.55;

      float localY = (2.0 * gl_FragCoord.y - u_resolution.y) / u_resolution.y;
      color += vec3(0.005, 0.012, 0.02) * smoothstep(1.2, -0.8, localY) * 0.5;

      float grain = hash21(floor(gl_FragCoord.xy * 0.5) + vec2(floor(t * 15.0)));
      color += vec3(0.01, 0.015, 0.02) * grain * 0.15;

      color += particles(p, t);

      color += rainLayer(p + vec2(0.10, 0.0), 14.0, 0.70, 3.0, t) * 0.22;
      color += rainLayer(p * 1.10 - vec2(0.18, 0.0), 20.0, 1.00, 17.0, t) * 0.16;
      color += rainLayer(p * 1.24 + vec2(0.27, 0.0), 28.0, 1.28, 41.0, t) * 0.10;

      float scanBand1 = exp(-90.0  * abs(fract(p.y * 20.0 - t * 0.42) - 0.5));
      float scanBand2 = exp(-120.0 * abs(fract(p.y * 31.0 + t * 0.27) - 0.5));

      color += vec3(0.01, 0.03, 0.06) * scanBand1 * 0.08;
      color += vec3(0.01, 0.02, 0.04) * scanBand2 * 0.05;

      float scanlines = smoothstep(0.18, 0.82, fract(gl_FragCoord.y * 0.5));
      color *= 0.98 + 0.02 * scanlines;

      float vignette = 1.0 - 0.35 * smoothstep(0.3, 2.2, length(p));
      color *= vignette;

      color = 1.0 - exp(-color * 1.32);
      color *= vec3(0.95, 1.02, 1.06);
      color = pow(color, vec3(0.94));

      gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl, src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:\n", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function setupCanvas(canvas) {
  const gl = canvas.getContext('webgl', { powerPreference: 'low-power' });
  if (!gl) return;

  const vs = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fs = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:\n", gl.getProgramInfoLog(program));
    return;
  }

  const posAttr = gl.getAttribLocation(program, 'position');
  const resUniform = gl.getUniformLocation(program, 'u_resolution');
  const timeUniform = gl.getUniformLocation(program, 'u_time');

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  function resize() {
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.floor((parent ? parent.clientWidth : window.innerWidth) * dpr);
    const height = Math.floor((parent ? parent.clientHeight : window.innerHeight) * dpr);

    if (width > 0 && height > 0 && (canvas.width !== width || canvas.height !== height)) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      // Render a static frame if user prefers reduced motion
      if (prefersReducedMotion && isVisible) {
        renderFrame(0.0);
      }
    }
  }

  window.addEventListener('resize', resize, { passive: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isVisible = false;
  let animationId = null;
  const epoch = performance.now();

  function renderFrame(timeValue) {
    gl.useProgram(program);
    gl.enableVertexAttribArray(posAttr);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    if (resUniform) gl.uniform2f(resUniform, canvas.width, canvas.height);
    if (timeUniform) gl.uniform1f(timeUniform, timeValue);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function loop(now) {
    if (!isVisible) return;
    renderFrame((now - epoch) * 0.001);
    animationId = requestAnimationFrame(loop);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        if (prefersReducedMotion) {
          renderFrame(0.0);
        } else if (!animationId) {
          animationId = requestAnimationFrame(loop);
        }
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.01 });

  resize();
  observer.observe(canvas.parentElement);
}

function initShaders() {
  const canvasElements = document.querySelectorAll('.shader-canvas');
  canvasElements.forEach(setupCanvas);
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initShaders();
});
