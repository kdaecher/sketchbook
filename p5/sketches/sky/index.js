function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB);
  noStroke();
  noLoop();
}

function draw() {
  for (let x = 0; x < 400; x+=2) {
    for (let y=0; y < 400; y+=2) {
      let sat = 100*noise(x/100, y/100);
      fill(220, sat, 100);
      circle(x, y, 5)
    }
  }
}
