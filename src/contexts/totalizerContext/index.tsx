/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  ReactChild,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface TotalizerContext {
  Totalizer?: ReactChild;
  setTotalizer: Dispatch<SetStateAction<ReactChild | undefined>>;
}

const TotalizerContext = createContext<TotalizerContext>(
  {} as TotalizerContext
);

export const TotalizerProvider = ({ children }: any) => {
  const [Totalizer, setTotalizer] = useState<ReactChild | undefined>(undefined);

  return (
    <TotalizerContext.Provider value={{ Totalizer, setTotalizer }}>
      {children}
    </TotalizerContext.Provider>
  );
};

export function useTotalizer() {
  const context = useContext(TotalizerContext);
  return context;
}
