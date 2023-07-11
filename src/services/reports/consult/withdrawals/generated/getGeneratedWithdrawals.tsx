import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetGeneratedWithdrawalsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "GeneratedWithdrawalsReports",
    async () => {
      const response = await api.get("report/csv/withdraw", {
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

  const GeneratedWithdrawalsReportsData = data;
  const isGeneratedWithdrawalsReportsDataFetching = isFetching;
  const GeneratedWithdrawalsReportsDataError: any = error;
  const refetchGeneratedWithdrawalsReportsData = refetch;
  return {
    GeneratedWithdrawalsReportsData,
    isGeneratedWithdrawalsReportsDataFetching,
    GeneratedWithdrawalsReportsDataError,
    refetchGeneratedWithdrawalsReportsData,
  };
}