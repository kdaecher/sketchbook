precision mediump float;
uniform highp float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec4 u_color;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float dist = distance(uv, u_mouse);

  // Create a glowing circle around mouse
  vec4 mouseGlow = vec4(u_color.rgb, 1.0) * (1.0 - smoothstep(0.0, 0.2, dist));
  vec4 backgroundColor = vec4(0.1, 0.1, 0.1, 1.0);

  gl_FragColor = mix(backgroundColor, mouseGlow, mouseGlow.a);
}