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

  // float gridSize = 1.0;
  // vec2 gridCoord = floor(uv * gridSize); 
  // uv = fract(uv * gridSize);

  vec2 pos =  vec2(0.5) - uv;

  float r = length(pos) *20.;
  float a = atan(pos.y, pos.x);
  float lineWidth = 0.05;

  float f1 = -cos(a);
  vec3 color1 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f1)));

  float f2 = cos(a);
  vec3 color2 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f2)));

  float f3 = -sin(a);
  vec3 color3 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f3)));

  float f4 = sin(a);
  vec3 color4 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f4)));

  float f5 = -2.*cos(a);
  vec3 color5 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f5)));

  float f6 = 2.*cos(a);
  vec3 color6= vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f6)));

  float f7= -2.*sin(a);
  vec3 color7 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f7)));

  float f8 = 2.*sin(a);
  vec3 color8 = vec3(1.0 - smoothstep(lineWidth, lineWidth + 0.01, abs(r - f8)));


  vec3 ring1 = 
  color1 + 
  color2 + 
  color3 + 
  color4;

  vec3 ring2 =
  color5 + 
  color6 +
  color7 +
  color8;


  vec3 ring1Color = vec3(0.31, 0.651, 0.812);
  vec3 ring2Color = vec3(0.31, 0.651, 0.812);

  vec3 backgroundColor = vec3(1.);

  vec3 color = mix(backgroundColor, ring1Color, ring1);
  color=mix(color, ring2Color, ring2);
  gl_FragColor = vec4(color, 1.0);
}
