const size = 400;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
}

function draw() {
	let center = size/2
	
	// outline
	ellipse(center, center, getRandomInt(300,400), getRandomInt(300,400));
	
	let eyeHeight = center-center/2
	// left eye
	ellipse(eyeHeight, center - eyeHeight, getRandomInt(40,50), getRandomInt(20,25));
	
	// right eye
	ellipse(eyeHeight + center, center - eyeHeight, getRandomInt(40,50), getRandomInt(20,25));
	
	// nose
	triangle(center-getRandomInt(1,40), center + getRandomInt(1,40), center + getRandomInt(1, 40), center - getRandomInt(1, 40), center+getRandomInt(1, 10), center+getRandomInt(1, 40));
	
	// mouth
	let mouthHeight = center + center/2;
	line(getRandomInt(center - center/2,center), mouthHeight, getRandomInt(center, center+ center/2), mouthHeight);
}