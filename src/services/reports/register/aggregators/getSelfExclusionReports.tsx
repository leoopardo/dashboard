/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetSelfExclusionReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "SelfExclusion",
    async () => {
      const response = await api.get("blacklist/self-exclusion/csv", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: loadData?.items.find(
        (item) => item?.status !== "COMPLETED"
      )
        ? 10000
        : undefined,
    }
  );

  useEffect(() => {
    setLoadData(data);
  }, [data]);

  const SelfExclusionReportsData = data;
  const isSelfExclusionReportsDataFetching = isFetching;
  const SelfExclusionReportsDataError: any = error;
  const refetchSelfExclusionReportsData = refetch;
  return {
    SelfExclusionReportsData,
    isSelfExclusionReportsDataFetching,
    SelfExclusionReportsDataError,
    refetchSelfExclusionReportsData,
  };
}
