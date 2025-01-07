#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#include "lygia/math/parabola.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 square (float len, float width, vec2 st) {
  vec2 bl = step(vec2(width, len), st);
  vec2 tr = step(vec2(width, len), 1.0 - st);
  float pct = bl.x * bl.y * tr.x * tr.y;
  return vec4(pct, 0, 0, 1.0);
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  // bottom-left
  // vec2 bl = smoothstep(0.0, 0.2, st);
  vec2 bl = floor(st + vec2(0.8));
  float pct = bl.x * bl.y; 

  // top-right
  // vec2 tr = smoothstep(0.0, 0.2, 1.0-st);
  vec2 tr = floor(vec2(1.8) - st);
  pct *= tr.x * tr.y;

  color = vec3(pct);

  // gl_FragColor = vec4(color,1.0);

  gl_FragColor = square(0.2, 0.1, st);
}