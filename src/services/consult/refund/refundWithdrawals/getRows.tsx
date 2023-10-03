/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  refundWithdrawalsQuery,
  refundWithdrawalsRowsResponse,
} from "../../../types/consult/refunds/refundmanualDeposits.interface";

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
