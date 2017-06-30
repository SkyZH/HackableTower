export const requestFullscreen = () => {
  var el = document.documentElement,
    rfs = el['requestFullscreen']
      || el['webkitRequestFullScreen']
      || el['mozRequestFullScreen']
      || el['msRequestFullscreen ']
  ;

  rfs.call(el);
};
