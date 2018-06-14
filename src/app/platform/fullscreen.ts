export const requestFullscreen = () => {
  var el = document.documentElement,
    rfs = el['requestFullscreen']
      || el['webkitRequestFullScreen']
      || el['mozRequestFullScreen']
      || el['msRequestFullscreen']
  ;

  rfs.call(el);
};

export const requestExitFullscreen = () => {
  var el = document,
    rfs = el['exitFullscreen']
      || el['webkitExitFullscreen']
      || el['mozCancelFullScreen']
      || el['msExitFullscreen']
  ;

  rfs.call(el);
};
