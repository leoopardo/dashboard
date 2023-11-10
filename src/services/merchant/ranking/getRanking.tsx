/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "@src/config/api";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useGetMerchantRanking(
  type: "value" | "operations" | "fee",
  operation: "total" | "deposit" | "withdraw",
  params: { start_date: string; end_date: string }
) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    { _id: string; total: number; name: string }[] | null | undefined
  >(`ranking-${type}-${operation}`, async () => {
    const response = await api.get(
      `account/report/merchant-ranking/${type}/${operation}`,
      {
        params: {...params, limit: 10},

      }
    );
    return response.data;
  });

  useEffect(() => {
    refetch();
  }, [params]);

  const RankingData = data;
  const RankingDataSuccess = isSuccess
  const isRankingFetching = isFetching;
  const RankingError: any = error;
  const refetcRanking = refetch;

  return {
    RankingData,
    isRankingFetching,
    RankingError,
    refetcRanking,
    RankingDataSuccess
  };
}
