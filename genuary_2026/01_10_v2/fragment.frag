precision highp float;
varying vec2 vTexCoord;

uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main() {
  vec2 uv = vTexCoord;

  float gridSize = 5.0;
  vec2 gridCoord = floor(uv * gridSize); 
  uv = fract(uv * gridSize);

  vec2 pos =  vec2(0.5) - uv;

  float r = (length(pos) * 3.);
  float a = atan(pos.y, pos.x);
  float f = abs(cos(a*2.5))*.5+.3;
  vec3 color = vec3(1.0 -smoothstep(f,f+.01,r));

  vec3 foregroundColor = vec3(1, 0, 0.804);
  foregroundColor = vec3(random(gridCoord), 0, 0.1);

  vec3 backgroundColor = vec3(0.086, 0.561, 0.341);

  backgroundColor = vec3(0.086, 0.561 + random(gridCoord) * 0.15, 0.341);
  // vec3 centerColor = vec3(1, 0.427, 0); 
  vec3 centerColor = vec3(1, random(gridCoord), 0);

  float centerDist = length(pos);
  float circle = smoothstep(0.15, 0.14, centerDist*1.4);

  color = mix(backgroundColor, foregroundColor, color);
  color = mix(color, centerColor, circle);

  gl_FragColor = vec4(color, 1.0);
}
