import p5 from "p5";


const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

let s: p5.Shader;
let setupEndTime: number;

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT, p.WEBGL);
    s = await p.loadShader('vertex.vert', 'fragment.frag');
    setupEndTime = p.millis();
  };

  p.draw = () => {
    p.shader(s);
    s.setUniform('u_resolution', [CANVAS_WIDTH, CANVAS_HEIGHT]);
    const u_time = p.millis() - setupEndTime
    // console.log(u_time);
    s.setUniform('u_time', u_time);
    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

};

new p5(sketch);