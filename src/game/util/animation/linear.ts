export const LINEAR = (time: number, T?: number, start?: number, end?: number) =>  time / T * ((end || 1) - (start || 0)) + (start || 0);
