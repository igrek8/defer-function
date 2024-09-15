export interface DeferFunction extends CallableFunction, Disposable, AsyncDisposable {
  <U extends any[], T extends (...args: U) => any>(fn: T, ...args: U): T;
}

class DeferredCall {
  constructor(
    public readonly fn: Function,
    public readonly args: unknown[],
  ) {}

  public call() {
    return this.fn(...this.args);
  }
}

function getDeferFunction(): DeferFunction {
  const stack: DeferredCall[] = [];
  function defer(fn: Function, ...args: unknown[]) {
    stack.push(new DeferredCall(fn, args));
  }
  Object.defineProperties(defer, {
    [Symbol.dispose]: {
      value() {
        for (let i = stack.length - 1; i >= 0; --i) {
          stack[i].call();
        }
      },
    },
    [Symbol.asyncDispose]: {
      async value() {
        for (let i = stack.length - 1; i >= 0; --i) {
          await stack[i].call();
        }
      },
    },
  });
  return defer as unknown as DeferFunction;
}

export default getDeferFunction;
