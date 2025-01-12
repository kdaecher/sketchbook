#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 result = vec3(0.0);

  vec2 pos = vec2(0.5)-st;

  // float time = sin(u_time);

  float r = length(pos)*2.0;
  float a = atan(pos.y,pos.x);

  float f = cos(a*3.);
  // f = abs(cos(a*3.));
  // f = abs(cos(a*2.5))*.5+.3;
  f = abs(cos(a*12.*u_time)*sin(a*3.*u_time));
  // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

  result = vec3( 1.-smoothstep(f,f+0.02,r) );


  // Remap the space to -1. to 1.
  st.x *= u_resolution.x/u_resolution.y;
  st = st *2.-1.;
  float dist = distance(st, vec2(0.0));

  vec3 color = vec3((1.0 - sin(dist*u_time))/2., (1. - cos(dist*u_time))/2.,  (1. - sin(u_time))/2.);

  gl_FragColor = vec4(result * color, 1.0);
}

