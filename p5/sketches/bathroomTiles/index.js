function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  w = window.innerHeight
  gridWidth = w;
  gridHeight = w;
  hexagonSize = w/10
}


function drawHexagon(centerX, centerY, radius) {
  beginShape();

  for (let a = 0; a < TAU; a+=TAU/6) {

    // calculate the cartesian coordinates for a given angle and radius
    // and centered at the centerX and centerY coordinates
    var x = centerX + radius * cos(a);
    var y = centerY + radius * sin(a);

    // creating the vertex
    vertex(x, y);
  }

  // telling p5 that we are done positioning our vertices
  // and can now draw it to the canvas
  endShape(CLOSE);
}

function makeGrid(){
  for(y = 0; y < gridWidth; y+=hexagonSize){
    for(x = 0; x < gridHeight; x+=hexagonSize){

      // divide hexagon size by two
      // since we need to pass in the radius and not the diameter
      drawHexagon(x, y, hexagonSize/2)
    }
  }
}

function draw() {
  makeGrid()

}
