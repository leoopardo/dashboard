/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { refundById } from "@src/services/types/consult/refunds/refundsDeposits.interface";

export function useGetRefund(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
    refundById | null | undefined
  >(
    "refundOne",
    async () => {
      const response = await api.get(`refund/pix/byid/${id}`);
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const Refund = data;
  const isRefundFetching = isFetching;
  const RefundError: any = error;
  const refetchRefund = refetch;
  return {
    Refund,
    isRefundFetching,
    RefundError,
    refetchRefund,
  };
}
