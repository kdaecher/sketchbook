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

  float r = length(pos)*1.5;
  float a = atan(pos.y,pos.x);

  // float f = cos(a*3.);
  // f = abs(cos(a*3.));
  // f = abs(cos(a*2.5))*.5+.3;
  // f = abs(cos(a*12.)+ sin(a*3.));
  float f = smoothstep(.5,2., cos(a*10.))*cos(u_time)/2.+0.2;

  result = vec3( 1.-step(f,r));
  // result = result * vec3(1.0, 0.0, 0.0);

  vec2 pos2 = vec2(0.5) - st;

  float r2 = length(pos2)*1.0;
  float a2 = atan(pos.y, pos.x);
  float f2 = smoothstep(-.5,1., cos(a2*10.))*abs(sin(u_time))/2.+0.05;
  
  result -= vec3(1.-step(f2,r2)) * vec3(0.0, abs(cos(u_time)), 0.);

  vec2 pos3 = vec2(0.5) - st;

  float r3 = length(pos3)*1.5;
  float a3 = atan(pos3.y, pos3.x);
  float f3 = smoothstep(-.5,1., abs(cos(a3*10.)))*sin(u_time)/2.+0.05;
  
  result += vec3(1.-step(f3,r3)) * vec3(0.0, 0.0, abs(sin(u_time)));


  // Remap the space to -1. to 1.
  st.x *= u_resolution.x/u_resolution.y;
  st = st *2.-1.;
  float dist = distance(st, vec2(0.0));

  // vec3 color = vec3((1.0 - sin(dist))/2., (1. - cos(dist))/2.,  (1. - sin(dist))/2.);

  gl_FragColor = vec4(result, 1.0);
}

