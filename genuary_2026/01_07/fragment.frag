precision highp float;

varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform int u_numFlowers;

const int MAX_FLOWERS = 20;

uniform vec3 u_flowerPos[MAX_FLOWERS]; //position (xy), rotation
uniform vec4 u_flowerParams[MAX_FLOWERS]; //petalLength, petalWidth, petalCount, filled (1.0 or 0.0)
uniform float u_flowerCenter[MAX_FLOWERS]; //centerRadius

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Circle SDF
float circleSDF(vec2 p, vec2 center, float radius) {
  return length(p - center) - radius;
}

// Floral SDF - returns signed distance to flower shape (petals + center circle)
float floralSDF(vec2 p, vec2 center, float rotation, float petalCount,
                float petalLength, float petalWidth, float centerRadius) {
  // Translate to flower center
  vec2 pos = p - center;

  // Rotate
  pos = rotate2D(rotation) * pos;

  // Convert to polar coordinates
  float angle = atan(pos.y, pos.x);
  float radius = length(pos);

  // Create petal pattern using sine modulation
  float petalAngle = petalCount * angle;
  float petalModulation = sin(petalAngle) * 0.5 + 0.5;

  // Calculate petal radius at this angle
  float baseRadius = petalLength * 0.3;
  float petalRadius = baseRadius + petalLength * petalModulation * petalWidth;

  // Distance from petal edge
  float petalDist = radius - petalRadius;

  // Distance from center circle
  float circleDist = circleSDF(p, center, centerRadius);

  // Union of petals and center circle (min combines both shapes)
  return min(petalDist, circleDist);
}

void main() {
  vec2 uv = vTexCoord;
  vec2 pos = (uv * u_resolution) - u_resolution * 0.5;

  int numColorA = 0;
  int numColorB = 0;
  float minDist = 1e10;

  for (int i = 0; i < MAX_FLOWERS; i++) {
    if (i >= u_numFlowers) break;

    vec2 center = u_flowerPos[i].xy;
    float rotation = u_flowerPos[i].z;

    float petalLength = u_flowerParams[i].x;
    float petalWidth = u_flowerParams[i].y;
    float petalCount = u_flowerParams[i].z;
    float filled = u_flowerParams[i].w;
    float centerRadius = u_flowerCenter[i];

    float d = floralSDF(pos, center, rotation, petalCount,
                        petalLength * u_resolution.x, petalWidth, centerRadius * u_resolution.x);

    minDist = min(minDist, abs(d));

    // Check if point is inside this flower
    if (d < 0.0) {
     if (filled > 0.5) {
      numColorA++;
     } else {
      numColorB++;
     }
    }
  }

  // Boolean logic: XOR - filled if odd number of filled shapes contain this point
  // bool overlap = mod(float(numFlower), 2.0) > 0.5;

  // Colors
  vec3 colorA = vec3(0.961, 0.259, 0.259);
  vec3 colorAA = vec3(1., 0., 0);
  vec3 colorBB = vec3(0., .4, .3);
  vec3 colorB = vec3(0.451, 0.702, 0.361);
  vec3 colorAB = vec3(0.369, 0.635, 1);
  vec3 backgroundColor = vec3(0,0,0); 

  vec3 color;
  if (numColorA == 0 && numColorB == 0) {
    color = backgroundColor;
  } else {
    if (numColorA == 1 && numColorB == 0) { // A
      color = colorA;
    } else if (numColorB == 1 && numColorA == 0) { // B
      color = colorB;
    } else if (numColorA > 1 && numColorB == 0) { // A && A && !B
      color = colorAA;
    } else if (numColorB > 1 && numColorA == 0) { // B && B && !A
      color = colorBB;
    } else { // A && B
      color = colorAB;
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
