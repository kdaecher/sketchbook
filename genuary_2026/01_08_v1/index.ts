/// <reference types="vite/client" />

import p5 from 'p5';

const imagesContext = import.meta.glob<ImageModule>('./images/*.{jpg,jpeg}', { eager: true });
const imagePaths: string[] = Object.values(imagesContext).map((img) => img.default);
let loadedImages: p5.Image[];
let shuffledImages: p5.Image[];
let packedRects: Record<string, Rect>;


const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(600, 600);
    loadedImages = await Promise.all(imagePaths.map(path => p.loadImage(path)));

    shuffledImages = [...loadedImages];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    const initialRects: Rect[] = []
    const targetSize = 100;

    for (const idx in shuffledImages) {
      const img = shuffledImages[idx];
      const x = p.random(0, p.width);
      const y = p.random(0, p.height);

      const maxDim = Math.max(img.width, img.height);
      const scale = targetSize / maxDim;

      const normalizedWidth = img.width * scale;
      const normalizedHeight = img.height * scale;

      // add some random scaling
      const s = p.random(0.8, 1.2);

      initialRects.push(new Rect(x, y, s*normalizedWidth, s*normalizedHeight, idx));
    }
    packedRects = packRects(initialRects, p.width, p.height);
    console.log(`Packed ${Object.keys(packedRects).length} rects`);
  };

  let animationCounter = 0;
  p.draw = () => {
    if (animationCounter === shuffledImages.length) {
      console.log('Done drawing all images');
      p.noLoop();
      return;
    }

    const img = shuffledImages[animationCounter];
    const rect = packedRects[animationCounter];
    animationCounter++;

    if (!rect) {
      console.log('No rect for this image', img);
      return;
    }

    p.image(img, rect.x, rect.y, rect.width, rect.height);
  }
}

new p5(sketch);

class Rect {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public id: string | null = null;

  constructor(x: number, y: number, width: number, height: number, id?: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    if (id) {
      this.id = id;
    }
  }

  static equals(r1: Rect, r2: Rect) {
    return r1.x === r2.x && r1.y === r2.y && r1.height === r2.height && r1.width === r2.width;
  }

  static overlaps(r1: Rect, r2: Rect) {
    return !(
      r1.x >= r2.x + r2.width ||
      r1.x + r1.width <= r2.x ||
      r1.y >= r2.y + r2.height ||
      r1.y + r1.height <= r2.y
    )
  }
}

function packRects(items: Rect[], containerWidth: number, containerHeight: number) {
  let freeRectangles: Rect[] = []
  freeRectangles.push(new Rect(0,0,containerWidth, containerHeight));

  // sort by area, but add randomness to break up the pattern
  items.sort((a,b) => {
    const areaA = a.height * a.width;
    const areaB = b.height * b.width;
    const randomFactor = (Math.random() - 0.5) * 0.3;
    return (areaA - areaB) * (1 + randomFactor);
  }).reverse();

  const result: Record<string, Rect> = {}
  for (const item of items) {
    let bestRect = findBestRect(item, freeRectangles);

    if (bestRect) {
      item.x = bestRect.x;
      item.y = bestRect.y;

      result[item.id!] = item;
      freeRectangles = splitRect(bestRect, item, freeRectangles);
      freeRectangles = pruneOverlappingRects(item, freeRectangles);

    } else {
      let numTries = 0;
      while (!bestRect && numTries < 6) {
        item.width = item.width * 0.9;
        item.height = item.height * 0.9;
        bestRect = findBestRect(item, freeRectangles);
        numTries++;
      }
      if (bestRect) {
        item.x = bestRect.x;
        item.y = bestRect.y;

        result[item.id!] = item;
        freeRectangles = splitRect(bestRect, item, freeRectangles);
        freeRectangles = pruneOverlappingRects(item, freeRectangles);
      }
    }
  }

  return result;
}

function findBestRect(item: Rect, freeRectangles: Rect[]): Rect | null {
  let bestRect: Rect | null = null;
  let bestScore = Infinity;
  for (const rect of freeRectangles) {
    if (item.width <= rect.width && item.height <= rect.height) {
      const score = calculateScore(item, rect);
      if (score < bestScore) {
        bestScore = score;
        bestRect = rect;
      }
    }
  }
  return bestRect;
}

function calculateScore(item: Rect, rect: Rect) {
  const leftoverX = rect.width - item.width;
  const leftoverY = rect.height - item.height;

  // Best short side fit (BSSF)
  const bssfScore = Math.min(leftoverX, leftoverY);

  // random bias based on position to distribute items more evenly
  const positionBias = Math.random() * (rect.x + rect.y) * 0.1;

  return bssfScore - positionBias;
}

function splitRect(usedRect: Rect, item: Rect, freeRectangles: Rect[]) {
  freeRectangles = freeRectangles.filter(i => !Rect.equals(i, usedRect));

  if (usedRect.width > item.width) {
    const newRect = new Rect(
      usedRect.x + item.width,
      usedRect.y,
      usedRect.width - item.width,
      usedRect.height,
    )
    freeRectangles.push(newRect);
  }
  if (usedRect.height > item.height) {
    const newRect = new Rect(
      usedRect.x,
      usedRect.y + item.height,
      usedRect.width,
      usedRect.height - item.height,
    )
    freeRectangles.push(newRect);
  }

  return freeRectangles;
}

function pruneOverlappingRects(item: Rect, freeRectangles: Rect[]) {
  const result: Rect[] = [];

  for (const rect of freeRectangles) {
    if (Rect.overlaps(item, rect)) {
      const splits = splitOverlappingRect(rect, item);
      result.push(...splits);
    } else {
      result.push(rect);
    }
  }
  // remove fully contained rectangles to prevent memory bloat
  return removeDuplicatesAndContained(result);
}

function splitOverlappingRect(rect: Rect, item: Rect): Rect[] {
  const splits: Rect[] = [];

  // left slice
  if (item.x > rect.x) {
    splits.push(new Rect(rect.x, rect.y, item.x - rect.x, rect.height));
  }
  // right slice
  if (item.x + item.width < rect.x + rect.width) {
    splits.push(new Rect(item.x + item.width, rect.y, rect.x + rect.width - (item.x + item.width), rect.height));
  }
  // bottom slice
  if (item.y > rect.y) {
    splits.push(new Rect(rect.x, rect.y, rect.width, item.y - rect.y));
  }
  // top slice
  if (item.y + item.height < rect.y + rect.height) {
    splits.push(new Rect(rect.x, item.y + item.height, rect.width, rect.y + rect.height - (item.y + item.height)));
  }

  return splits;
}

function removeDuplicatesAndContained(rects: Rect[]): Rect[] {
  const result: Rect[] = [];

  for (let i = 0; i < rects.length; i++) {
    let isContained = false;
    const rect1 = rects[i];

    for (let j = 0; j < rects.length; j++) {
      if (i === j) continue;
      const rect2 = rects[j];

      if (rect1.x >= rect2.x &&
          rect1.y >= rect2.y &&
          rect1.x + rect1.width <= rect2.x + rect2.width &&
          rect1.y + rect1.height <= rect2.y + rect2.height) {
        isContained = true;
        break;
      }
    }

    if (!isContained) {
      result.push(rect1);
    }
  }

  return result;
}