import {
    ReportsData,
    ReportsQuery,
  } from "@src/services/types/reports/reports.interface";
  import { api } from "../../../../config/api";
  import { useQuery } from "react-query";
  import { useEffect, useState } from "react";
  
  export function useGetPartnersReports(params: ReportsQuery) {
    const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
      null
    );
  
    const { data, isFetching, error, refetch } = useQuery<
      ReportsData | null | undefined
    >(
      "PartnersReports",
      async () => {
        const response = await api.get("report/csv/partner", {
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
  
    const PartnersReportsData = data;
    const isPartnersReportsDataFetching = isFetching;
    const PartnersReportsDataError: any = error;
    const refetchPartnersReportsData = refetch;
    return {
      PartnersReportsData,
      isPartnersReportsDataFetching,
      PartnersReportsDataError,
      refetchPartnersReportsData,
    };
  }
  