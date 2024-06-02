import { lineY, plot, ruleY } from '@observablehq/plot';
import { dataset } from './data'
import './style.css'
import { computeCost, computeGradient, gradientDescent } from './linear.regression';
import { denormalizeInput, normalizeInput } from './utils';

const xTrain = dataset.map((row) => row[0]);
const yTrain = dataset.map((row) => row[2]);

const normalizedX = xTrain.map((val) => normalizeInput(val, xTrain));
const normalizedY = yTrain.map((val) => normalizeInput(val, yTrain));


const w_init = 0;
const b_init = 0;

const iterations = 10_000;
const alpha = 0.01;

const result = gradientDescent(normalizedX, normalizedX, w_init, b_init, alpha, iterations, computeCost, computeGradient);

console.log(`f"(w,b) found by gradient descent: (${result.w}, ${result.b})`);

const normalizedResult = [
  { x: 0, y: result.w * 0 + result.b },
  { x: 0.5, y: result.w * 0.5 + result.b },
  { x: 1, y: result.w * 1 + result.b }
]

const test = result.w * normalizeInput(1250, xTrain) + result.b
console.log('raw output: ', test);
console.log('denormalized output: ', denormalizeInput(test, yTrain));

const normalizedData = normalizedX.map((x, i) => {
  return {
    x: x,
    y: normalizedY[i]
  }
}).sort((a, b) => a.x - b.x);

const normalizedGraph = plot({
  marginLeft: 50,
  marks: [
    ruleY([0]),
    lineY(normalizedData, { x: 'x', y: 'y', stroke: 'blue' }),
    lineY(normalizedResult, { x: 'x', y: 'y', stroke: 'red' })
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
    ${normalizedGraph.outerHTML}
    ${rawGraph.outerHTML}
  </div>
`
