import moment from "moment";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import {
  refundDepositRowsResponse,
  refundDepositsQuery,
} from "../../../types/consult/refunds/refundsDeposits.interface";

export function useGetRowsRefundDeposits(params: refundDepositsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundDepositRowsResponse | null | undefined
  >(
    "depositsRows",
    async () => {
      const response = await api.get("refund/pix/rows", {
        params: {
          ...params,
          start_date: moment(params.start_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          end_date: moment(params.end_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
