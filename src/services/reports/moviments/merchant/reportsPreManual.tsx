/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "@src/config/api";

export function useGetPreManualReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "PreManualReports",
    async () => {
      const response = await api.get("core/csv/pre-entry-account/", {
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

  const preManualReportsData = data;
  const isPreManualReportsDataFetching = isFetching;
  const preManualReportsDataError: any = error;
  const refetchPreManualReportsData = refetch;
  return {
    preManualReportsData,
    isPreManualReportsDataFetching,
    preManualReportsDataError,
    refetchPreManualReportsData,
  };
}
