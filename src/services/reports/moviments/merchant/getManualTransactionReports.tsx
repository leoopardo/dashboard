import {
    ReportsData,
    ReportsQuery,
  } from "@src/services/types/reports/reports.interface";
  import { api } from "../../../../config/api";
  import { useQuery } from "react-query";
  import { useEffect, useState } from "react";
  
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
          (item) => item?.status === "WAITING"
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
  