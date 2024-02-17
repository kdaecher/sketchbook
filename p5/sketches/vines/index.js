const i = Math.floor(window.innerWidth/40);
let xs;
let ys;
let steps;
let left_right;
let currentStep;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  stroke(93, 149, 33);

  xs = Array.from(Array(i), (_, index) => index*40+10);
  ys = Array(i).fill(0);
  left_right = Array(i).fill('');
  steps = ["down", "out", "up", "back"];
  currentStep = "down";
}

function down(x, y) {
	const y2 = getRandomInt(y+10, y+50);
	line(x, y, x, y2); 
  return y2;
}

function out(x, y) {
	const x2 = Math.random() < 0.5 ? 
		getRandomInt(x+5, x+20) : // right
		getRandomInt(x-20, x-5); // left
	line(x, y, x2, y);
  return x2;
}

function up(x, y) {
  const y2 = getRandomInt(y-5, y-20);
	line(x, y, x, y2);
  return y2;
}

function back(x, y, left_right) {
  const x2 = left_right === 'left' ?
    getRandomInt(x+5, x+20) : //right
    getRandomInt(x-20, x-5); // left
  line(x, y, x2, y);
  return x2;
}

function draw() {
  for (let j = 0; j < i; j++) {
		const x = xs[j];
		const y = ys[j];

    let y2;
    let x2;
		
		if (y < window.innerHeight) {
      switch(currentStep) {
        case "down":
          y2 = down(x,y);
          break;
        case "out":
          x2 = out(x, y);
          left_right[j] = x2 > x ? 'right' : 'left';
          break;
        case "up":
          y2 = up(x,y);
          break;
        case "back":
          x2 = back(x, y, left_right[j]);
      }

      if (y2) {
        ys[j] = y2;
      }
      if (x2) {
        xs[j] = x2;
      }
		}
	}
  currentStep = steps[(steps.indexOf(currentStep) + 1)%steps.length];
}
