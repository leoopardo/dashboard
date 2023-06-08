import { api } from "../../config/api";
import {
  generatedDepositRowsResponse,
  generatedDepositTotalQuery,
} from "../types/generatedDeposits.interface";
import { useQuery } from "react-query";

export function useGetRowsGeneratedDeposits(
  params: generatedDepositTotalQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  generatedDepositRowsResponse | null | undefined
  >("depositsRows", async () => {
    const response = await api.get("report/pix/rows", { params });
    return response.data;
  });

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
