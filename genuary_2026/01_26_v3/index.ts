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

    const num_cols = Math.floor(p.random(1, 20)); // todo: change based on num rects?
    const num_rows = Math.floor(p.random(1, 20));

    // split cols evenly, split rows unevenly
    const col_widths = Array.from({ length: num_cols }, (_, idx) => idx).map(
      (idx) => {
        //  |||||||
        //   |||||
        //    |||
        //     |
        const idx_normed = (idx - num_cols / 2) / num_cols;
        const idx_sq = idx_normed * idx_normed;
        const col_width = p.lerp(start_x, end_x, Math.abs(idx_sq));
        return col_width;
      },
    );
    if (col_widths[num_cols - 1] < end_x) {
      col_widths.push(end_x - col_widths.reduce((acc, w) => acc + w, 0));
    }

    const row_heights = Array.from({ length: num_rows }, (_, idx) => idx).map(
      (idx) => {
        //  |||||||
        //   |||||
        //    |||
        //     |
        const idx_normed = (idx - num_rows / 2) / num_rows;
        const idx_sq = Math.pow(idx_normed, 2);
        const row_height = p.lerp(start_y, end_y, idx_sq);
        return row_height;
      },
    );
    if (row_heights[num_rows - 1] < end_y) {
      row_heights.push(end_y - row_heights.reduce((acc, h) => acc + h, 0));
    }

    for (let i = 0; i < col_widths.length; i++) {
      for (let j = 0; j < row_heights.length; j++) {
        const width = col_widths[i];
        const height = row_heights[j];
        if (width === 0 || height === 0) {
          continue;
        }

        new_rects.push(
          new Rect(
            start_x +
              col_widths.reduce(
                (acc, w, idx) => (idx < i ? acc + w : acc + 0),
                0,
              ),
            start_y +
              row_heights.reduce(
                (acc, h, idx) => (idx < j ? acc + h : acc + 0),
                0,
              ),
            width,
            height,
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
