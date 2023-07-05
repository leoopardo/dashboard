import moment from "moment";
import { api } from "../../../../config/api";
import {
  generatedDepositRowsResponse,
  generatedDepositTotalQuery,
} from "../../../types/consult/deposits/generatedDeposits.interface";
import { useQuery } from "react-query";

export function useGetRowsGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    generatedDepositRowsResponse | null | undefined
  >(
    "depositsRows",
    async () => {
      const response = await api.get("report/pix/rows", {
        params: {
          ...params,
          initial_date: params.initial_date
            ? moment(params.initial_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          final_date: params.initial_date
            ? moment(params.final_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
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

  const depositsRows = data;
  const isDepositsRowsFetching = isFetching;
  const depositsRowsError: any = error;
  const refetchDepositsTotalRows = refetch;
  return {
    depositsRows,
    isDepositsRowsFetching,
    depositsRowsError,
    refetchDepositsTotalRows,
  };
}
