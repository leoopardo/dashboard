import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  refundWithdrawalsRowsResponse,
  refundWithdrawalsQuery,
} from "../../../types/consult/refunds/refundWithdrawals.interface";

export function useGetRefundDepositsManual(params: refundWithdrawalsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundWithdrawalsRowsResponse | null | undefined
  >(
    "RefundDepositsManual",
    async () => {
      const response = await api.get("refund/pix/rows", {
        params: {
          ...params,
          start_date: moment(params.start_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          end_date: moment(params.end_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ssSSS"),
        },
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
    isRefundDepositsManualFetching ,
    refundDepositsManualError,
    refetchRefundDepositsManual
  };
}

