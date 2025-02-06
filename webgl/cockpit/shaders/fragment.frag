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

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  vec3 white = vec3(1.0, 1.0, 1.0);

  vec3 color1 = vec3(abs(sin(sqrt(u_time))), abs(cos(sqrt(u_time))), abs(sin(.7 * u_time)));

  vec3 color2 = vec3(abs(cos(sqrt(u_time))), abs(cos(2. * u_time)), abs(sin(sqrt(u_time))));

  vec3 color3 = white;

  vec3 color4 = white;

  vec3 color5 = vec3(abs(sin(u_time)), abs(cos(u_time)), abs(sin(u_time * 2.)));

  vec3 color6 = vec3(abs(.5 * sin(u_time)), abs(.3 * sin(u_time)), abs(sin(cos(u_time))));

  vec3 color7 = vec3(1.0, 1.0, 1.0);

  // scale 1
  st -= vec2(0.5);
  st = scale(vec2(cos(u_time) + 3.)) * st;
  st += vec2(0.5);

  // circle 1
  st -= vec2(0.5);
  vec3 circle1 = circleOutline(st, vec2(0.0, 0.0), 0.3, color1);
  st += vec2(0.5);

  // descale 1
  st -= vec2(0.5);
  st = scale(1. / vec2(cos(u_time) + 3.)) * st;
  st += vec2(0.5);

  // scale 2
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  st = scale(vec2(cos(u_time) + 3.)) * st;
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // circle 2
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  vec3 circle2 = circleOutline(st, vec2(0.0, 0.0), 0.3, color2);
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // descale 2
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  st = scale(1. / vec2(cos(u_time) + 3.)) * st;
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // scale 3
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  st = scale(vec2(cos(u_time) + 3.)) * st;
  st -= vec2(0.3, 0.0);
  st += vec2(0.5);

  // circle 3
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  vec3 circle3 = circleOutline(st, vec2(0.0, 0.0), 0.3, color3);
  st -= vec2(0.3, 0.0);
  st += vec2(0.5);

  // descale 3
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  st = scale(1. / vec2(cos(u_time) + 3.)) * st;
  st -= vec2(0.3, 0.0);
  st += vec2(0.5);

  // scale 4
  st -= vec2(0.5);
  st = scale(vec2(sin(u_time) + 3.)) * st;
  st += vec2(0.5);

  // circle 4
  st -= vec2(0.5);
  vec3 circle4 = circleOutline(st, vec2(0., 0.0), 0.3, color4);
  st += vec2(0.5);

  // descale 4
  st -= vec2(0.5);
  st = scale(1. / vec2(sin(u_time) + 3.)) * st;
  st += vec2(0.5);

  // scale 5
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  st = scale(vec2(sin(u_time) + 3.)) * st;
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // circle 5
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  vec3 circle5 = circleOutline(st, vec2(0.0, 0.0), 0.3, color5);
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // descale 5
  st -= vec2(0.5);
  st -= vec2(0.3, 0.0);
  st = scale(1. / vec2(sin(u_time) + 3.)) * st;
  st += vec2(0.3, 0.0);
  st += vec2(0.5);

  // scale 6
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  st = scale(vec2(sin(u_time) + 3.)) * st;
  st -= vec2(0.3, 0.0);
  st += vec2(0.5);

  // circle 6
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  vec3 circle6 = circleOutline(st, vec2(0.0, 0.0), 0.3, color6);
  st -= (0.3, 0.0);
  st += vec2(0.5);

  // descale 6
  st -= vec2(0.5);
  st += vec2(0.3, 0.0);
  st = scale(1. / vec2(sin(u_time) + 3.)) * st;
  st -= vec2(0.3, 0.0);
  st += vec2(0.5);

  // rotate 
  // st -= vec2(0.5);
  // st = rotate2d(sin(u_time) + cos(u_time)) * st;
  // st = scale(vec2(sin(u_time) + 3.)) * st;
  // st += vec2(0.5);

  // st -= vec2(0.5);
  // vec3 circle7 = vec3(cross(st, 0.04));
  // st += vec2(0.5);

  vec3 composition = circle1 + circle2 + circle3 + circle4 + circle5 + circle6;

  gl_FragColor = vec4(composition, 1.0);
}
