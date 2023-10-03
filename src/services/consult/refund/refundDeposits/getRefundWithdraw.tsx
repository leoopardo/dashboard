/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { refundById } from "@src/services/types/consult/refunds/refundsDeposits.interface";

export function useGetRefundWithdraw(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
    refundById | null | undefined
  >(
    "refundOne",
    async () => {
      const response = await api.get(`refund/withdraw/byid/${id}`);
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const RefundWithdraw = data;
  const isRefundWithdrawFetching = isFetching;
  const RefundWithdrawError: any = error;
  const refetchRefundWithdraw = refetch;
  return {
    RefundWithdraw,
    isRefundWithdrawFetching,
    RefundWithdrawError,
    refetchRefundWithdraw,
  };
}
