/* eslint-disable @typescript-eslint/no-explicit-any */
import { DepositLogsItemById } from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsErrorsLogById(id?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositLogsItemById | null | undefined
  >(
    "DepositErrorLogById",
    async () => {
      const response = await api.get(`report/logs/deposit/${id}`, {});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      enabled: false,
    }
  );

  const DepositErrorLog = data;
  const isDepositErrorLogFetching = isFetching;
  const DepositErrorLogError: any = error;
  const refetchDepositErrorLog = refetch;
  return {
    DepositErrorLog,
    isDepositErrorLogFetching,
    DepositErrorLogError,
    refetchDepositErrorLog,
  };
}
