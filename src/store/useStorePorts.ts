import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {PortStoreType} from './types';
import {createSetter} from './utils';

const useStorePorts = create<PortStoreType>()(
  persist(
    set => ({
      inputList: [],
      setInputList: createSetter(set, 'inputList'),
      internalsList: [],
      setInternalsList: createSetter(set, 'internalsList'),
      outputList: [],
      setOutputList: createSetter(set, 'outputList'),
      resetPorts: () => set({inputList: [], internalsList: [], outputList: []}),
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

export default useStorePorts;
