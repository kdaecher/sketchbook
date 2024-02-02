function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB);
  noStroke();
}
  

function draw() {
  clear();
  for (let x = 100; x < 700; x+=2) {
    for (let y=100; y < 500; y+=2) {
      var xNoise1 = 100*noise(x/100, y/100, Date.now()/1000);

      var xNoise2 = 10*noise(x/20, y/20, Date.now()/20);

      var xNoiseTot = xNoise1 + xNoise2;

      var x2 = x + xNoiseTot - 50;
      var y2 = y + 100*noise(y/100, x/100, Date.now()/1000) - 50;

      var hue = map(xNoiseTot, 0, 100, 180, 360);

      fill(hue, 90, 70, 0.75);

      circle(x2, y2, 2);
    }
  }
}
