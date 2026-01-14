import p5 from 'p5';

let img: p5.Image;
let shader1: p5.Shader;

const sketch = (p: p5) => {
  let angle = 0;

  p.setup = async () => {
    img = await p.loadImage('IMG_8403.jpg')
    shader1 = await p.loadShader('vertex.vert', 'fragment.frag');
    p.createCanvas(400, 400, p.WEBGL);

    shader1.setUniform("background", img);
    const col = [1,0,1]; 
    const col2= [0,1,1];
    const colors = [...col,...col2];
    shader1.setUniform("colors", colors);
    const circles: Array<number> = [];
    const numCircles = 100;
    for (let i = 0; i <numCircles; i++) {
      circles.push(p.random(), p.random(), p.random(0.05, 0.01))
    }
    shader1.setUniform("circles", circles);
  };

  p.draw = () => {
    let dx = p.mouseX - p.width/2;
    let dy = p.mouseY- p.width/2;
    let v = p.createVector(-dx,-dy,-1);
    v.normalize();
    p.background(175);
    p.noStroke();

    // let camX = p.map(p.mouseX, 0, p.width, -200,200)
    let camX = p.random(-5,5);
    let camY = p.random(-5,5);
    let camZ = p.random(-5,5);

    // p.camera(0,0,800,0,0,0,0,1,0);



    // let fov = p.map(p.mouseX, 0, 400, 0, p.PI);
    // let cameraZ =  800;
    // p.perspective(fov, p.width/p.height, cameraZ/10, cameraZ * 10 )
    // p.ortho();

    p.shader(shader1);


    // p.ambientLight(255);

    // p.directionalLight(255,0,0,v);
    // p.pointLight(255,0,0,dx, dy, 0);
    // p.push();
    p.rotateX(angle * 0.05);
    p.rotateY(angle * 0.3);
    p.rotateZ(angle * 0.02);

    // p.normalMaterial();

    p.sphere(10);
    // p.pop();

    // p.push()
    // p.translate(0, 200);
    // p.rotateX(p.HALF_PI)
    // p.ambientMaterial(0);

    // p.plane(400, 400);
    // p.pop();

   

    angle += 0.07;
  };
};

new p5(sketch);
