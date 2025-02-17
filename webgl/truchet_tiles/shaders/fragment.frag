#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

vec3 circleOutline(vec2 st, vec2 center, float radius, vec3 color, float width) {
    vec2 l = st - vec2(center);
    float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
    float radiusInner = radius - width;
    float pctInner = 1.0 - smoothstep(radiusInner - (radiusInner * -.01), radiusInner + (radiusInner * 0.01), dot(l, l) * 4.0);
    float circle = pct - pctInner;
    return vec3(circle * color);
}

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float zoom = 12.0;

    float row = floor(st.y * zoom);
    float col = floor(st.x * zoom);

    // tile the space
    st = st * zoom;

    vec2 ipos = floor(st);
    st = fract(st);

    // rotate randomly
    float random = random(ipos);
    if (random > 0.75) {
        st = rotate2D(st, PI);
    } else if (random > 0.5) {
        st = rotate2D(st, PI * 0.5);
    } else if (random > 0.25) {
        st = rotate2D(st, PI * -0.5);
    }

    // make truchet tile
    float strokeWidth = 0.4;
    float radius = 1.0 + strokeWidth / 2.;
    vec3 comp = vec3(0.0);

    vec3 color = vec3(0.5, 0.0, 1.0 / zoom * col + (1.0 / zoom * st.x));
    // 1. top left quarter circle
    comp += circleOutline(st, vec2(0.0, 1.0), radius, color, strokeWidth);
    // 2. bottom right quarter circle
    comp += circleOutline(st, vec2(1.0, 0.0), radius, color, strokeWidth);

    gl_FragColor = vec4(comp, 1.0);
}
