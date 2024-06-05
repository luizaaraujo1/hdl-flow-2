import {createContext, useContext, useState} from 'react';

import FSMState from '../models/state';
import FSMTransition from '../models/transition';

interface StateDialogValue {
  data: FSMState;
  nodeId: string;
}

interface TransitionDialogValue {
  data: FSMTransition;
  transitionId: string;
}

export type DialogContextType = {
  portSettingsOpen: boolean;
  setPortSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stateSettingsOpen: boolean;
  setStateSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedState: StateDialogValue | undefined;
  setSelectedState: React.Dispatch<
    React.SetStateAction<StateDialogValue | undefined>
  >;
  transitionSettingsOpen: boolean;
  setTransitionSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTransition: TransitionDialogValue | undefined;
  setSelectedTransition: React.Dispatch<
    React.SetStateAction<TransitionDialogValue | undefined>
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
    StateDialogValue | undefined
  >();
  const [transitionSettingsOpen, setTransitionSettingsOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<
    TransitionDialogValue | undefined
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
