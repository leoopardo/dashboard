import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetRefundManualDepositsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "RefundManualDepositsReports",
    async () => {
      const response = await api.get("refund/csv/pix-manual", {
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

  const RefundManualDepositsReportsData = data;
  const isRefundManualDepositsReportsDataFetching = isFetching;
  const RefundManualDepositsReportsDataError: any = error;
  const refetchRefundManualDepositsReportsData = refetch;
  return {
    RefundManualDepositsReportsData,
    isRefundManualDepositsReportsDataFetching,
    RefundManualDepositsReportsDataError,
    refetchRefundManualDepositsReportsData,
  };
}
