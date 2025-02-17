#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom) {
    _st *= _zoom;

    _st.x += step(1., mod(_st.y, 2.0)) * fract(u_time);
    _st.x -= (1.0 - step(1., mod(_st.y, 2.0))) * fract(u_time);

    return fract(_st);
}

vec2 brickTileVert(vec2 _st, float _zoom) {
    _st *= _zoom;

    _st.y += step(1., mod(_st.x, 2.0)) * fract(u_time);
    _st.y -= (1.0 - step(1., mod(_st.x, 2.0))) * fract(u_time);

    return fract(_st);
}

float box(vec2 _st, vec2 _size) {
    _size = vec2(0.5) - _size * 0.5;
    vec2 uv = smoothstep(_size, _size + vec2(1e-4), _st);
    uv *= smoothstep(_size, _size + vec2(1e-4), vec2(1.0) - _st);
    return uv.x * uv.y;
}

vec3 circle(vec2 st, vec2 center, float radius, vec3 color) {
    vec2 l = st - vec2(center);
    float pct = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(l, l) * 4.0);
    return vec3(pct * color);
}

void main(void) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 comp = vec3(0.0);

    float zoom = 6.0;
    float row = floor(st.y * zoom);
    float col = floor(st.x * zoom);

    float direction = step(1., 2. * cos(u_time * 4.));
    st = direction * brickTileVert(st, zoom) + (1.0 - direction) * brickTile(st, zoom);

    vec3 color = vec3(0.0, st.y, st.x);

    comp = circle(st, vec2(0.5), 0.4, color);

    gl_FragColor = vec4(comp, 1.0);
}
