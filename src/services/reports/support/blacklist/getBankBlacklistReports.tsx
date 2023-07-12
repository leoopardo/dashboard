import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetBankBlackistReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "BankBlackistReports",
    async () => {
      const response = await api.get("blacklist/bank-black-list/csv", {
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

  const BankBlackistReportsData = data;
  const isBankBlackistReportsDataFetching = isFetching;
  const BankBlackistReportsDataError: any = error;
  const refetchBankBlackistReportsData = refetch;
  return {
    BankBlackistReportsData,
    isBankBlackistReportsDataFetching,
    BankBlackistReportsDataError,
    refetchBankBlackistReportsData,
  };
}
