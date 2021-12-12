// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// TODO: remove any :D

export function debounce(
  func: (...props: any[]) => any,
  wait: number,
  immediate: boolean,
): (...args: any[]) => void {
  let timeout: any;
  return function debouncedFunc(...args: any[]) {
    const context = this as any;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
