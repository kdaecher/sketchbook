precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform vec3 u_petalPos; // x, y, rotation
uniform vec4 u_petalParams; // length, width, unused, unused

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Leaf-shaped petal SDF with wavy edges
float petalSDF(vec2 p, vec2 center, float rotation, float len, float width) {
  vec2 pos = p - center;
  pos = rotate2D(rotation) * pos;

  // Normalize position
  pos.x /= len;
  pos.y /= (len * width);

  float x = pos.x;
  float y = pos.y;

  // Leaf shape using superellipse formula
  // This creates points at both ends along the x-axis
  float powX = 3.0; // Higher values = sharper points
  float powY = 2.0;

  // Create pinched/concave sides by subtracting a term
  float base = pow(abs(x), powX) + pow(abs(y), powY) - 1.0;
  float pinch = abs(x) * (1.0 - abs(y)) * 1.; // Pinch inward along the sides

  float d = base - pinch;

  // Scale back
  d *= len * 0.5;

  // Add wavy edges
  float angle = atan(pos.y, pos.x);
  const float PI = 3.14159265359;

  float waveFrequency = 10.0;
  float waveAmplitude = len * .1;

  // Fade waves at both pointy tips
  float normalizedX = abs(pos.x);
  float waveMask = smoothstep(0.8, 0.5, normalizedX); // Fade at both ends
  float waves = sin(angle * waveFrequency) * waveAmplitude * waveMask;

  d += waves;

  return d;
}

void main() {
  vec2 uv = vTexCoord;
  vec2 pos = (uv * u_resolution) - u_resolution * 0.5;

  vec2 center = u_petalPos.xy;
  float rotation = u_petalPos.z;
  float len = u_petalParams.x;
  float width = u_petalParams.y;

  float d = petalSDF(pos, center, rotation, 200., width);

  // Simple visualization: black petal on white background
  vec3 petalColor = vec3(0.2, 0.2, 0.2);
  vec3 backgroundColor = vec3(0.95, 0.95, 0.95);

  // Add outline
  vec3 outlineColor = vec3(0.0, 0.0, 0.0);
  float edgeWidth = 0.;

  vec3 color;
  if (d < 0.0) {
    // Inside petal
    color = petalColor;
  } else if (d < edgeWidth) {
    // Outline
    float t = smoothstep(0.0, edgeWidth, d);
    color = mix(outlineColor, backgroundColor, t);
  } else {
    // Background
    color = backgroundColor;
  }

  gl_FragColor = vec4(color, 1.0);
}
