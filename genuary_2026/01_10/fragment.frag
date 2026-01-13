precision highp float;
varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), f);
}

float fractalNoise(float x) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for(int i = 0; i < 4; i++) {
    value += amplitude * noise(x * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

void main() {
  vec2 uv = vTexCoord;

  // Reflect across y = -x axis (swap and negate)
  uv = vec2(uv.y, -uv.x);

  vec2 pos =  vec2(0.5) - uv;

  float time = u_time * 0.001;
  float twinkle1 = fractalNoise(time * 0.5) * 2.0 - 1.0;
  float twinkle2 = fractalNoise(time * 0.3 + 100.0) * 2.0 - 1.0;
  float twinkle3 = fractalNoise(time * 0.7 + 200.0) * 2.0 - 1.0;
  
  float twinkle = (twinkle1 + twinkle2 * 0.5 + twinkle3 * 0.3) * 0.5;


  float r = length(pos) + twinkle;
  float a = atan(pos.y, pos.x) + 14150. * 0.0005;
  float f = tan(a) * tan(a * a * a * a);

  float offset = 0.002;

  vec2 posR = pos + vec2(offset, 0.0);
  float rR = (length(posR)) + twinkle;
  float aR = atan(posR.y, posR.x) + 14150. * 0.0005;
  float fR = tan(aR) * tan(aR * aR * aR * aR);
  float red = 1.0 - smoothstep(fR, fR + 0.01, rR);

  float green = 1.0 - smoothstep(f, f + 0.01, r);
  
  vec2 posB = pos - vec2(offset, 0.0);
  float rB = (length(posB)) + twinkle;
  float aB = atan(posB.y, posB.x) + 14150. * 0.0005;
  float fB = tan(aB) * tan(aB * aB * aB * aB);
  float blue = 1.0 - smoothstep(fB, fB + 0.01, rB);

  vec3 color = vec3(red, green, blue);

  gl_FragColor = vec4(color, 1.0);
}
