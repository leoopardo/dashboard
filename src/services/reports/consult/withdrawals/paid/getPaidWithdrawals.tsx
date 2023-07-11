import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetPaidWithdrawalsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "PaidWithdrawalsReports",
    async () => {
      const response = await api.get("report/csv/withdraw/paid-at", {
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

  const PaidWithdrawalsReportsData = data;
  const isPaidWithdrawalsReportsDataFetching = isFetching;
  const PaidWithdrawalsReportsDataError: any = error;
  const refetchPaidWithdrawalsReportsData = refetch;
  return {
    PaidWithdrawalsReportsData,
    isPaidWithdrawalsReportsDataFetching,
    PaidWithdrawalsReportsDataError,
    refetchPaidWithdrawalsReportsData,
  };
}