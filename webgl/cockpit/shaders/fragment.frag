#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

float circleOutline(vec2 st, vec2 center, float radius, vec3 color) {
  vec2 l = st-vec2(center);
  float pct = 1.-smoothstep(radius-(radius*0.01),
                         radius+(radius*0.01),
                         dot(l,l)*4.0);
  float radiusInner = radius - 0.03;
  float pctInner = 1.0 - smoothstep(radiusInner - (radiusInner*-.01), radiusInner + (radiusInner*0.01), dot(l,l)*4.0);
  return pct - pctInner; 
	// return vec4(pct * color, 1.0);
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
  return mat2(_scale.x,0.0, 0.0,_scale.y);
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st -= vec2(0.5);
  st = st*2.;

  float pct = circleOutline(st, vec2(0.0, 0.0), 0.3, vec3(1.0, 1.0, 1.0));
  vec3 circle = vec3(pct);

  st -= vec2(0.5, 0.0);

  float pct2 = circleOutline(st, vec2(0.0, 0.0), 0.3, vec3(1.0, 1.0, 1.0));
  vec3 circle2 = vec3(pct2);

  st += vec2(1.0, 0.0);

  float pct3 = circleOutline(st, vec2(0.0, 0.0), 0.3, vec3(1.0, 1.0, 1.0));
  vec3 circle3 = vec3(pct3);

  // undo transforms
  st -= vec2(1.0, 0.);
  st += vec2(0.5, 0.);
  st = st/2.;
  st += vec2(0.5);
  // scale
  st = scale(vec2(2., 2.)) * st;

  //redo transforms
  st -= vec2(0.5);
  st = st*2.;

  float pct4 = circleOutline(st, vec2(0.0, 0.0), 0.3, vec3(1.0, 1.0, 1.0));
  vec3 circle4 = vec3(pct4);

  gl_FragColor = vec4(circle+circle2+circle3+circle4, 1.0);
} 

