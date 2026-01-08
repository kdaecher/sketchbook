import p5 from "p5";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let s: p5.Shader;

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p.WEBGL);
    s = await p.loadShader('vertex.vert', 'fragment.frag');
  };

  p.draw = () => {
    p.shader(s);
    s.setUniform('u_resolution', [CANVAS_WIDTH, CANVAS_HEIGHT]);

    // Single petal in center of canvas
    s.setUniform('u_petalPos', [0.0, 0.0, 0.0]); // x, y, rotation
    s.setUniform('u_petalParams', [100.0, 0.4, 0.0, 0.0]); // length, width, unused, unused

    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

new p5(sketch);
