#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718


float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

vec4 polygon(vec2 st, int numSides, float radius, vec2 center) {
  // Remap the space to -1. to 1.
  st = st *2.-1. - center;
  float a = atan(st.x, st.y) + PI;
  float r = TWO_PI/float(numSides);
  float d = cos(floor(.5+a/r)*r-a)*length(st) * (1./radius);
  vec3 result = vec3(1.0-smoothstep(.4,.41,d));
  return vec4(result, 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  gl_FragColor = polygon(st, 5, 0.5, vec2(0.2)) + polygon(st, 4, 0.5, vec2(-0.2, 0.5));
}

