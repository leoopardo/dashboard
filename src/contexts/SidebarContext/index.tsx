/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from "react";

interface SideMenuContext {
  handleChangeSidebar(open: boolean): void;
  isSidebarOpen: boolean;
}

const SideMenuContext = createContext<SideMenuContext>({} as SideMenuContext);

export const MenuProvider = ({ children }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  function handleChangeSidebar(open: boolean) {
    setIsSidebarOpen(open);
  }

  return (
    <SideMenuContext.Provider value={{ isSidebarOpen, handleChangeSidebar }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export function useMenu() {
  const context = useContext(SideMenuContext);
  return context;
}
