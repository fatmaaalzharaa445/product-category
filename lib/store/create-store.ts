export interface Store<T> {
  getSnapshot(): T;
  subscribe(listener: () => void): () => void;
  setState(updater: (prev: T) => T): void;
  hydrate(value: T): void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setState(updater) {
      state = updater(state);
      listeners.forEach((listener) => listener());
    },
    hydrate(value) {
      state = value;
    },
  };
}
