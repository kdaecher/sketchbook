#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// 2D Random
float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
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
    u = smoothstep(0., 1., f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

float rothko_noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f * f * (3.0 - 2.0 * f);
    u = smoothstep(0., 1., f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;

}

vec4 rect(float x, float y, float width, float height, vec3 color, vec2 st) {
    float n = noise(st) * 0.15;
    vec2 bl = step(vec2(x, y), st);
    vec2 tr = step(vec2(1.0 - width - x, 1.0 - height - y), 1.0 - st);
    float pct = bl.x * bl.y * tr.x * tr.y;

    color = color * (0.5 + noise(st) * 0.50);

    return vec4(pct * color, 1.0);
}

vec4 noise_rect(float x, float y, float width, float height, vec3 color, vec2 st) {
    float n = noise(st) * 0.15;
    vec2 bl = step(vec2(x - n, y - n), st);
    vec2 tr = step(vec2(1.0 - width - x + n, 1.0 - height - y + n), 1.0 - st);
    float pct = bl.x * bl.y * tr.x * tr.y;

    color = color * (0.5 + noise(st) * 0.50);
    return vec4(pct * color, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Scale the coordinate system to see
    // some noise in action
    // st += distance(st, vec2(random(st * u_time)));

    vec2 thirds = vec2(st * vec2(3.0, 1.0));

    // vec2 pos = vec2(thirds * vec2(10.0));

    // Use the noise function
    float n = noise(thirds);

    vec3 color = vec3(0.0);
    vec2 i = floor(st * vec2(10.0));
    if (i.x <= 3.0) {
        color = vec3(0.87, 0.26, 0.12);
    } else if (i.x <= 6.0) {
        color = vec3(0.5, 0.01, 0.01);
    } else {
        color = vec3(0.87, 0.82, 0.48);
    }

    vec2 pos = vec2(st * vec2(10.0));

    vec4 background = rect(0., 0., 10., 10., vec3(0.25, 0.0, 0.0), pos);

    vec4 rect1 = noise_rect(0.5, 0.6, 2.8, 9.0, vec3(0.62, 0.11, 0.08), pos);
    vec4 rect2 = noise_rect(3.6, 0.5, 3.9, 9.0, vec3(0.5, 0.01, 0.01), pos);
    vec4 rect3 = noise_rect(7.8, 1.0, 2.0, 8., vec3(0.87, 0.82, 0.48), pos);

    gl_FragColor = rect1 + rect2 + rect3 + background;
}
