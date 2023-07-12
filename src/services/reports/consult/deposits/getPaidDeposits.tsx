/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetPaidDepositsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "PaidDepositsReports",
    async () => {
      const response = await api.get("report/csv/pix/paid-at", {
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

  const PaidDepositsReportsData = data;
  const isPaidDepositsReportsDataFetching = isFetching;
  const PaidDepositsReportsDataError: any = error;
  const refetchPaidDepositsReportsData = refetch;
  return {
    PaidDepositsReportsData,
    isPaidDepositsReportsDataFetching,
    PaidDepositsReportsDataError,
    refetchPaidDepositsReportsData,
  };
}
