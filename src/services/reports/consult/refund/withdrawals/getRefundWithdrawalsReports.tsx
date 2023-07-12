import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../../config/api";

export function useGetRefundWithdrawalsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "RefundWithdrawalsReports",
    async () => {
      const response = await api.get("refund/csv/withdraw", {
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

  const RefundWithdrawalsReportsData = data;
  const isRefundWithdrawalsReportsDataFetching = isFetching;
  const RefundWithdrawalsReportsDataError: any = error;
  const refetchRefundWithdrawalsReportsData = refetch;
  return {
    RefundWithdrawalsReportsData,
    isRefundWithdrawalsReportsDataFetching,
    RefundWithdrawalsReportsDataError,
    refetchRefundWithdrawalsReportsData,
  };
}
