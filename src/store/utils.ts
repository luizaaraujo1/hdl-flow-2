import {SaveFileFormat} from './types';

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

export function generateAndExportFile(fileBlobContent: SaveFileFormat) {
  const blob = new Blob([JSON.stringify(fileBlobContent) || ''], {
    type: 'text/plain;charset=utf-8',
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download =
    fileBlobContent.projectName.toLowerCase().replace(' ', '_') +
    '_save.hdlflow';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
