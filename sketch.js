const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const COLS = 600;
const ROWS = 600;
const CELL = 1;

canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;

let gridA = new Float32Array(COLS * ROWS).fill(1);
let gridB = new Float32Array(COLS * ROWS).fill(0);
let nextA = new Float32Array(COLS * ROWS);
let nextB = new Float32Array(COLS * ROWS);
let stepsPerFrame = 5;

function idx(x, y) { return y * COLS + x; }

function init() {
  gridA.fill(1);
  gridB.fill(0);
  for (let i = 0; i < COLS * ROWS; i++) {
    if (Math.random() < 0.05) {
      gridB[i] = 1;
      gridA[i] = 0;
    }
  }
}
init();

const dA = 0.8;
let dB = 0.4;
let feed = 0.055;
let kill = 0.062;
let dt = 0.3;

function simulate() {
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      const i = idx(x, y);
      const a = gridA[i];
      const b = gridB[i];

      const lapA =
        gridA[idx(x-1,y)] + gridA[idx(x+1,y)] +
        gridA[idx(x,y-1)] + gridA[idx(x,y+1)] - 4 * a;

      const lapB =
        gridB[idx(x-1,y)] + gridB[idx(x+1,y)] +
        gridB[idx(x,y-1)] + gridB[idx(x,y+1)] - 4 * b;

      const reaction = a * b * b;

      nextA[i] = Math.max(0, Math.min(1, a + dt * (dA * lapA - reaction + feed * (1 - a))));
      nextB[i] = Math.max(0, Math.min(1, b + dt * (dB * lapB + reaction - (kill + feed) * b)));
    }
  }

  // fix border pixels to safe values
  for (let x = 0; x < COLS; x++) {
    nextA[idx(x, 0)] = 1; nextB[idx(x, 0)] = 0;
    nextA[idx(x, ROWS-1)] = 1; nextB[idx(x, ROWS-1)] = 0;
  }
  for (let y = 0; y < ROWS; y++) {
    nextA[idx(0, y)] = 1; nextB[idx(0, y)] = 0;
    nextA[idx(COLS-1, y)] = 1; nextB[idx(COLS-1, y)] = 0;
  }

  [gridA, nextA] = [nextA, gridA];
  [gridB, nextB] = [nextB, gridB];
}

function lerp(a, b, t) { return a + (b - a) * t; }

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function render() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  data.fill(255);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const a = gridA[idx(x, y)];
      const b = gridB[idx(x, y)];
      const t = Math.max(0, Math.min(1, a - b));

      const r = Math.floor(lerp(0, 15, t) + lerp(15, 240, smoothstep(0.3, 0.7, t)));
      const g = Math.floor(lerp(0, 80, t) + lerp(80, 200, smoothstep(0.4, 0.8, t)));
      const bl = Math.floor(lerp(20, 120, t) + lerp(120, 255, smoothstep(0.5, 1.0, t)));

      const p = (y * canvas.width + x) * 4;
      data[p]   = Math.min(255, r);
      data[p+1] = Math.min(255, g);
      data[p+2] = Math.min(255, bl);
      data[p+3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function loop() {
  for (let i = 0; i < stepsPerFrame; i++) simulate();
  render();
  requestAnimationFrame(loop);
}

function setPreset(f, k, db, newDt, spf) {
  feed = f;
  kill = k;
  dB = db;
  dt = newDt;
  stepsPerFrame = spf;
  feedSlider.value = f;
  killSlider.value = k;
  speedSlider.value = spf;
  feedVal.textContent = f.toFixed(3);
  killVal.textContent = k.toFixed(3);
  speedVal.textContent = spf;
  init();
}

const feedSlider = document.getElementById('feedSlider');
const killSlider = document.getElementById('killSlider');
const feedVal = document.getElementById('feedVal');
const killVal = document.getElementById('killVal');
const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');

speedSlider.addEventListener('input', () => {
  stepsPerFrame = parseInt(speedSlider.value);
  speedVal.textContent = stepsPerFrame;
});

feedSlider.addEventListener('input', () => {
  feed = parseFloat(feedSlider.value);
  feedVal.textContent = feed.toFixed(3);
});

killSlider.addEventListener('input', () => {
  kill = parseFloat(killSlider.value);
  killVal.textContent = kill.toFixed(3);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  feed = 0.055;
  kill = 0.062;
  dB = 0.4;
  dt = 0.3;
  stepsPerFrame = 5;
  feedSlider.value = 0.055;
  killSlider.value = 0.062;
  speedSlider.value = 5;
  feedVal.textContent = '0.055';
  killVal.textContent = '0.062';
  speedVal.textContent = '5';
  init();
});

document.getElementById('clearBtn').addEventListener('click', () => {
  gridA.fill(1);
  gridB.fill(0);
  nextA.fill(0);
  nextB.fill(0);
  const cx = Math.floor(COLS / 2);
  const cy = Math.floor(ROWS / 2);
  gridB[idx(cx, cy)] = 1;
  gridA[idx(cx, cy)] = 0;
});

loop();