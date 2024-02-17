function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  for (let i = 0; i < window.innerWidth; i+=5) {
    const r = 28;
    const g = 28;
    const b = 255*sq(sin(i/4));

    fill(r, g, b);
    rect(i, 0, 5, window.innerHeight);
  }
}

