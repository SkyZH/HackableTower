export const COS = (time: number, T?: number, start?: number, end?: number) => (Math.cos(time / (T || 1) * Math.PI * 2) + 1) / 2 * ((end || 1) - (start || 0)) + (start || 0);
