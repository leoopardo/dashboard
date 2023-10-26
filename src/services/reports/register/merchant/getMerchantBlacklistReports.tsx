/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetMerchantBlacklistReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "MerchantBlacklistReports",
    async () => {
      const response = await api.get("blacklist/merchant-black-list/csv", {
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

  const MerchantBlacklistReportsData = data;
  const isMerchantBlacklistReportsDataFetching = isFetching;
  const MerchantBlacklistReportsDataError: any = error;
  const refetchMerchantBlacklistReportsData = refetch;
  return {
    MerchantBlacklistReportsData,
    isMerchantBlacklistReportsDataFetching,
    MerchantBlacklistReportsDataError,
    refetchMerchantBlacklistReportsData,
  };
}
