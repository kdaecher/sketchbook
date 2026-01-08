import p5 from "p5";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

let s: p5.Shader;

const NUM_PETALS = 5;
const CENTER_RADIUS = 30.0;
const INNER_RADIUS = 10.0;

    const petalPosData: number[] = [];
    const petalParamsData: number[] = [];

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p.WEBGL);
    s = await p.loadShader('vertex.vert', 'fragment.frag');

    // Generate petals arranged in a circle
    const flowerCenter = [0.0, 0.0]; // Center of canvas
    const petalLength = 100.0;
    const petalWidth = 0.6;

    for (let i = 0; i < NUM_PETALS; i++) {
      const angle = (Math.PI * 2 / NUM_PETALS) * i;

      // Random wave parameters for each petal
      const waveFrequency = p.random(8.0, 10.0);
      const waveAmplitude = petalLength * p.random(0.02, 0.05);

      // Offset petal along its rotation direction so it radiates outward
      // Since the leaf is symmetric, offset by half its length so inner tip is at center
      const offset = petalLength; // Offset by 50% of petal length
      const petalX = flowerCenter[0] + Math.cos(angle) * offset;
      const petalY = flowerCenter[1] + Math.sin(angle) * offset;

      petalPosData.push(petalX, petalY, angle);
      petalParamsData.push(petalLength, petalWidth, waveFrequency, waveAmplitude);
    }
  };

  p.draw = () => {
    p.shader(s);
    s.setUniform('u_resolution', [CANVAS_WIDTH, CANVAS_HEIGHT]);
    s.setUniform('u_numPetals', NUM_PETALS);
    s.setUniform('u_centerRadius', CENTER_RADIUS);
    s.setUniform('u_innerRadius', INNER_RADIUS);
    s.setUniform('u_petalPos', petalPosData);
    s.setUniform('u_petalParams', petalParamsData);

    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

new p5(sketch);
