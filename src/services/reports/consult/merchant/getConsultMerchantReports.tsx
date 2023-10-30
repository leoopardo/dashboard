/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetConsultMerchantReports(params: ReportsQuery) {
  const [loadData, setLoadData] = useState<ReportsData | null | undefined>(
    null
  );

  const { data, isFetching, error, refetch } = useQuery<
    ReportsData | null | undefined
  >(
    "ConsultMerchantReports",
    async () => {
      const response = await api.get(
        "account/report/merchant-account/transactions/csv",
        {
          params,
        }
      );
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

  const ConsultMerchantReportsData = data;
  const isConsultMerchantReportsDataFetching = isFetching;
  const ConsultMerchantReportsDataError: any = error;
  const refetchConsultMerchantReportsData = refetch;
  return {
    ConsultMerchantReportsData,
    isConsultMerchantReportsDataFetching,
    ConsultMerchantReportsDataError,
    refetchConsultMerchantReportsData,
  };
}
