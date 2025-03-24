precision mediump float;
uniform vec2 u_resolution;
uniform float u_sound;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float multipler = 1. / u_sound;

  float pct = 1.0 - step(1.0, multipler * distance(st, vec2(0.5)));\

  gl_FragColor = vec4(vec3(pct), 1.0);
}