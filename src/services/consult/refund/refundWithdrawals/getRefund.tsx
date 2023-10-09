/* eslint-disable @typescript-eslint/no-explicit-any */
import { refundWithdrawById } from "@src/services/types/consult/refunds/refundWithdrawals.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetRefundWithdrawOne(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
    refundWithdrawById | null | undefined
  >(
    "refundWithdrawOne",
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
