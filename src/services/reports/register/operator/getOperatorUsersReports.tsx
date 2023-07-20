/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetOperatorUsersReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "OperatorUsersReports",
    async () => {
      const response = await api.get("report/csv/user/operator", {
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

  const OperatorUsersReportsData = data;
  const isOperatorUsersReportsDataFetching = isFetching;
  const OperatorUsersReportsDataError: any = error;
  const refetchOperatorUsersReportsData = refetch;
  return {
    OperatorUsersReportsData,
    isOperatorUsersReportsDataFetching,
    OperatorUsersReportsDataError,
    refetchOperatorUsersReportsData,
  };
}
