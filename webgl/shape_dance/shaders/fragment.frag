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

float random(float x) {
    return fract(sin(x) * 10000.0);
}

float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float y = mix(random(i), random(i + 1.0), smoothstep(0., 1., f));
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

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float radius = noise(u_time);
    vec2 center = vec2(1.) - vec2(noise(u_time), noise(u_time + 1.));
    vec4 poly = polygon(st, 5, radius, center);
    vec4 color = vec4(0.5, .5, .9, 1.);

    vec2 center2 = vec2(.5) - vec2(noise(u_time + 3.), noise(u_time + 2.));
    vec4 poly2 = polygon(st, 8, radius, center2);
    vec4 color2 = vec4(0.9, .5, .5, 1.);

    vec2 center3 = vec2(0.25) - vec2(noise(u_time + 1.), noise(u_time + 2.));
    vec4 poly3 = polygon(st, 6, radius, center3);
    vec4 color3 = vec4(0.5, 0.9, 0.8, 1.0);

    gl_FragColor = poly * color + poly2 * color2 + poly3 * color3;
}
