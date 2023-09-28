/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DepositsLogsStepsTotalItem,
  DepositsLogsStepsTotalQuery,
} from "@src/services/types/support/apiLogs/depositsError.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawalsErrorsTotal(
  params: DepositsLogsStepsTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    DepositsLogsStepsTotalItem[] | null | undefined
  >("WithdrawalsErrorsTotal", async () => {
    const response = await api.get("report/logs/withdraw/steps/total", {
      params
    });
    return response.data;
  });

  const WithdrawalsErrorsTotal = data;
  const isWithdrawalsErrorsTotalFetching = isFetching;
  const WithdrawalsErrorsTotalError: any = error;
  const refetchWithdrawalsErrorsTotal = refetch;
  return {
    WithdrawalsErrorsTotal,
    isWithdrawalsErrorsTotalFetching,
    WithdrawalsErrorsTotalError,
    refetchWithdrawalsErrorsTotal,
  };
}
