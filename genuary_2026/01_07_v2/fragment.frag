precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform int u_numFlowers;

const int MAX_FLOWERS = 20;
const int MAX_TOTAL_PETALS = 100; // Total petals across all flowers

uniform vec3 u_flowerPos[MAX_FLOWERS]; // x, y, rotation
uniform float u_flowerCenter[MAX_FLOWERS]; // centerRadius
uniform float u_flowerInner[MAX_FLOWERS]; // innerRadius
uniform float u_flowerFilled[MAX_FLOWERS]; // filled (1.0 or 0.0)
uniform int u_flowerPetalStart[MAX_FLOWERS]; // starting index in petal arrays
uniform int u_flowerPetalEnd[MAX_FLOWERS]; // ending index in petal arrays

uniform vec3 u_allPetalsPos[MAX_TOTAL_PETALS]; // x, y, rotation - flattened
uniform vec4 u_allPetalsParams[MAX_TOTAL_PETALS]; // length, width, waveFreq, waveAmp

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
  float powX = 3.0;
  float powY = 2.0;

  // Create pinched/concave sides
  float base = pow(abs(x), powX) + pow(abs(y), powY) - 1.0;
  float pinch = abs(x) * (1.0 - abs(y)) * 1.0;

  float d = base - pinch;

  // Scale back
  d *= len * 0.5;

  // Add wavy edges
  float angle = atan(pos.y, pos.x);
  float normalizedX = abs(pos.x);
  float waveMask = smoothstep(0.8, 0.5, normalizedX);
  float waves = sin(angle * waveFreq) * waveAmp * waveMask;

  d += waves;

  return d;
}

void main() {
  vec2 uv = vTexCoord;
  vec2 pos = (uv * u_resolution) - u_resolution * 0.5;

  int numColorA = 0;
  int numColorB = 0;

  // Check all flowers - must inline to avoid dynamic indexing
  for (int flowerIdx = 0; flowerIdx < MAX_FLOWERS; flowerIdx++) {
    if (flowerIdx >= u_numFlowers) break;

    vec2 center = u_flowerPos[flowerIdx].xy;
    float centerRadius = u_flowerCenter[flowerIdx];
    float innerRadius = u_flowerInner[flowerIdx];
    float filled = u_flowerFilled[flowerIdx];
    int petalStart = u_flowerPetalStart[flowerIdx];
    int petalEnd = u_flowerPetalEnd[flowerIdx];

    float minD = 1e10;

    // Check all petals for this flower
    for (int i = 0; i < MAX_TOTAL_PETALS; i++) {
      if (i < petalStart || i >= petalEnd) continue;

      vec3 petalPos = u_allPetalsPos[i];
      vec4 petalParams = u_allPetalsParams[i];

      float d = petalSDF(pos, petalPos.xy, petalPos.z,
                        petalParams.x, petalParams.y, petalParams.z, petalParams.w);
      minD = min(minD, d);
    }

    // Add center and inner circles
    float centerD = circleSDF(pos, center, centerRadius);
    minD = min(minD, centerD);

    // Check if in hole
    float innerD = circleSDF(pos, center, innerRadius);
    bool inHole = innerD < 0.0;

    // Check if point is inside this flower
    if (!inHole && minD < 0.0) {
      if (filled > 0.5) {
        numColorA++;
      } else {
        numColorB++;
      }
    }
  }

  // Boolean logic: XOR - filled if odd number of shapes contain this point
  bool overlap = mod(float(numColorA + numColorB), 2.0) > 0.5;

  vec3 flowerColor = vec3(1,1,1);
  vec3 backgroundColor = vec3(0.0, 0.0, 0.0);

  vec3 color = overlap ? flowerColor : backgroundColor;

  gl_FragColor = vec4(color, 1.0);
}
