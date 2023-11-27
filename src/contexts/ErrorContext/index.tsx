/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { createContext, useContext, useState, useEffect } from "react";

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
  const user = queryClient?.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [error, setError] = useState<IError>({
    rankingValue: false,
    rankingOperations: false,
    rankingFee: (user?.type === 1 || user?.type === 2) ? false : true,
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

  useEffect(() => {
    setError({
      rankingValue: false,
      rankingOperations: false,
      rankingFee: (user?.type === 1 || user?.type === 2) ? false : true,
    })
  }  , [user])

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
