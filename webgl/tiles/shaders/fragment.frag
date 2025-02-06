precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 circle(vec2 st, vec2 center, float radius, vec3 color) {
    vec2 l = st - vec2(center);
    float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
    return vec3(pct * color);
}

vec3 circleOutline(vec2 st, vec2 center, float radius, vec3 color, float width) {
  vec2 l = st - vec2(center);
  float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
  float radiusInner = radius - 0.03;
  float pctInner = 1.0 - smoothstep(radiusInner - (radiusInner * -.01), radiusInner + (radiusInner * 0.01), dot(l, l) * 4.0);
  float circle = pct - pctInner;
  return vec3(circle * color);
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

// float box(vec2 _st, vec2 _size, float _smoothEdges){
//     _size = vec2(0.5)-_size*0.5;
//     vec2 aa = vec2(_smoothEdges*0.5);
//     vec2 uv = smoothstep(_size,_size+aa,_st);
//     uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
//     return uv.x*uv.y;
// }

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

float boxOutline(in vec2 _st, in vec2 _size, in float _width){
    return box(_st, _size) - box(_st, _size - vec2(_width));
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/64.)) +
            box(_st, vec2(_size/64.,_size));
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // vec3 bigCircle = circleOutline(st, vec2(0.5), sin(u_time)*0.5+0.5, vec3(1.0), 0.01);

    float grid_size = 4.0;
    float row = floor(st.y * grid_size);
    float col = floor(st.x * grid_size);

    // Divide the space in 4
    st = tile(st,grid_size);

    // Use a matrix to rotate the space 45 degrees
    // st = rotate2D(st,u_time/50.*PI*2.00);

    vec3 circColor = vec3(0.62, sin(u_time), 0.62);
    
    vec3 circ = circleOutline(st, vec2(0.5), abs(sin(u_time)), circColor, 0.02);

    st = rotate2D(st, .25 * PI);
    vec3 cross = vec3(cross(st, abs(cos(u_time)) * sqrt(1. + 1.)));
    st = rotate2D(st, -.25 * PI);

    float lineWidth = 0.31;
    float lineWidth2 = .52;

    st += vec2(-0.5);
    st = rotate2D(st, u_time * .25 * PI);
    vec3 line = vec3(boxOutline(st, vec2(abs(cos(u_time))), 0.03) + boxOutline(st, vec2(abs(sin(u_time))), 0.03));
    st = rotate2D(st, -u_time * .25 * PI);
    st -= vec2(-0.5);

    st += vec2(0.5);
    st = rotate2D(st, u_time * .25 * PI);
    vec3 line2 = vec3(boxOutline(st, vec2(abs(cos(u_time))), 0.03) + boxOutline(st, vec2(abs(sin(u_time))), 0.03));
    st = rotate2D(st, -u_time * .25 * PI);
    st -= vec2(0.5);

    st += vec2(0.5, -0.5);
    st = rotate2D(st, u_time * .25 * PI);
    vec3 line3 = vec3(boxOutline(st, vec2(abs(cos(u_time))), 0.03) + boxOutline(st, vec2(abs(sin(u_time))), 0.03));
    st = rotate2D(st, -u_time *     .25 * PI);
    st -= vec2(0.5, -0.5);

    st += vec2(-0.5, 0.5);
    st = rotate2D(st, u_time * .25 * PI);
    vec3 line4 = vec3(boxOutline(st, vec2(abs(cos(u_time))), 0.03) + boxOutline(st, vec2(abs(sin(u_time))), 0.03));
    st = rotate2D(st, -u_time * .25 * PI);
    st -= vec2(-0.5, 0.5);

    vec3 negativeSpaceColor = vec3(0.0);
    vec3 negativeSpace = (1.
        - circleOutline(st, vec2(0.5), abs(sin(u_time)), vec3(1.0), 0.02)
        - cross * vec3(1.0, 1.0, 1.0)
        - line
        - line2
        - line3
        - line4) * negativeSpaceColor;

    vec3 crossColor = vec3(cos(u_time), 0.53, sin(u_time));
    vec3 crossWithColor = cross * crossColor;

    vec3 lineColor = vec3(1.0, 0.5, 0.0);

    vec3 comp =
        circ +
        negativeSpace +
        (line + line2 + line3 + line4) * crossColor;

    gl_FragColor = vec4(comp,1.0);
}