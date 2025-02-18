#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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

float random(vec2 st, vec2 u_mouse, float u_time) {
    return fract(sin(dot(st.xy, vec2(u_mouse.x, u_mouse.y))) *
        23434.);
}

float rand(float x) {
    float y = fract(sin(x) * 100000.0);
    return y;
}

float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float y = mix(rand(i), rand(i + 1.0), smoothstep(0., 1., f));
    return y;
}

vec4 polygon(vec2 st, int numSides, float radius, vec2 center) {
    // Remap the space to -1. to 1.
    st = st * 2. - 1. - center;
    float a = atan(st.x, st.y) + PI;
    float r = 2. * PI / float(numSides);
    float d = cos(floor(.5 + a / r) * r - a) * length(st) * (1. / radius);
    vec3 result = vec3(1.0 - smoothstep(.4, .41, d));
    return vec4(result, 1.0);
}

vec4 circle(vec2 st, vec2 center, float radius, vec3 color) {
    float multiplier = 1.0 / radius;
    float pct = 1.0 - step(1.0, multiplier * distance(st, center));
    return vec4(pct * color, 1.0);
}

vec4 rect(float x, float y, float width, float height, vec3 color, vec2 st) {
    vec2 bl = step(vec2(x, y), st);
    vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
    float pct = bl.x * bl.y * tr.x * tr.y;
    return vec4(pct * color, 1.0);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float y1 = noise(dot(st.x + 10., st.y + 15.)) * 0.2;
    float y2 = noise(dot(st.x + 50., st.y + 50.)) * 0.1 * sin(u_time);
    float y = y1 + y2;

    vec2 pos = vec2(0.5) - st - y * 10.;

    // float r = length(pos) * 2.0;
    // float a = atan(pos.y, pos.x);
    // float f = cos(a * 5.);
    // vec3 pct = vec3(1. - smoothstep(f, f + 0.02, r));

    float pct = 1. - step(1., 10.0 * distance(vec2(y), vec2(0.5)));

    vec2 bl = step(vec2(0.2 + y, 0.2 + y), st);
    vec2 tr = step(vec2(1.0 - 0.3 - 0.2 - y, 0.8 - 0.3 - y), 1.0 - st);
    pct = bl.x * bl.y * tr.x * tr.y;

    vec3 color = vec3(0., 0., 1.0 - distance(st, vec2(0.5)));

    gl_FragColor = vec4(vec3(pct * color), 1.0);
}
