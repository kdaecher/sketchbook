precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 circleOutline(vec2 st, vec2 center, float radius, vec3 color) {
  vec2 l = st - vec2(center);
  float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
  float radiusInner = radius - 0.03;
  float pctInner = 1.0 - smoothstep(radiusInner - (radiusInner * -.01), radiusInner + (radiusInner * 0.01), dot(l, l) * 4.0);
  float circle = pct - pctInner;
  return vec3(circle * color);
}

vec3 circle(vec2 st, vec2 center, float radius, vec3 color) {
  vec2 l = st - vec2(center);
  float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
  return vec3(pct * color);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
              sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale) {
  return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

vec2 tile(in vec2 _st, in float _size) {
  _st *= _size;
  return fract(_st);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  float grid_size = 3.0;

  float row = floor(st.y * grid_size);
  float col = floor(st.x * grid_size);

  st = tile(st, grid_size);

  float sq0 = step(row, 0.0) * step(0.0, row) * step(col, 0.0) * step(0.0, col);
  float sq1 = step(row, 0.0) * step(0.0, row) * step(col, 1.0) * step(1.0, col);
  float sq2 = step(row, 0.0) * step(0.0, row) * step(col, 2.0) * step(2.0, col);
  float sq3 = step(row, 1.0) * step(1.0, row) * step(col, 0.0) * step(0.0, col);
  float sq4 = step(row, 1.0) * step(1.0, row) * step(col, 1.0) * step(1.0, col);
  float sq5 = step(row, 1.0) * step(1.0, row) * step(col, 2.0) * step(2.0, col);
  float sq6 = step(row, 2.0) * step(2.0, row) * step(col, 0.0) * step(0.0, col);
  float sq7 = step(row, 2.0) * step(2.0, row) * step(col, 1.0) * step(1.0, col);
  float sq8 = step(row, 2.0) * step(2.0, row) * step(col, 2.0) * step(2.0, col);

  vec3 color = vec3(1.0, 0.0, 0.67);

  float drawCircle = sq0 + sq4 + sq8;

  vec3 circle = circle(st, vec2(0.5, 0.5), 0.5, color) * vec3(drawCircle);

  vec3 color2 = vec3(0.0, 0.0, 1.0);

  st -= vec2(0.5);
  st *= rotate2d(45. * PI / 180.);
  st += vec2(0.5);

  float drawCross = sq6 + sq7;

  vec3 cross = vec3(cross(st, 0.5)) * color2 * vec3(drawCross);

  gl_FragColor = vec4(circle  + cross, 1.0);
}
