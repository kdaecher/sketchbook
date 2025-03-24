#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec2 rotate2d(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}
// 2D Random
float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f * f * (3.0 - 2.0 * f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}
vec4 rect(float x, float y, float width, float height, vec3 color, vec2 st) {
    vec2 bl = step(vec2(x, y), st);
    vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
    float pct = bl.x * bl.y * tr.x * tr.y;
    return vec4(pct * color, 1.0);
}

float rect(float x, float y, float width, float height, vec2 st) {
    vec2 bl = step(vec2(x, y), st);
    vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
    float pct = bl.x * bl.y * tr.x * tr.y;
    return pct;
}

float lines(in vec2 pos, float b) {
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0, .5 + b * .5, abs((sin(pos.x * 3.1415) + b * 2.0)) * .5);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec2 pos = vec2(st * 10.);
    pos = rotate2d(pos, noise(pos));

    float rect1 = rect(0.0, 0.0, 0.2, 1., pos);
    float rect2 = rect(0.4, 0.0, 0.6, 1., pos);
    float rect3 = rect(0.7, 0.0, 0.3, 1., pos);

    // float pct = rect1 + rect2 + rect3;
    float pct = lines(pos, 0.5);
    gl_FragColor = vec4(vec3(pct), 1.0);
}
