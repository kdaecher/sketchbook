function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('black');
  colorMode(HSB);
  noStroke();
  // noLoop();
}

function draw() {
  clear();
  for (x=0; x < 500; x+=1) {
    for (y=200; y <500; y+=1) {
      var x2 = x + y/2;
      var h = 200*noise(x/200, y/200);
      h += 30*noise(x/20, y/20);


      var y2 = y - h + 50;

      var hue = (h +180) % 360;
      var brightness = h * 0.75;

      fill(hue, 80, brightness, 0.3);

      circle(x2, y2, 2);

    }
  }
}
