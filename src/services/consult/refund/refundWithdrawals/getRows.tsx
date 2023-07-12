/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  refundWithdrawalsQuery,
  refundWithdrawalsRowsResponse,
} from "../../../types/consult/refunds/refundWithdrawals.interface";

export function useGetRowsRefundWithdrawals(params: refundWithdrawalsQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    refundWithdrawalsRowsResponse | null | undefined
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

  const refundWithdrawalsRows = data;
  const isRefundWithdrawalsRowsFetching = isFetching;
  const refundWithdrawalsRowsError: any = error;
  const refetchRefundWithdrawalsTotalRows = refetch;
  return {
    refundWithdrawalsRows,
    isRefundWithdrawalsRowsFetching,
    refundWithdrawalsRowsError,
    refetchRefundWithdrawalsTotalRows,
  };
}
