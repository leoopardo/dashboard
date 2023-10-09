/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  refundManualDepositRowsResponse,
  refundManualDepositsQuery,
} from "../../../types/consult/refunds/refundmanualDeposits.interface";

export function useGetRefundDepositsManual(params: refundManualDepositsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundManualDepositRowsResponse | null | undefined
  >(
    "RefundManualDepositsManual",
    async () => {
      const response = await api.get("refund/pix-manual/rows", {
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

  const refundDepositsManual = data;
  const isRefundDepositsManualFetching = isFetching;
  const refundDepositsManualError: any = error;
  const refetchRefundDepositsManual = refetch;
  return {
    refundDepositsManual,
    isRefundDepositsManualFetching,
    refundDepositsManualError,
    refetchRefundDepositsManual,
  };
}
