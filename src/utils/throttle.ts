export function throttle(func: (...props: any) => any, ms: number): (...args: any) => any {
  let isThrottled = false;
  let savedArgs: any;
  let savedThis: any;

  function wrapper(...args: any) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
