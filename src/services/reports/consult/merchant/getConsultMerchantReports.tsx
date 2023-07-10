import {
  ReportsData,
  ReportsQuery,
} from "@src/services/types/reports/reports.interface";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

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
        (item) => item?.status === "WAITING"
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
