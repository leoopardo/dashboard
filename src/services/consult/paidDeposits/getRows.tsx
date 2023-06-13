import moment from "moment";
import { api } from "../../../config/api";
import { useQuery } from "react-query";
import { paidDepositRowsQuery, paidDepositRowsResponse } from "../../types/PaidDeposits.interface";

export function useGetRowsPaidDeposits(
  params: paidDepositRowsQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    paidDepositRowsResponse | null | undefined
  >(
    "depositsRows",
    async () => {
      const response = await api.get("report/pix/rows/paid-at", {
        params: {
          ...params,
          initial_date: moment(params.initial_date)
            .add(3, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS"),
          final_date: moment(params.final_date)
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

  const paidRows = data;
  const isPaidRowsFetching = isFetching;
  const paidRowsError: any = error;
  const refetchPaidTotalRows = refetch;
  return {
    paidRows,
    isPaidRowsFetching,
    paidRowsError,
    refetchPaidTotalRows,
  };
}
