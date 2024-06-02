
export const computeCost = (x: number[], y: number[], w: number, b: number): number => {
    const m = x.length;
    let cost = 0;

    for (let i = 0; i < m; i++) {
        let f_wb = w * x[i] + b;
        cost = cost + ((f_wb - y[i]) ** 2);
    }

    const totalCost = 1 / (2 * m) * cost;
    return totalCost;
}

export const computeGradient = (x: number[], y: number[], w: number, b: number): { dj_dw: number, dj_db: number } => {
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

export const gradientDescent = (
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