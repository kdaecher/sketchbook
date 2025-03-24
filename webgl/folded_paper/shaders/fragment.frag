#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
// uniform float u_time;
uniform vec2 u_mouse;

vec2 rotate2d(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float rand(float x) {
    float y = fract(sin(x) * 100000.0);
    return y;
}

// 2D Random
float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x), mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
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

float shape(vec2 st, float radius, out float f) {
    float u_time = 3.0;
    st = vec2(0.5) - st;
    float r = length(st) * 2.0;
    float a = atan(st.y, st.x) * 0.2;
    float m = abs(mod(a + u_time * 2., 3.14 * 2.) - 3.14) / 3.6;
    f = radius;
    m += noise(st + u_time * 0.1) * .5;

    f += sin(a * 50.) * noise(st + u_time * .2) * .01;
    f += (sin(a * 20.) * .1 * pow(m, 2.));
    return 1. - smoothstep(f, f + 0.007, r);
}

// float shapeBorder(vec2 st, float radius, float width) {
//     return shape(st, radius) - shape(st, radius - width);
// }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float f;
    float radius = 0.8;
    float blobRadius = shape(st, radius, f);

    vec3 blob = vec3(blobRadius);

    vec3 color = vec3(1.0 - distance(vec2(0.5), st * f));

    gl_FragColor = vec4(vec3(color * blob), 1.0);
}