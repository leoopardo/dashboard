/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export function useGetLegalPersonsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "LegalPersonsReports",
    async () => {
      const response = await api.get("customer/csv/companies", {
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

  const PersonsReportsData = data;
  const isPersonsReportsDataFetching = isFetching;
  const PersonsReportsDataError: any = error;
  const refetchPersonsReportsData = refetch;
  return {
    PersonsReportsData,
    isPersonsReportsDataFetching,
    PersonsReportsDataError,
    refetchPersonsReportsData,
  };
}
