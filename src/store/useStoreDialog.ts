import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {DialogStoreType} from './types';
import {createSetter} from './utils';

const useStoreDialog = create<DialogStoreType>()(
  persist(
    set => ({
      portSettingsOpen: false,
      setPortSettingsOpen: createSetter(set, 'portSettingsOpen'),
      stateSettingsOpen: false,
      setStateSettingsOpen: createSetter(set, 'stateSettingsOpen'),
      selectedStateId: undefined,
      setSelectedStateId: createSetter(set, 'selectedStateId'),
      transitionSettingsOpen: false,
      setTransitionSettingsOpen: createSetter(set, 'transitionSettingsOpen'),
      selectedTransitionId: undefined,
      setSelectedTransitionId: createSetter(set, 'selectedTransitionId'),
      codeResultOpen: false,
      setCodeResultOpen: createSetter(set, 'codeResultOpen'),
      projectSettingsOpen: false,
      setProjectSettingsOpen: createSetter(set, 'projectSettingsOpen'),
    }),
    {
      name: 'dialog-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![''].includes(key)),
        ),
    },
  ),
);

export default useStoreDialog;
