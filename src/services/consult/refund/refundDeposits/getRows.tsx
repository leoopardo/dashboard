/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  refundDepositRowsResponse,
  refundDepositsQuery,
} from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetRowsRefundDeposits(params: refundDepositsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundDepositRowsResponse | null | undefined
  >(
    "refundRows",
    async () => {
      const response = await api.get("refund/pix/rows", {
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

  const refundDepositsRows = data;
  const isRefundDepositsRowsFetching = isFetching;
  const refundDepositsRowsError: any = error;
  const refetchRefundDepositsTotalRows = refetch;
  return {
    refundDepositsRows,
    isRefundDepositsRowsFetching,
    refundDepositsRowsError,
    refetchRefundDepositsTotalRows,
  };
}
