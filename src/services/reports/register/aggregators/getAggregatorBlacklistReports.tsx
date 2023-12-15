/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetAggregatorsBlacklistReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "AggregatorBlacklistReports",
    async () => {
      const response = await api.get("blacklist/aggregator-black-list/csv", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: loadData?.items.find(
        (item) => item?.status === "WAITING"
      )
        ? 10000
        : undefined,
    }
  );

  useEffect(() => {
    setLoadData(data);
  }, [data]);

  const AggregatorBlacklistsReportsData = data;
  const isAggregatorBlacklistsReportsDataFetching = isFetching;
  const AggregatorBlacklistsReportsDataError: any = error;
  const refetchAggregatorBlacklistsReportsData = refetch;
  return {
    AggregatorBlacklistsReportsData,
    isAggregatorBlacklistsReportsDataFetching,
    AggregatorBlacklistsReportsDataError,
    refetchAggregatorBlacklistsReportsData,
  };
}
