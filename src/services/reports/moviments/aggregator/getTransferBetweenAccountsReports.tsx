/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetAggregatorTransferBetweenAccountsReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "AggregatorTransferBetweenAccountsReports",
    async () => {
      const response = await api.get("core/csv/aggregator/account/balance/transfer", {
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

  const TransferBetweenAccountsReportsData = data;
  const isTransferBetweenAccountsReportsDataFetching = isFetching;
  const TransferBetweenAccountsReportsDataError: any = error;
  const refetchTransferBetweenAccountsReportsData = refetch;
  return {
    TransferBetweenAccountsReportsData,
    isTransferBetweenAccountsReportsDataFetching,
    TransferBetweenAccountsReportsDataError,
    refetchTransferBetweenAccountsReportsData,
  };
}
