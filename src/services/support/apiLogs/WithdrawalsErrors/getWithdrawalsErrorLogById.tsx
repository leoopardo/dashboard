import { DepositLogsItemById } from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawErrorsLogById(id?: string) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositLogsItemById | null | undefined
  >(
    "WithdrawErrorLogById",
    async () => {
      const response = await api.get(`report/logs/withdraw/${id}`, {});
      return response.data;
    },
    {
      enabled: false,
    }
  );

  const WithdrawErrorLog = data;
  const isWithdrawErrorLogFetching = isFetching;
  const WithdrawErrorLogError: any = error;
  const refetchWithdrawErrorLog = refetch;
  return {
    WithdrawErrorLog,
    isWithdrawErrorLogFetching,
    WithdrawErrorLogError,
    refetchWithdrawErrorLog,
  };
}
