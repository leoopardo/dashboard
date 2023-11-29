/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { ReportsQuery, ReportsData } from "../../types/reports/reports.interface";

export function useGetReportsHistoricCpfMerchant(params: ReportsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  ReportsData | null | undefined
  >(
    "ReportsHistoricCpfMerchant",
    async () => {
      const response = await api.get(`customer/csv/history/check_cpf`, {params});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const ReportsHistoricCpfMerchantData = data;
  const isReportsHistoricCpfMerchantDataFetching = isFetching;
  const ReportsHistoricCpfMerchantDataError: any = error;
  const ReportsHistoricCpfMerchantDataSuccess: any = isSuccess;
  const refetchReportsHistoricCpfMerchantData = refetch;
  return {
    ReportsHistoricCpfMerchantData,
    ReportsHistoricCpfMerchantDataSuccess,
    isReportsHistoricCpfMerchantDataFetching,
    ReportsHistoricCpfMerchantDataError,
    refetchReportsHistoricCpfMerchantData,
  };
}