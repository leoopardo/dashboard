/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../../config/api";

export function useGetPixKeyWhitelistReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "PixKeyWhitelistReports",
    async () => {
      const response = await api.get("blacklist/pix-key-white-list", {
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

  const PixKeyWhitelistReportsData = data;
  const isPixKeyWhitelistReportsDataFetching = isFetching;
  const PixKeyWhitelistReportsDataError: any = error;
  const refetchPixKeyWhitelistReportsData = refetch;
  return {
    PixKeyWhitelistReportsData,
    isPixKeyWhitelistReportsDataFetching,
    PixKeyWhitelistReportsDataError,
    refetchPixKeyWhitelistReportsData,
  };
}
