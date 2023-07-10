import {
    ReportsData,
    ReportsQuery,
  } from "@src/services/types/reports/reports.interface";
  import { api } from "../../../../config/api";
  import { useQuery } from "react-query";
  import { useEffect, useState } from "react";
  
  export function useGetOrganizationManualReports(params: ReportsQuery) {
    const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
      null
    );
  
    const { data, isFetching, error, refetch } = useQuery<
      ReportsData | null | undefined
    >(
      "OrganizationManualReports",
      async () => {
        const response = await api.get("core/csv/organization/entry-account", {
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
  
    const OrganizationManualReportsData = data;
    const isOrganizationManualReportsDataFetching = isFetching;
    const OrganizationManualReportsDataError: any = error;
    const refetchOrganizationManualReportsData = refetch;
    return {
      OrganizationManualReportsData,
      isOrganizationManualReportsDataFetching,
      OrganizationManualReportsDataError,
      refetchOrganizationManualReportsData,
    };
  }
  