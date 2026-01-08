import p5 from "p5";

const CANVAS_WIDTH = window.innerWidth-20;
const CANVAS_HEIGHT = window.innerHeight - 40;

let s: p5.Shader;

const NUM_FLOWERS = 5;
const flowers: Flower[] = [];

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT, p.WEBGL);
    s = await p.loadShader('vertex.vert', 'fragment.frag');
    for (let i = 0; i < NUM_FLOWERS; i++) {
      flowers.push(generate_flower(p, CANVAS_WIDTH, CANVAS_HEIGHT));
    }
  };

  p.draw = () => {
    p.shader(s);
    s.setUniform('u_resolution', [CANVAS_WIDTH, CANVAS_HEIGHT]);
    s.setUniform('u_numFlowers', flowers.length);

    const flowerPosData: number[] = [];
    const flowerParamsData: number[] = [];
    const flowerCenterData: number[] = [];
    for (let i = 0; i < flowers.length; i++) {
      const f = flowers[i];
      flowerPosData.push(f.x, f.y, f.rotation); // u_flowerPos: x, y, rotation
      flowerParamsData.push(f.petalLength, f.petalWidth, f.petalCount, f.filled ? 1.0 : 0.0); // u_flowerParams: petalLength, petalWidth, petalCount, filled
      flowerCenterData.push(f.centerRadius);
    }

    s.setUniform('u_flowerPos', flowerPosData);
    s.setUniform('u_flowerParams', flowerParamsData);
    s.setUniform('u_flowerCenter', flowerCenterData);
    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

new p5(sketch);


interface Flower {
  x: number;
  y: number;
  rotation: number;
  petalCount: number;
  petalLength: number;
  petalWidth: number;
  centerRadius: number;
  filled: boolean;
}

function generate_flower(p: p5, canvasWidth: number, canvasHeight: number): Flower {
  const petalLength = p.random(0.08, 0.35);
  return {
    x: p.random(-canvasWidth * 0.4, canvasWidth * 0.4),
    y: p.random(-canvasHeight * 0.4, canvasHeight * 0.4),
    rotation: p.random(0, p.TWO_PI),
    petalCount: Math.floor(p.random(5, 12)),
    petalLength: petalLength,
    petalWidth: p.random(0.3, 0.8),
    centerRadius: p.random(0.1, 0.3) * petalLength,
    filled: p.random() > 0.5,
  };
}