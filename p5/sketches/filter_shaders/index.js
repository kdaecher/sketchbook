let myFilter;

function preload() {
  myFilter = loadShader("filter.vert", "filter.frag");
}


function setup() {
  createCanvas(600, 600);
}

function draw() {

  // rect(100,100)
  filterShader(myFilter);
}
