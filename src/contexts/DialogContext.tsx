import {createContext, useContext, useState} from 'react';

import CodeResultDialog from '@components/canvas/settings/code/CodeResultDialog';
import PortSettingsDialog from '@components/canvas/settings/port/PortSettingsDialog';
import StateSettingsDialog from '@components/canvas/settings/state/StateSettingsDialog';
import TransitionSettingsDialog from '@components/canvas/settings/transition/TransitionSettingsDialog';

export type DialogContextType = {
  portSettingsOpen: boolean;
  setPortSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stateSettingsOpen: boolean;
  setStateSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStateId: string | undefined;
  setSelectedStateId: React.Dispatch<React.SetStateAction<string | undefined>>;
  transitionSettingsOpen: boolean;
  setTransitionSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTransitionId: string | undefined;
  setSelectedTransitionId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  codeResultOpen: boolean;
  setCodeResultOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [selectedStateId, setSelectedStateId] = useState<string | undefined>();
  const [transitionSettingsOpen, setTransitionSettingsOpen] = useState(false);
  const [selectedTransitionId, setSelectedTransitionId] = useState<
    string | undefined
  >();
  const [codeResultOpen, setCodeResultOpen] = useState(false);
  return (
    <DialogContext.Provider
      value={{
        portSettingsOpen,
        setPortSettingsOpen,
        stateSettingsOpen,
        setStateSettingsOpen,
        selectedStateId,
        setSelectedStateId,
        transitionSettingsOpen,
        setTransitionSettingsOpen,
        selectedTransitionId,
        setSelectedTransitionId,
        codeResultOpen,
        setCodeResultOpen,
      }}>
      {children}
      <PortSettingsDialog />
      <StateSettingsDialog />
      <TransitionSettingsDialog />
      <CodeResultDialog />
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
