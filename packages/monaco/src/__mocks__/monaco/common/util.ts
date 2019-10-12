import { Emitter } from '@ali/ide-core-common/lib/event';

const emitters: Map<string, Emitter<any>> = new Map();

export function quickEvent<T>(name: string) {
  if (!emitters.has(name)) {
    emitters.set(name, new Emitter<T>());
  }
  return emitters.get(name)!.event;
}

export function quickFireEvent<T>(name: string, value: T) {
  if (emitters.has(name)) {
    emitters.get(name)!.fire(value);
  }
}

export function partialMock<T>(prefix: string, mocked: Partial<T>): T {
  return new Proxy(mocked, {
      get: (target, prop) => {
        if (target[prop]) {
          return target[prop];
        } else {
          console.warn(`调用了空mock方法${prefix}.${prop.toString()}`);
          return () => null;
        }
      },
    }) as T;
}
