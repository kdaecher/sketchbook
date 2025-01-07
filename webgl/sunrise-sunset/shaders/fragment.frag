#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#include "lygia/math/parabola.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.0,0.0,0.0);
vec3 colorB = vec3(52.0/255.0,171.0/255.0,235.0/255.0);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.y);

    pct.r = smoothstep(0.0, 1.0, abs(sin(u_time)));
    // pct.g = smoothstep(0.0, 1.0, abs(sin(0.66* u_time)));
    // pct.b = smoothstep( 0.0, 1.0, abs(sin(0.33 * u_time)));

    color = mix(colorA, colorB, pct);

    //Plot transition lines for each channel
    // color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    // color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    // color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}
