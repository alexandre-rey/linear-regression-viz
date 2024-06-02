// MinMax Scaling
export const normalizeInput = (val: number, inputs: number[]): number => {
    const maxX = Math.max(...inputs);
    const minX = Math.min(...inputs);

    return (val - minX) / (maxX - minX)
}

export const denormalizeInput = (val: number, inputs: number[]): number => {
    const maxX = Math.max(...inputs);
    const minX = Math.min(...inputs);
    return val * (maxX - minX) + minX;
}