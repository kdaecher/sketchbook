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

    st = rotate2D(st, PI * 0.25);
    
    float grid_size = 4.0;
    float row = floor(st.y * grid_size);
    float col = floor(st.x * grid_size);
    st = tile(st,grid_size);
    vec3 comp = vec3(
        step(0.5, mod(row, 2.0)) * 0.25,
        step(0.5, mod(row, 2.0)) * 0.25,
        step(0.5, mod(row, 2.0)) * 0.25
    ) + vec3(
        step(0.5, mod(col, 2.0)) * 0.25,
        step(0.5, mod(col, 2.0)) * 0.25,
        step(0.5, mod(col, 2.0)) * 0.25
    );

    // save the current state
    vec2 prev_st = st;

    float subgrid_size = 2.0 + step(0.5, mod(row + 0.5, 2.0));
    float subgrid_row = floor(st.y * subgrid_size);
    float subgrid_col = floor(st.x * subgrid_size);
    st = tile(st, subgrid_size);
    vec3 comp2 = vec3(
        step(0.5, mod(subgrid_col, 2.0)) * 0.25,
        step(0.5, mod(subgrid_row, 2.0)) * 0.25,
        0.2
    );

    // untile 
    st = prev_st;

    float subgrid_2_size = 1.0 + step(0.5, mod(col + 0.5, 2.0));
    float subgrid_2_row = floor(st.y * subgrid_2_size);
    float subgrid_2_col = floor(st.x * subgrid_2_size);
    st = tile(st, subgrid_2_size);
    vec3 comp3 = vec3(
        step(0.5, mod(subgrid_2_col + 1., 2.0)) * 0.125,
        step(0.5, mod(subgrid_2_row + 1., 2.0)) * 0.125,
        step(0.5, mod(subgrid_2_row+subgrid_2_col + 1., 2.0)) * 0.25
    );

    gl_FragColor = vec4(comp + comp2 + comp3,1.0);
}