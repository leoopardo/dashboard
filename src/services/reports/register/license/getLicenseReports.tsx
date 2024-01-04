/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetLicensesReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "LicensesReports",
    async () => {
      const response = await api.get("report/csv/license", {
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

  const LicenseReportsData = data;
  const isLicenseReportsDataFetching = isFetching;
  const LicenseReportsDataError: any = error;
  const refetchLicenseReportsData = refetch;
  return {
    LicenseReportsData,
    isLicenseReportsDataFetching,
    LicenseReportsDataError,
    refetchLicenseReportsData,
  };
}
