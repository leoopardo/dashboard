import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {

  DepositLogsItemById,
} from "@src/services/types/support/apiLogs/depositsError.interface";

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
