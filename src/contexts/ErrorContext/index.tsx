/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from "react";

interface IError {
  rankingValue?: boolean;
  rankingOperations?: boolean;
  rankingFee?: boolean;
}

interface ErrorContext {
  resetErrors: () => void;
  handleChangeError(error: IError): void;
  error: IError;
}

const ErrorContext = createContext<ErrorContext>({} as ErrorContext);

export const ErrorProvider = ({ children }: any) => {
  const [error, setError] = useState<IError>({
    rankingValue: false,
    rankingOperations: false,
    rankingFee: false,
  });

  function handleChangeError(error: IError) {
    setError((state: any) => ({ ...state, ...error }));
  }

  function resetErrors() {
    setError({
      rankingValue: false,
      rankingOperations: false,
      rankingFee: false,
    });
  }

  return (
    <ErrorContext.Provider value={{ error, handleChangeError, resetErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export function useErrorContext() {
  const context = useContext(ErrorContext);
  return context;
}
