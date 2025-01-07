#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#include "lygia/math/parabola.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 rect (float x, float y, float width, float height, vec3 color, vec2 st) {
  vec2 bl = step(vec2(x, y), st);
  vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
  float pct = bl.x * bl.y * tr.x * tr.y;
  return vec4(pct * color, 1.0);
}

vec4 rectOutline (float x, float y, float width, float height, vec3 color, float outlineWidth, vec2 st) {
  vec2 bl = step(vec2(x, y), st);
  vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
  float pct = bl.x * bl.y * tr.x * tr.y;

  vec2 bli = step(vec2(x + outlineWidth, y + outlineWidth), st);
  vec2 tri = step(vec2(1.0 - width - x + outlineWidth, 1.0 - height - y + outlineWidth), 1.0 - st);
  float outline = bli.x * bli.y * tri.x * tri.y;

  return vec4((pct - outline) * color, 1.0);
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  vec3 red = vec3(0.6, 0.0, 0.0);
  vec3 beige = vec3(218.0/255.0, 217.0/255.0, 200.0/255.0);
  vec3 yellow = vec3(217.0/255.0, 197.0/255.0, 108.0/255.0);
  vec3 blue = vec3(19.0/255.0, 78.0/255.0, 189.0/255.0);

  vec4 red1 = rect(0.0, 0.8, 0.1, 0.2, red, st);
  vec4 red2 = rect(0.15, 0.8, 0.15, 0.2, red, st);
  vec4 red3 = rect(0.0, 0.55, 0.1, 0.2, red, st);
  vec4 red4 = rect(0.15, 0.55, 0.15, 0.2, red, st);

  vec4 beige1 = rect(0.35, 0.8, 0.3, 0.2, beige, st);
  vec4 beige2 = rect(0.35, 0.55, 0.3, 0.2, beige, st);
  vec4 beige3 = rect(0.35, 0.2, 0.3, 0.3, beige, st);
  vec4 beige4 = rect(0.35, 0.0, 0.3, 0.15, beige, st);
  vec4 beige5 = rect(0.0, 0.0, 0.3, 0.5, beige, st);
  vec4 beige6 = rect(0.7, 0.8, 0.2, 0.2, beige, st);
  vec4 beige7 = rect(0.7, 0.55, 0.2, 0.2, beige, st);
  vec4 beige8 = rect(0.7, 0.2, 0.2, 0.3, beige, st);
  vec4 beige9 = rect(0.95, 0.2, 0.05, 0.3, beige, st);

  vec4 yellow1 = rect(0.95, 0.8, 0.05, 0.2, yellow, st);
  vec4 yellow2 = rect(0.95, 0.55, 0.05, 0.2, yellow, st);


  vec4 blue1 = rect(0.7, 0.0, 0.2, 0.15, blue, st);
  vec4 blue2 = rect(0.95, 0.0, 0.05, 0.15, blue, st);


  gl_FragColor =
    red1 +
    red2 +
    red3 +
    red4 +
    beige1 +
    beige2 +
    beige3 +
    beige4 +
    beige5 +
    beige6 +
    beige7 + 
    beige8 +
    beige9 + 
    yellow1 +
    yellow2 +
    blue1 +
    blue2;

}