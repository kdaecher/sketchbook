precision mediump float;

varying vec2 pos;

uniform sampler2D filter_background;
uniform vec2 filter_res;


void main() {
  gl_FragColor = vec4(0., 0., .3, 1.);
}