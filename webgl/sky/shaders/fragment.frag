precision mediump float;
uniform vec2 u_resolution;

// Simple noise function (approximation of Perlin noise)
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix 4 corners
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

// HSB to RGB conversion
vec3 hsb2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec2 pos = vec2(st * 10.);
    float sat = noise(pos);

    // Convert HSB to RGB
    // Hue: 220/360 = 0.611, Saturation: sat, Brightness: 1.0
    vec3 color = hsb2rgb(vec3(220.0 / 360.0, sat, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
