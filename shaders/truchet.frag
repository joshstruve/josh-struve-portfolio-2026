precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_columns;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.12));
  p += dot(p, p + 23.43);
  return fract(p.x * p.y);
}

mat2 rotate2D(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  // --- PERFECT ISOTROPIC GRID MATH ---
  float cellSize = u_resolution.x / u_columns;
  vec2 uv = gl_FragCoord.xy / cellSize;

  vec2 gridId = floor(uv);
  vec2 localUv = fract(uv) - 0.5;

  // Theme Palette Coordinates 
  vec3 bg         = vec3(0.153, 0.173, 0.176); // Dark Background
  vec3 line       = vec3(0.925, 0.251, 0.478); // Solid Contrasting Fill
  vec3 gridBorder = vec3(0.153, 0.173, 0.176); // Structural Grid Blueprint Line

  // --- CHOREOGRAPHED STATELESS TIMELINE ENGINE ---
  float loopDuration = 5.5;
  float loopIndex = floor(u_time / loopDuration);
  float globalTime = mod(u_time, loopDuration);
  
  // Calculate the absolute random state (0, 1, 2, or 3) for the current and next loop intervals
  float stateCurrent = floor(hash21(gridId + vec2(loopIndex * 13.45, loopIndex * 45.83)) * 4.0);
  float stateNext = floor(hash21(gridId + vec2((loopIndex + 1.0) * 13.45, (loopIndex + 1.0) * 45.83)) * 4.0);
  
  // Find the shortest angular rotation path to the next state
  // This yields a target difference of -1 (left), 1 (right), 2 (180 deg), or 0 (rest)
  float diff = stateNext - stateCurrent;
  if (diff > 2.0) diff -= 4.0;
  else if (diff < -2.0) diff += 4.0;
  
  // Ease the transition during the active spinning window
  float smoothCurve = 0.0;
  if (globalTime < 1.5) {
      smoothCurve = smoothstep(0.0, 0.7, globalTime);
  } else {
      smoothCurve = 1.0; // Lock perfectly into the grid
  }
  
  // Apply synchronized continuous rotation
  float activeSpinAngle = smoothCurve * diff * 1.57079632679;
  float finalAngle = (stateCurrent * 1.57079632679) + activeSpinAngle;
  localUv = rotate2D(finalAngle) * localUv;

  // --- CONTRASTING TRIANGLE SHAPE MATH ---
  // The diagonal splits the tile where X equals Y.
  float aaRange = 1.5 / cellSize; // Smooth the jagged pixel edge
  float triangleMask = smoothstep(-aaRange, aaRange, localUv.x - localUv.y);
  
  // Split the cell into two solid triangles
  vec3 outputColor = mix(bg, line, triangleMask);

  // Module Boundary Architecture
  float cellBorderMask = smoothstep(0.485, 0.495, max(abs(fract(uv.x) - 0.5), abs(fract(uv.y) - 0.5)));
  // Applying a subtle structural line over the solid fills
  outputColor = mix(outputColor, gridBorder, cellBorderMask * 0.5);

  gl_FragColor = vec4(outputColor, 1.0);
}