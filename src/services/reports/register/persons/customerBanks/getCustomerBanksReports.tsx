/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../../config/api";

export function useGetCustomerBanksReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "CustomerBanksReports",
    async () => {
      const response = await api.get("blacklist/bank-list/csv", {
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

  const CustomerBanksReportsData = data;
  const isCustomerBanksReportsDataFetching = isFetching;
  const CustomerBanksReportsDataError: any = error;
  const refetchCustomerBanksReportsData = refetch;
  return {
    CustomerBanksReportsData,
    isCustomerBanksReportsDataFetching,
    CustomerBanksReportsDataError,
    refetchCustomerBanksReportsData,
  };
}
