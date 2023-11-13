/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  refundWithdrawalsQuery,
  refundWithdrawalsRowsResponse,
} from "@src/services/types/consult/refunds/refundWithdrawals.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetRowsRefundWithdrawals(params: refundWithdrawalsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundWithdrawalsRowsResponse | null | undefined
  >(
    "refundWithdrawalsRows",
    async () => {
      const response = await api.get("refund/withdraw/rows", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const refundWithdrawals = data;
  const isRefundWithdrawalsFetching = isFetching;
  const refundWithdrawalsError: any = error;
  const refetchRefundWithdrawals = refetch;
  return {
    refundWithdrawals,
    isRefundWithdrawalsFetching,
    refundWithdrawalsError,
    refetchRefundWithdrawals,
  };
}
