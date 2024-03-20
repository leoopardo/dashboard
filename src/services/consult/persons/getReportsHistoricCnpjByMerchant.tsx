/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { ReportsQuery, ReportsData } from "../../types/reports/reports.interface";

export function useGetReportsHistoricCnpjMerchant(params: ReportsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  ReportsData | null | undefined
  >(
    "ReportsHistoricCnpjMerchant",
    async () => {
      const response = await api.get(`customer/csv/history/check_cnpj`, {params});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const ReportsHistoricCnpjMerchantData = data;
  const isReportsHistoricCnpjMerchantDataFetching = isFetching;
  const ReportsHistoricCnpjMerchantDataError: any = error;
  const ReportsHistoricCnpjMerchantDataSuccess: any = isSuccess;
  const refetchReportsHistoricCnpjMerchantData = refetch;
  return {
    ReportsHistoricCnpjMerchantData,
    ReportsHistoricCnpjMerchantDataSuccess,
    isReportsHistoricCnpjMerchantDataFetching,
    ReportsHistoricCnpjMerchantDataError,
    refetchReportsHistoricCnpjMerchantData,
  };
}