function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
}

function draw() {
    let radius = 50
    for (let j=0; j <window.innerWidth; j+=radius) {
      for (let i=0; i <window.innerHeight; i+=radius) {
        fill(`${Math.random() < 0.5 ? "thistle" : "plum"}`);
        
        let rand = Math.random();
        
        ellipseMode(CORNER)
        if (rand > 0.66) {
          ellipse(i, j, radius);
        } else if (rand > 0.33 && rand <= 0.66) {
          rect(i, j, radius);
        } else {
          triangle(i, j+radius, i+(radius/2), j, i+radius, j+radius)
        }
      }
    }
}
