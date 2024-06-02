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

const iterations = 100_000;
const alpha = 0.01;

const result = gradientDescent(normalizedX, normalizedX, w_init, b_init, alpha, iterations, computeCost, computeGradient);

console.log(`f"(w,b) found by gradient descent: (${result.w}, ${result.b})`);

const predictValue = (input: number): number => {
  return denormalizeInput(result.w * normalizeInput(input, xTrain) + result.b, yTrain);
}

/**
 * Normalized Graph
 */

const normalizedData = normalizedX.map((x, i) => {
  return {
    x: x,
    y: normalizedY[i]
  }
}).sort((a, b) => a.x - b.x);

const normalizedResult = [
  { x: 0, y: result.w * 0 + result.b },
  { x: 0.5, y: result.w * 0.5 + result.b },
  { x: 1, y: result.w * 1 + result.b }
]

const normalizedGraph = plot({
  marginLeft: 50,
  marks: [
    ruleY([0]),
    lineY(normalizedData, { x: 'x', y: 'y', stroke: 'blue' }),
    lineY(normalizedResult, { x: 'x', y: 'y', stroke: 'red' })
  ]
});

/**
 * Original Graph
 */

const rawChartData = xTrain.map((x, i) => {
  return {
    x: x,
    y: yTrain[i] / 1_000
  }
}).sort((a, b) => a.x - b.x);

//testing on the training data to see how well the model fits, this is not a good practice, I know
const resultData = xTrain.map(val => {
  return {
    x: val,
    y: predictValue(val) / 1_000
  }
})


const rawGraph = plot({
  marks: [
    ruleY([0]),
    lineY(rawChartData, { x: 'x', y: 'y' }),
    lineY(resultData, { x: 'x', y: 'y', stroke: 'green' }),
  ],
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="card">
    <p>w: ${result.w} b: ${result.b}</p>
    <div class="graph">
      ${normalizedGraph.outerHTML}
      ${rawGraph.outerHTML}
    </div>
    <div class="results">
      <div class="tables">
        <div>
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
                <th>Predicted Output</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              ${xTrain.map((val, i) => `
                <tr>
                  <td>${val}</td>
                  <td>${yTrain[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                  <td>${Math.round(predictValue(val)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                  <td>${Math.round(predictValue(val) - yTrain[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="infos">
        <h2>Results</h2>
        <p>Mean Squared Error: ${result.J_history[result.J_history.length - 1]}</p>
        <p>Iterations: ${result.J_history.length}</p>
        <p>Learning Rate: ${alpha}</p>
        <p>Average Difference: ${xTrain.reduce((previousValue, currentValue, i) => { return Math.round(predictValue(currentValue) - yTrain[i]) }) / xTrain.length}</p>
      </div>
    </div>
  </div>
`
