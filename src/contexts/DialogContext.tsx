import {createContext, useContext, useState} from 'react';
import {Node} from 'reactflow';

import FSMState from '../models/state';
import FSMTransition from '../models/transition';

export type DialogContextType = {
  portSettingsOpen: boolean;
  setPortSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stateSettingsOpen: boolean;
  setStateSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedState: Node<FSMState> | undefined;
  setSelectedState: React.Dispatch<
    React.SetStateAction<Node<FSMState> | undefined>
  >;
  transitionSettingsOpen: boolean;
  setTransitionSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTransition: Node<FSMTransition> | undefined;
  setSelectedTransition: React.Dispatch<
    React.SetStateAction<Node<FSMTransition> | undefined>
  >;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined,
);

interface DialogContextProviderProps {
  children: React.ReactNode;
}

export const DialogContextProvider = ({
  children,
}: DialogContextProviderProps) => {
  const [portSettingsOpen, setPortSettingsOpen] = useState(false);
  const [stateSettingsOpen, setStateSettingsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<
    Node<FSMState> | undefined
  >();
  const [transitionSettingsOpen, setTransitionSettingsOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<
    Node<FSMTransition> | undefined
  >();
  return (
    <DialogContext.Provider
      value={{
        portSettingsOpen,
        setPortSettingsOpen,
        stateSettingsOpen,
        setStateSettingsOpen,
        selectedState,
        setSelectedState,
        transitionSettingsOpen,
        setTransitionSettingsOpen,
        selectedTransition,
        setSelectedTransition,
      }}>
      {children}
    </DialogContext.Provider>
  );
};

export function useDialog(): DialogContextType {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used inside DialogContextProvider');
  }
  return context;
}
