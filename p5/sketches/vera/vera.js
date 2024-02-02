const maxLen = 400;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
}

function draw() {
  let size = 20;
	
	for (let x=size; x <maxLen-2.5*size; x+=size) {
		noFill();
		stroke(214, 0, 0);
		translate(maxLen/2, maxLen/2);

		rectMode(CENTER);
		if (Math.random() > 0.88) {
			rotate(getRandomInt(1, 40));
		}
		rect(0, 0, x);
		resetMatrix();
	}
}

