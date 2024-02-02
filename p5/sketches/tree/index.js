const width = window.innerWidth;
const height = window.innerHeight;

const center = width / 2;
const bottom = height;

let y1 = bottom;
let depth = 0;

let angle = 45;

let globalLen;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES);
  noLoop();

  // let angleInput = createInput();

  // angleInput.input(() => {
  //   angle = angleInput.value();
  //   clear();
  //   redraw();
  // });

  translate(width / 2, height);
  push();
  branch(150);
  translate(0, -150);
}

function branch(length) {
  pop();
  push();
  globalLen = length;
  redraw();
  translate(0, -length);
  if (length > 20) {
    push();
      rotate(angle);
      branch(length * .75);
    pop();
    push();
      rotate(-angle);
      branch(length* .75);
    pop();
  } 
}

function draw() {
  if (globalLen) {
    console.log('here');
    pop();
      line(0, 0, 0, -globalLen);
    push();
  }  
}
