import {createContext, useContext, useState} from 'react';

import Port from '../models/port';

export type GlobalContextType = {
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputList: Port[];
  setInputList: React.Dispatch<React.SetStateAction<Port[]>>;
  internalsList: Port[];
  setInternalsList: React.Dispatch<React.SetStateAction<Port[]>>;
  outputList: Port[];
  setOutputList: React.Dispatch<React.SetStateAction<Port[]>>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputList, setInputList] = useState<Port[]>([]);
  const [internalsList, setInternalsList] = useState<Port[]>([]);
  const [outputList, setOutputList] = useState<Port[]>([]);
  return (
    <GlobalContext.Provider
      value={{
        settingsOpen,
        setSettingsOpen,
        inputList,
        internalsList,
        outputList,
        setInputList,
        setInternalsList,
        setOutputList,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used inside GlobalContextProvider');
  }
  return context;
}
