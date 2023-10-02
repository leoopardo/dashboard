/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositLogsData,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawalsErrorsLogs(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositLogsData | null | undefined
  >("WithdrawalsErrorsLogs", async () => {
    const response = await api.get("report/logs/withdraw", {
      params
    });
    return response.data;
  });

  const WithdrawalsErrorsLogs = data;
  const isWithdrawalsErrorsLogsFetching = isFetching;
  const WithdrawalsErrorsLogsError: any = error;
  const refetchWithdrawalsErrorsLogs = refetch;
  return {
    WithdrawalsErrorsLogs,
    isWithdrawalsErrorsLogsFetching,
    WithdrawalsErrorsLogsError,
    refetchWithdrawalsErrorsLogs,
  };
}
