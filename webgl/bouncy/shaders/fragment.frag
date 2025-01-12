#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 circle(vec2 st, vec2 center, float radius, vec3 color) {
  float multiplier = 1.0/radius;
  float pct = 1.0 - step(1.0, multiplier*distance(st,center));
	return vec4(pct * color, 1.0);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  float radius1 = 0.25 * abs(sin(u_time));
  vec2 center1 = vec2(0.25, 0.25);
  vec3 color1 = vec3(1.0, 0.0, 0.98);
  vec4 circle1 = circle(st, center1, radius1, color1);

  float radius2 = 0.25 * abs(cos(u_time));
  vec2 center2 = vec2(0.5, 0.5);
  vec3 color2 = vec3(0.0, 0.0, 0.98);
  vec4 circle2 = circle(st, center2, radius2, color2);

  float radius3 = 0.25 * abs(sin(u_time));
  vec2 center3 = vec2(0.75, 0.75);
  vec3 color3 = vec3(0.05, 0.67, 0.37);
  vec4 circle3 = circle(st, center3, radius3, color3);

  float radius4 = 0.25 * abs(sin(u_time));
  vec2 center4 = vec2(0.75, 0.25);
  vec3 color4 = vec3(0.94, 0.62, 0.06);
  vec4 circle4 = circle(st, center4, radius4, color4);

  float radius5 = 0.25 * abs(sin(u_time));
  vec2 center5 = vec2(0.25, 0.75);
  vec3 color5 = vec3(0.63, 0.06, 0.94);
  vec4 circle5 = circle(st, center5, radius5, color5);

	gl_FragColor = circle1 + circle2 + circle3 + circle4 + circle5;
}