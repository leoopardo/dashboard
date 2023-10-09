/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "@src/services/queryClient";

export function useGetRefundStatusManual(id: string) {
  const { data, isFetching, error, refetch } = useQuery<any>(
    "RefreshStatus",
    async () => {
      const response = await api.get(
        `refund/pix-manual/check_status/${id}`,
        {}
      );
      await queryClient.refetchQueries({
        queryKey: ["RefundManualDepositsManual"],
      });
      return response.data;
    },
    { enabled: false }
  );

  const refundStatusManual = data;
  const isRefundStatusManualFetching = isFetching;
  const refundStatusManualError: any = error;
  const refetchRefundStatusManual = refetch;
  return {
    refundStatusManual,
    isRefundStatusManualFetching,
    refundStatusManualError,
    refetchRefundStatusManual,
  };
}
