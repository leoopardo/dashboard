/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetAggregatorsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "AggregatorReports",
    async () => {
      const response = await api.get("report/csv/aggregator", {
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

  const AggregatorsReportsData = data;
  const isAggregatorsReportsDataFetching = isFetching;
  const AggregatorsReportsDataError: any = error;
  const refetchAggregatorsReportsData = refetch;
  return {
    AggregatorsReportsData,
    isAggregatorsReportsDataFetching,
    AggregatorsReportsDataError,
    refetchAggregatorsReportsData,
  };
}
