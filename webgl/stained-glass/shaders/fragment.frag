#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec4 rect (float x, float y, float width, float height, vec3 color, vec2 st) {
  vec2 bl = step(vec2(x, y), st);
  vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
  float pct = bl.x * bl.y * tr.x * tr.y;
  return vec4(pct * color, 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec4 rect1 = rect(0.3, 0.2, 0.3, 0.5, vec3(st, 1.0), st);
  vec4 rect2 = rect(0.62, 0.3, 0.15, 0.5, vec3(cos(st.x), sin(st.y), 1.0), st);
  vec4 rect3 = rect(0.79, 0.2, 0.2, 0.5, vec3(sin(st.x), cos(st.y), 1.0), st);
  gl_FragColor = rect1 + rect2 + rect3;
} 

