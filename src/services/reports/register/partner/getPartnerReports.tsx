/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

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
        (item) => item?.status !== "COMPLETED"
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
