/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetMerchantUserReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "MerchantUserReports",
    async () => {
      const response = await api.get("report/csv/user/merchant", {
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

  const MerchantUserReportsData = data;
  const isMerchantUserReportsDataFetching = isFetching;
  const MerchantUserReportsDataError: any = error;
  const refetchMerchantUserReportsData = refetch;
  return {
    MerchantUserReportsData,
    isMerchantUserReportsDataFetching,
    MerchantUserReportsDataError,
    refetchMerchantUserReportsData,
  };
}
