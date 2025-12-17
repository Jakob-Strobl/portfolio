export function isIOS() {
  return /iPad|iPhone|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
}

export function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 1
  );
}
