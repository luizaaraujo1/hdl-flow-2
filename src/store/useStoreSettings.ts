import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {DialogSettingsType} from './types';
import {createSetter} from './utils';

const useStoreSettings = create<DialogSettingsType>()(
  persist(
    set => ({
      projectName: 'My Flow',
      setProjectName: createSetter(set, 'projectName'),
      authorName: 'John Doe',
      setAuthorName: createSetter(set, 'authorName'),
    }),
    {
      name: 'port-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !['setInputList, setInternalsList, setOutputList'].includes(key),
          ),
        ),
    },
  ),
);

export default useStoreSettings;
