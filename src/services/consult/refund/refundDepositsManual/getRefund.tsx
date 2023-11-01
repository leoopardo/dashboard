/* eslint-disable @typescript-eslint/no-explicit-any */
import { refundManualById } from "@src/services/types/consult/refunds/refundManual.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetRefundManualOne(id: string) {
  const { data, isFetching, error, refetch } = useQuery<
  refundManualById | null | undefined
  >(
    "refundManualOne",
    async () => {
      const response = await api.get(`refund/pix-manual/byid/${id}`);
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const RefundManual = data;
  const isRefundManualFetching = isFetching;
  const RefundManualError: any = error;
  const refetchRefundManual = refetch;
  return {
    RefundManual,
    isRefundManualFetching,
    RefundManualError,
    refetchRefundManual,
  };
}
