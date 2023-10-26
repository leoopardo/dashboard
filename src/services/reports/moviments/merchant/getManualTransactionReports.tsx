/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetMerchantManualReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "MerchantManualReports",
    async () => {
      const response = await api.get("core/csv/merchant/entry-account", {
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

  const MerchantManualReportsData = data;
  const isMerchantManualReportsDataFetching = isFetching;
  const MerchantManualReportsDataError: any = error;
  const refetchMerchantManualReportsData = refetch;
  return {
    MerchantManualReportsData,
    isMerchantManualReportsDataFetching,
    MerchantManualReportsDataError,
    refetchMerchantManualReportsData,
  };
}
