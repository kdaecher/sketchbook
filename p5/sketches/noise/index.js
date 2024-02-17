function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  // fill('purple');
  fill('blue');
  noLoop();
}
  

function draw() {
  clear();
  for (let x = 100; x < 700; x+=1) {
    for (let y=100; y < 500; y+=1) {
      // var x2 = x + 100*noise(x/100, y/100, Date.now()/1000) - 50;
      // var y2 = y + 100*noise(y/100, x/100, Date.now()/1000) - 50;

      var x2 = x + 100*noise(x/100, y/100) - 50;
      var y2 = y + 100*noise(y/100, x/100) - 50;

      circle(x2, y2, 1);
    }
  }
}
