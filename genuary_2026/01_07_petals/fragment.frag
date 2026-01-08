precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform int u_numPetals;
uniform float u_centerRadius;
uniform float u_innerRadius;

const int MAX_PETALS = 20;

uniform vec3 u_petalPos[MAX_PETALS]; // x, y, rotation
uniform vec4 u_petalParams[MAX_PETALS]; // length, width, waveFrequency, waveAmplitude

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Circle SDF
float circleSDF(vec2 p, vec2 center, float radius) {
  return length(p - center) - radius;
}

// Leaf-shaped petal SDF with wavy edges
float petalSDF(vec2 p, vec2 center, float rotation, float len, float width, float waveFreq, float waveAmp) {
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
  float pinch = abs(x) * (1.0 - abs(y)) * 1.0; // Pinch inward along the sides

  float d = base - pinch;

  // Scale back
  d *= len * 0.5;

  // Add wavy edges with custom frequency and amplitude
  float angle = atan(pos.y, pos.x);

  // Fade waves at both pointy tips
  float normalizedX = abs(pos.x);
  float waveMask = smoothstep(0.8, 0.5, normalizedX); // Fade at both ends

  float waves = sin(angle * waveFreq) * waveAmp * waveMask;

  d += waves;

  return d;
}



void main() {
  vec2 uv = vTexCoord;
  vec2 pos = (uv * u_resolution) - u_resolution * 0.5;

  float minDist = 1e10;

  // Check all petals
  for (int i = 0; i < MAX_PETALS; i++) {
    if (i >= u_numPetals) break;

    vec2 center = u_petalPos[i].xy;
    float rotation = u_petalPos[i].z;

    float len = u_petalParams[i].x;
    float width = u_petalParams[i].y;
    float waveFreq = u_petalParams[i].z;
    float waveAmp = u_petalParams[i].w;

    float d = petalSDF(pos, center, rotation, len, width, waveFreq, waveAmp);
    minDist = min(minDist, d);
  }

  // Add center circle
  float circleDist = circleSDF(pos, vec2(0.0, 0.0), u_centerRadius);
  minDist = min(minDist, circleDist);

  // Check if point is inside inner circle (hole)
  float innerCircleDist = circleSDF(pos, vec2(0.0, 0.0), u_innerRadius);
  bool inInnerCircle = innerCircleDist < 0.0;

  // Simple visualization: dark petals on light background
  vec3 petalColor = vec3(0,0,0);
  vec3 outlineColor = vec3(0.2, 0.1, 0.15);    // Dark outline
  vec3 backgroundColor = vec3(0.95, 0.95, 0.9); // Off-white

  vec3 color;
  float edgeWidth = 2.0;

  if (inInnerCircle) {
    // Force background color inside inner circle
    color = backgroundColor;
  } else if (minDist < 0.0) {
    // Inside petal
    color = petalColor;
  } else if (minDist < edgeWidth) {
    // Outline
    float t = smoothstep(0.0, edgeWidth, minDist);
    color = mix(outlineColor, backgroundColor, t);
  } else {
    // Background
    color = backgroundColor;
  }

  gl_FragColor = vec4(color, 1.0);
}
