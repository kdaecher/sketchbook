#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);

    // Cell positions
    vec2 point[5];
    point[0] = abs(vec2(0.83,0.75) - u_mouse);
    point[1] = abs(vec2(0.60,0.07) - u_mouse);
    point[2] = abs(vec2(0.28,0.64) - u_mouse);
    point[3] =  abs(vec2(0.31,0.26) - u_mouse);
    point[4] = u_mouse;

    float m_dist = 1.;  // minimum distance
    int m_index = 0;

    float m_r = 1.;
    float m_a = 1.;
    float m_f = 1.;
    

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        float dist = distance(st, point[i]);
        // Keep the closer distance
        if (dist < m_dist) {
            m_dist = dist;
            m_index = i;
        }


        // vec2 pos = vec2(point[i]) - st;

        // float r = length(pos)*2.0;
        // float a = atan(pos.y,pos.x);
        // float f = cos(a*3.);

        // if (a < m_a) {
        //     m_r = r;
        //     m_a = a;
        //     m_f = f;
        //     m_index = i;
        // }
    }


    vec3 m_color = vec3(1.0);
    if (m_index == 0) {
        m_color = vec3(0.3, 0.58, 0.65);
    } else if (m_index == 1) {
        m_color = vec3(0.57, 0.64, 0.25);
    } else if (m_index == 2) {
        m_color = vec3(0.54, 0.34, 0.57);
    } else if (m_index == 3) {
        m_color = vec3(0.19, 0.19, 0.46);
    } else if (m_index == 4) {
        m_color = vec3(0.28, 0.41, 0.18);
    }

    // Draw the min distance (distance field)
    color += m_color;
    // color = 1.0 - vec3( 1.-smoothstep(m_f,m_f+0.02,m_r) );
    // color = color * m_color;


    // Show isolines
    // color -= step(.7,abs(sin(50.0*m_dist)))*.3;

    

    gl_FragColor = vec4(color,1.0);
}
