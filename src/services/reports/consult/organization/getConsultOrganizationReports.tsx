import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetConsultOrganizationReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "ConsultOrganizationReports",
    async () => {
      const response = await api.get(
        "account/report/paybrokers-account/transactions/csv",
        {
          params,
        }
      );
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

  const ConsultOrganizationReportsData = data;
  const isConsultOrganizationReportsDataFetching = isFetching;
  const ConsultOrganizationReportsDataError: any = error;
  const refetchConsultOrganizationReportsData = refetch;
  return {
    ConsultOrganizationReportsData,
    isConsultOrganizationReportsDataFetching,
    ConsultOrganizationReportsDataError,
    refetchConsultOrganizationReportsData,
  };
}