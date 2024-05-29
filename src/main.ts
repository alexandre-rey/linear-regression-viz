import { lineY, plot, ruleY } from '@observablehq/plot';
import { dataset } from './data'
import './style.css'

const xTrain = dataset.map((row) => row[0]);
const yTrain = dataset.map((row) => row[2]);

// MinMax Scaling
const normalizeInput = (input: number[]): number[] => {
  const maxX = Math.max(...input);
  const minX = Math.min(...input);

  const output = input.map(x => (x - minX) / (maxX - minX));
  return output;

}

const denormalizeInput = (xNorm: number, input: number[]): number => {
  const maxX = Math.max(...input);
  const minX = Math.min(...input);
  return xNorm * (maxX - minX) + minX;
}

const computeCost = (x: number[], y: number[], w: number, b: number): number => {
  const m = x.length;
  let cost = 0;

  for (let i = 0; i < m; i++) {
    let f_wb = w * x[i] + b;
    cost = cost + ((f_wb - y[i]) ** 2);
  }

  const totalCost = 1 / (2 * m) * cost;
  return totalCost;
}

const computeGradient = (x: number[], y: number[], w: number, b: number): { dj_dw: number, dj_db: number } => {
  const m = x.length;
  let dj_dw = 0;
  let dj_db = 0;

  for (let i = 0; i < m; i++) {
    let f_wb = w * x[i] + b;
    let dj_dw_i = (f_wb - y[i]) * x[i];
    let dj_db_i = (f_wb - y[i]);
    dj_dw += dj_dw_i;
    dj_db += dj_db_i;
  }

  dj_dw = dj_dw / m;
  dj_db = dj_db / m;

  return {
    dj_dw: dj_dw,
    dj_db: dj_db
  }
}

const gradientDescent = (
  x: number[],
  y: number[],
  w_in: number,
  b_in: number,
  alpha: number,
  num_iters: number,
  cost_function: (x: number[], y: number[], w: number, b: number) => number,
  gradient_function: (x: number[], y: number[], w: number, b: number) => { dj_dw: number, dj_db: number }
): {
  w: number,
  b: number,
  J_history: number[],
  p_history: number[]
} => {

  const J_history: number[] = [];
  const p_history: number[] = [];
  let b = b_in;
  let w = w_in;

  for (let i = 0; i < num_iters; i++) {
    const { dj_dw, dj_db } = gradient_function(x, y, w, b);

    b = b - alpha * dj_db;
    w = w - alpha * dj_dw;

    if (i < 100_000) {
      J_history.push(cost_function(x, y, w, b));
    }

    if (i % Math.ceil(num_iters / 10) === 0) {
      console.log(`Iteration: ${i} Cost: ${J_history[-1]} dj_dw: ${dj_dw} dj_db: ${dj_db} w: ${w} b: ${b}`);
    }
  }

  return {
    w: w,
    b: b,
    J_history: J_history,
    p_history: p_history
  }
}

const normalizedX = normalizeInput(xTrain);
const normalizedY = normalizeInput(yTrain);

const chartData = normalizedX.map((x, i) => {
  return {
    x: x,
    y: normalizedY[i]
  }
}).sort((a, b) => a.x - b.x);

const w_init = 0;
const b_init = 0;

const iterations = 10_000;
const alpha = 0.01;

const result = gradientDescent(normalizedX, normalizedX, w_init, b_init, alpha, iterations, computeCost, computeGradient);

console.log(`f"(w,b) found by gradient descent: (${result.w}, ${result.b})`);

const testResult = [
  { x: 0, y: result.w * 0 + result.b },
  { x: 0.5, y: result.w * 0.5 + result.b },
  { x: 1, y: result.w * 1 + result.b }
]

console.log(testResult);


const graph = plot({
  marginLeft: 50,
  marks: [
    ruleY([0]),
    lineY(chartData, { x: 'x', y: 'y', stroke: 'blue' }),
    lineY(testResult, { x: 'x', y: 'y', stroke: 'red' })
  ]
});

const rawChartData = xTrain.map((x, i) => {
  return {
    x: x,
    y: yTrain[i] / 1_000
  }
}).sort((a, b) => a.x - b.x);
const rawGraph = plot({
  marks: [
    ruleY([0]),
    lineY(rawChartData, { x: 'x', y: 'y' }),
  ]
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p>w: ${result.w} b: ${result.b}</p>
    ${graph.outerHTML}
    ${rawGraph.outerHTML}
  </div>
`
