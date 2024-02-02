const maxLen = 400;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
}

function draw() {
  let size = 50;
	for (let y=0; y < maxLen/size; y+=1) {
		for (let x=0; x < maxLen/size; x+=1) {
			let color = abs(255*sin(x+y))
			fill(color, color, color);
			rect(x*size, y*size, size, size);
		}		
	}
}