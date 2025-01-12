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

  float radius = 0.5 * abs(sin(u_time));
  vec4 circle = circle(st, vec2(0.5), radius, vec3(1.0, 0.0, 0.98));

	gl_FragColor = circle;
}