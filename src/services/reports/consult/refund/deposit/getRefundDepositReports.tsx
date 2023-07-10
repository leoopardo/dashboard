import {
    ReportsData,
    ReportsQuery,
  } from "@src/services/types/reports/reports.interface";
  import { api } from "../../../../../config/api";
  import { useQuery } from "react-query";
  import { useEffect, useState } from "react";
  
  export function useGetRefundDepositsReports(params: ReportsQuery) {
    const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
      null
    );
  
    const { data, isFetching, error, refetch } = useQuery<
      ReportsData | null | undefined
    >(
      "RefundDepositsReports",
      async () => {
        const response = await api.get("refund/csv/pix", {
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
  
    const RefundDepositsReportsData = data;
    const isRefundDepositsReportsDataFetching = isFetching;
    const RefundDepositsReportsDataError: any = error;
    const refetchRefundDepositsReportsData = refetch;
    return {
      RefundDepositsReportsData,
      isRefundDepositsReportsDataFetching,
      RefundDepositsReportsDataError,
      refetchRefundDepositsReportsData,
    };
  }
  