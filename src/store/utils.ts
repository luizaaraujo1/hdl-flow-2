type StateUpdater<S> = S | ((prevState: S) => S);

export function createSetter<S, K extends keyof S>(
  set: (fn: (state: S) => S) => void,
  key: K,
) {
  return (update: StateUpdater<S[K]>) => {
    set((state: S) => ({
      ...state,
      [key]:
        typeof update === 'function'
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            (update as Function)(state[key])
          : update,
    }));
  };
}
