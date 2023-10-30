/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetGeneratedDepositsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "GeneratedDepositsReports",
    async () => {
      const response = await api.get("report/csv/pix", {
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

  const GeneratedDepositsReportsData = data;
  const isGeneratedDepositsReportsDataFetching = isFetching;
  const GeneratedDepositsReportsDataError: any = error;
  const refetchGeneratedDepositsReportsData = refetch;
  return {
    GeneratedDepositsReportsData,
    isGeneratedDepositsReportsDataFetching,
    GeneratedDepositsReportsDataError,
    refetchGeneratedDepositsReportsData,
  };
}
