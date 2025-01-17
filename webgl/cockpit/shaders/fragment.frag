#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec4 circle(vec2 st, vec2 center, float radius, vec3 color) {
  float multiplier = 1.0/radius;
  float pct = 1.0 - step(1.0, multiplier*distance(st,center));
	return vec4(pct * color, 1.0);
}

float plot(vec2 st, float pct){
  return smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

vec4 rect (float x, float y, float width, float height, vec3 color, vec2 st) {
  vec2 bl = step(vec2(x, y), st);
  vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
  float pct = bl.x * bl.y * tr.x * tr.y;
  return vec4(pct * color, 1.0);
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st -= vec2(0.5);
  st = st*2.;

  st += vec2(0.3, 0.0);

  float pct = 1./0.3 * distance(st, vec2(0.5, 0.5));
  float outline = plot(st, pct);
  vec3 circle = vec3(outline);

  st -= vec2(0.5, 0.0);

  float pct2 = 1./0.3 * distance(st, vec2(0.5, 0.5));
  float outline2 = plot(st, pct2);
  vec3 circle2 = vec3(outline2);

  st -= vec2(0.5, 0.0);

  float pct3 = 1./0.3 * distance(st, vec2(0.5, 0.5));
  float outline3 = plot(st, pct3);
  vec3 circle3 = vec3(outline3);

  // undo transforms
  st += vec2(0.5, 0.);
  st += vec2(0.5, 0.);
  st -= vec2(0.3, 0.0);
  st = st/2.;
  st += vec2(0.5);
  // scale
  st = scale(vec2(2., 2.)) * st;

  //redo transforms
  st -= vec2(0.5);
  st = st*2.;
  st += vec2(0.3, 0.0);
  st -= vec2(0.5, 0.0);
  st -= vec2(0.5, 0.0);

  float pct4 = 1./0.3 * distance(st, vec2(0.5, 0.5));
  float outline4 = plot(st, pct4);
  vec3 circle4 = vec3(outline4);

  gl_FragColor = vec4(circle+circle2+circle3+circle4, 1.0);
} 

