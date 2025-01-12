#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 result = vec3(0.0);

  vec2 pos = vec2(0.5)-st;
  // vec2 pos = vec2(abs(cos(u_time)), abs(sin(u_time))) - st;
  // vec2 pos = st;

  // float time = sin(u_time);

  float r = length(pos)*2.;
  float a = atan(pos.y,pos.x);

  float f = distance(pos, vec2(0.2));

  float pedalGroup1 = sin(u_time)*10. + 3.;
  float pedalGroup2 = cos(u_time)*14. + 3.;

  float f2 = cos(a* 10. );

  result = vec3(plot(vec2(r, r), f2));
  // result = vec3(fract(f2*20.));

  // Remap the space to -1. to 1.
  st.x *= u_resolution.x/u_resolution.y;
  st = st *2.-1.;
  float dist = distance(st, vec2(0.0));

  // vec3 color = vec3((1.0 - sin(dist))/2., (1. - cos(dist))/2.,  (1. - sin(dist))/2.);

  gl_FragColor = vec4(result, 1.0);
}

