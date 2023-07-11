import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export function useGetRowsOrganizationUsersReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "OrganizationUserReports",
    async () => {
      const response = await api.get("report/csv/user/organization", {
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

  const UsersReportsData = data;
  const isUsersReportsDataFetching = isFetching;
  const UsersReportsDataError: any = error;
  const refetchUsersReportsData = refetch;
  return {
    UsersReportsData,
    isUsersReportsDataFetching,
    UsersReportsDataError,
    refetchUsersReportsData,
  };
}