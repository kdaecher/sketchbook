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

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    float numRows = 50.;
    float row = floor(st.y * numRows) + 1.;

    float numCols = floor(random(vec2(row)) * 100.);

    float col = floor(st.x * numCols) + 1.;

    st = st * vec2(numCols, numRows);

    float xOffset = u_time * 2. + random(vec2(row)) * 100.;

    // even rows
    if (mod(row, 2.0) == 0.0) {
        st.x -= xOffset;
    }

    // odd rows
    if (mod(row, 2.0) == 1.0) {
        st.x += xOffset;
    }

    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    // float rndRow = random(ipos);
    // if (rndRow > 0.5) {
    //     st.x += 0.5;
    // }

    float rnd = random(vec2(mod(ipos.x, numCols), ipos.y));

    vec3 comp = vec3(0.0);
    float threshold = fract(u_mouse.x);
    if (rnd > threshold) {
        comp = vec3(1.0);
    }

    gl_FragColor = vec4(comp, 1.0);
}
