import {applyNodeChanges, NodeChange} from 'reactflow';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {INITIAL_NODES} from '@constants/nodes.constants';

import {NodeStoreType} from './types';
import {createSetter} from './utils';

const useStoreNodes = create<NodeStoreType>()(
  persist(
    (set, get) => ({
      nodes: [],
      setNodes: createSetter(set, 'nodes'),
      onNodesChange: (changes: NodeChange[]) => {
        set(state => ({
          ...state,
          nodes: applyNodeChanges(changes, get().nodes),
        }));
      },
      nodeCount: 0,
      setNodeCount: createSetter(set, 'nodeCount'),
      resetNodes: () => set({nodes: INITIAL_NODES, nodeCount: 0}),
    }),
    {
      name: 'node-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['setNodes, onNodesChange, setNodeCount'].includes(key),
          ),
        ),
    },
  ),
);

// NOTE: This is preventing a crash because INITIAL_NODES is not ready when this hook starts
import('@constants/nodes.constants').then(({INITIAL_NODES}) => {
  const {nodes, setNodes} = useStoreNodes.getState();
  if (nodes.length === 0) setNodes(INITIAL_NODES);
});

export default useStoreNodes;
