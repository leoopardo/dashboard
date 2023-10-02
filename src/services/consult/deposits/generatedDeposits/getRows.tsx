/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  generatedDepositRowsResponse,
  generatedDepositTotalQuery,
} from "../../../types/consult/deposits/generatedDeposits.interface";

export function useGetRowsGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
    generatedDepositRowsResponse | null | undefined
  >(
    "depositsRows",
    async () => {
      const response = await api.get("report/pix/rows", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
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
