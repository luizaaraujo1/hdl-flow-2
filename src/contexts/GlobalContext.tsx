import {createContext, useContext, useState} from 'react';

export type GlobalContextType = {
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  return (
    <GlobalContext.Provider value={{settingsOpen, setSettingsOpen}}>
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
