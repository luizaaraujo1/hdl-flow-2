import {Edge, EdgeChange, Node, NodeChange} from 'reactflow';

import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';

type SetterType<T> = (update: ((ports: T) => T) | T) => void;

export type NodeStoreType = {
  nodes: Node<FSMState>[];
  setNodes: SetterType<Node<FSMState>[]>;
  onNodesChange: (changes: NodeChange[]) => void;
  nodeCount: number;
  setNodeCount: SetterType<number>;
  resetNodes: () => void;
};

export type PortStoreType = {
  inputList: Port[];
  setInputList: SetterType<Port[]>;
  internalsList: Port[];
  setInternalsList: SetterType<Port[]>;
  outputList: Port[];
  setOutputList: SetterType<Port[]>;
  resetPorts: () => void;
};

export type EdgeStoreType = {
  edges: Edge<FSMTransition>[];
  setEdges: SetterType<Edge<FSMTransition>[]>;
  onEdgesChange: (changes: EdgeChange[]) => void;
  transitionCount: number;
  setTransitionCount: SetterType<number>;
  resetEdges: () => void;
};

export type DialogStoreType = {
  portSettingsOpen: boolean;
  setPortSettingsOpen: SetterType<boolean>;
  stateSettingsOpen: boolean;
  setStateSettingsOpen: SetterType<boolean>;
  selectedStateId: string | undefined;
  setSelectedStateId: SetterType<string | undefined>;
  transitionSettingsOpen: boolean;
  setTransitionSettingsOpen: SetterType<boolean>;
  selectedTransitionId: string | undefined;
  setSelectedTransitionId: SetterType<string | undefined>;
  codeResultOpen: boolean;
  setCodeResultOpen: SetterType<boolean>;
  projectSettingsOpen: boolean;
  setProjectSettingsOpen: SetterType<boolean>;
};

export type DialogSettingsType = {
  projectName: string;
  setProjectName: SetterType<string>;
  authorName: string;
  setAuthorName: SetterType<string>;
  language: string;
  setLanguage: SetterType<string>;
};

export type SaveFileFormat = Pick<NodeStoreType, 'nodes' | 'nodeCount'> &
  Pick<PortStoreType, 'inputList' | 'internalsList' | 'outputList'> &
  Pick<EdgeStoreType, 'edges' | 'transitionCount'> &
  Pick<DialogSettingsType, 'authorName' | 'language' | 'projectName'>;
