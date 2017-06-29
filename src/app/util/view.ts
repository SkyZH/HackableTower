export const bound = () => {
  const _width = window.innerWidth;
  const _height = window.innerHeight;
  return [Math.ceil(_width), Math.ceil(_width / 16 * 9)]
};
