precision mediump float;

varying vec2 pos;

uniform sampler2D background;

uniform vec3 colors[2];

const int num_circles = 100;
uniform vec3 circles[num_circles];

void main() {
  // vec2 newPos = pos;
  // newPos.y = 1. - newPos.y;
  // vec4 col = texture2D(background, newPos);
  // float c = (sin(pos.x * 16. + millis/1000.) + 1.)/2.;
  // float c = abs(sin(pos.x * 16.));
  // vec3 circle = vec3(0.5, 0.5, 0.3);
  float color = 1.;
  for (int i =0; i < num_circles; i++) {
     float d = length(pos - circles[i].xy) - circles[i].z;
      d = step(0., d);
      color *= d;
  }
 
  gl_FragColor = vec4(vec3(color), 1.);
}