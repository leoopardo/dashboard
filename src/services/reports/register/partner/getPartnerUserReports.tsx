import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetPartnerUsersReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "PartnerUsersReports",
    async () => {
      const response = await api.get("report/csv/user/partner", {
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

  const PartnerUsersReportsData = data;
  const isPartnerUsersReportsDataFetching = isFetching;
  const PartnerUsersReportsDataError: any = error;
  const refetchPartnerUsersReportsData = refetch;
  return {
    PartnerUsersReportsData,
    isPartnerUsersReportsDataFetching,
    PartnerUsersReportsDataError,
    refetchPartnerUsersReportsData,
  };
}
