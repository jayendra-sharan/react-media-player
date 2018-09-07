export const getOffsetLeft = (el) => {
  let l = 0;
  do {
    l += el.offsetLeft
  } while (el = el.offsetParent);
  return l;
}