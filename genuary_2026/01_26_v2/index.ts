import p5 from "p5";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

let rects: Rect[] = [];

const sketch = (p: p5) => {
  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    rects = [new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)];
  };

  p.draw = () => {
    rects = recurse(p, rects);
  };
};

new p5(sketch);

function recurse(p: p5, rects: Rect[]): Rect[] {
  if (rects.length >= 10_000) {
    p.noLoop();
    return rects; // base case
  }
  const new_rects = [];

  for (const rect of rects) {
    const { x, y, width, height } = rect.get();
    // step 1: draw something
    const color = p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255));
    p.fill(color);
    p.rect(x, y, width, height);

    // step 2: split into rects
    const start_x = x;
    const start_y = y;
    const end_x = start_x + width;
    const end_y = start_y + height;

    const num_cols = Math.floor(p.random(1, 10)); // todo: change based on num rects?
    const num_rows = Math.floor(p.random(1, 10));

    // split cols evenly, split rows unevenly
    const col_width = (end_x - start_x) / num_cols;
    const row_heights = Array.from({ length: num_rows }, (_, idx) => idx).map(
      (idx) => {
        //  |||||||
        //   |||||
        //    |||
        //     |
        const idx_normed = (idx - num_rows / 2) / num_rows;
        const idx_sq = idx_normed * idx_normed;
        const row_height = p.lerp(start_y, end_y, Math.abs(idx_sq));
        return row_height;
      },
    );

    for (let i = 0; i < num_cols; i++) {
      for (let j = 0; j < num_rows; j++) {
        new_rects.push(
          new Rect(
            start_x + i * col_width,
            start_y +
              row_heights.reduce(
                (acc, height, idx) => (idx < j ? acc + height : acc + 0),
                0,
              ),
            col_width,
            row_heights[j],
          ),
        );
      }
    }
  }

  return new_rects;
}

class Rect {
  public x;
  public y;
  public width;
  public height;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
