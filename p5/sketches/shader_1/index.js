let shader1;
let backgroundImage;

function preload() {
  shader1 = loadShader('vertex.vert', 'fragment.frag');

  backgroundImage = loadImage('IMG_8403.jpg');
}

function setup() {
  createCanvas(600, 600, WEBGL);

  const gfx = createGraphics(300,300);

  gfx.shader(shader1);
  shader1.setUniform("background", backgroundImage);
  const col = [1,0,1]; 
  const col2= [0,1,1];
  const colors = [...col,...col2];
  shader1.setUniform("colors", colors);
  const circles = [];
  const numCircles = 100;
  for (let i = 0; i <numCircles; i++) {
    circles.push(random(), random(), random(0.05, 0.01))
  }
  shader1.setUniform("circles", circles);
  noStroke();
}

function draw() {
  shader1.setUniform("millis", millis());
  rect(0, 0, width, height);
}
