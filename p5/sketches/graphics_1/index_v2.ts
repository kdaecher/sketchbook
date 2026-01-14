import p5 from 'p5';

let img: p5.Image;
let cam: p5.MediaElement;

const sketch = (p: p5) => {
  let angle = 0;

  p.setup = async () => {
    img = await p.loadImage('IMG_8403.jpg')
    p.createCanvas(400, 400, p.WEBGL);
    cam = p.createCapture(p.VIDEO)
    cam.size(400,400);
    cam.hide();
  };

  p.draw = () => {
    let dx = p.mouseX - p.width/2;
    console.log('dx', dx);
    let dy = p.mouseY- p.width/2;
    console.log('dy', dy);
    let v = p.createVector(-dx,-dy,-1);
    v.normalize();
    console.log(v);
    p.background(175);
    p.noStroke();
    p.orbitControl();

    // p.ambientLight(255);

    // p.directionalLight(255,0,0,v);
    p.pointLight(255,0,0,dx, dy, 0);

    p.push()
    p.rotateX(angle * 0.05);
    p.rotateY(angle * 0.3);
    p.rotateZ(angle * 0.02);
    p.texture(cam);
    p.box(100);
    p.pop();

    p.push();
    p.translate(-200, 0);
    p.sphere(50);
    p.ambientMaterial(255, 0, 0);
    p.pop();

    angle += 0.07;
  };
};

new p5(sketch);
