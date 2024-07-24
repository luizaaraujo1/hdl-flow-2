import {applyEdgeChanges, EdgeChange} from 'reactflow';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {EdgeStoreType} from './types';
import {createSetter} from './utils';

const useStoreEdges = create<EdgeStoreType>()(
  persist(
    (set, get) => ({
      edges: [],
      setEdges: createSetter(set, 'edges'),
      onEdgesChange: (changes: EdgeChange[]) => {
        set(state => ({
          ...state,
          edges: applyEdgeChanges(changes, get().edges),
        }));
      },
      transitionCount: 1,
      setTransitionCount: createSetter(set, 'transitionCount'),
      resetEdges: () =>
        set({
          edges: [],
          transitionCount: 1,
        }),
    }),
    {
      name: 'edge-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !['setEdges', 'onEdgesChange', 'setTransitionCount'].includes(
                key,
              ),
          ),
        ),
    },
  ),
);

export default useStoreEdges;
