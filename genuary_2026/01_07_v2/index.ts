import p5 from "p5";

const CANVAS_WIDTH = window.innerWidth - 20;
const CANVAS_HEIGHT = window.innerHeight - 40;

let s: p5.Shader;

const NUM_FLOWERS = 7;

interface Petal {
  x: number;
  y: number;
  rotation: number;
  length: number;
  width: number;
  waveFreq: number;
  waveAmp: number;
}

interface Flower {
  x: number;
  y: number;
  rotation: number;
  petalCount: number;
  petalLength: number;
  petalWidth: number;
  centerRadius: number;
  innerRadius: number;
  filled: boolean;
  petals: Petal[];
}

const flowers: Flower[] = [];

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p.WEBGL);
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
    const flowerCenterData: number[] = [];
    const flowerInnerData: number[] = [];
    const flowerFilledData: number[] = [];
    const flowerPetalStartData: number[] = [];
    const flowerPetalEndData: number[] = [];

    const allPetalsPos: number[] = [];
    const allPetalsParams: number[] = [];

    // Flatten all petals into one array
    let currentPetalIndex = 0;
    for (let i = 0; i < flowers.length; i++) {
      const f = flowers[i];
      flowerPosData.push(f.x, f.y, f.rotation);
      flowerCenterData.push(f.centerRadius);
      flowerInnerData.push(f.innerRadius);
      flowerFilledData.push(f.filled ? 1.0 : 0.0);

      // Record start and end indices for this flower's petals
      const petalStart = currentPetalIndex;
      flowerPetalStartData.push(petalStart);

      // Add all petals for this flower
      for (let j = 0; j < f.petals.length; j++) {
        const petal = f.petals[j];
        allPetalsPos.push(petal.x, petal.y, petal.rotation);
        allPetalsParams.push(petal.length, petal.width, petal.waveFreq, petal.waveAmp);
        currentPetalIndex++;
      }

      flowerPetalEndData.push(currentPetalIndex);
    }

    s.setUniform('u_flowerPos', flowerPosData);
    s.setUniform('u_flowerCenter', flowerCenterData);
    s.setUniform('u_flowerInner', flowerInnerData);
    s.setUniform('u_flowerFilled', flowerFilledData);
    s.setUniform('u_flowerPetalStart', flowerPetalStartData);
    s.setUniform('u_flowerPetalEnd', flowerPetalEndData);
    s.setUniform('u_allPetalsPos', allPetalsPos);
    s.setUniform('u_allPetalsParams', allPetalsParams);

    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

new p5(sketch);

function generate_flower(p: p5, canvasWidth: number, canvasHeight: number): Flower {
  const petalLength = p.random(0.05, 0.15);
  const normalizedPetalLength = petalLength * Math.min(canvasWidth, canvasHeight);
  const petalCount = Math.floor(p.random(5, 7));
  const petalWidth = p.random(0.4, 0.7);
  const centerRadius = p.random(0.1, 0.25) * petalLength;
  const innerRadius =  p.random(0.01, p.min(0.05, petalLength));

  const flowerX = p.random(-canvasWidth * 0.4, canvasWidth * 0.4);
  const flowerY = p.random(-canvasHeight * 0.4, canvasHeight * 0.4);
  const flowerRotation = p.random(0, p.TWO_PI);

  const petals: Petal[] = [];

  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 / petalCount) * i + flowerRotation;
    const waveFrequency = p.random(8.0, 12.0);
    const waveAmplitude = normalizedPetalLength * p.random(0.02, 0.06);

    // Offset petal along its rotation direction
    const offset = normalizedPetalLength;
    const petalX = flowerX + Math.cos(angle) * offset;
    const petalY = flowerY + Math.sin(angle) * offset;

    petals.push({
      x: petalX,
      y: petalY,
      rotation: angle,
      length: normalizedPetalLength,
      width: petalWidth,
      waveFreq: waveFrequency,
      waveAmp: waveAmplitude
    });
  }

  return {
    x: flowerX,
    y: flowerY,
    rotation: flowerRotation,
    petalCount: petalCount,
    petalLength: petalLength,
    petalWidth: petalWidth,
    centerRadius: centerRadius * Math.min(canvasWidth, canvasHeight),
    innerRadius: innerRadius * Math.min(canvasWidth, canvasHeight),
    filled: p.random() > 0.5,
    petals: petals
  };
}
