/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { ReportsQuery, ReportsData } from "../../types/reports/reports.interface";

export function useGetReportsHistoricCnpjMerchantDetails(params: ReportsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  ReportsData | null | undefined
  >(
    "ReportsHistoricCnpjMerchantDetails",
    async () => {
      const response = await api.get(`customer/csv/history/check_cnpj/details`, {params});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const ReportsHistoricCnpjMerchantDetailsData = data;
  const isReportsHistoricCnpjMerchantDetailsDataFetching = isFetching;
  const ReportsHistoricCnpjMerchantDetailsDataError: any = error;
  const ReportsHistoricCnpjMerchantDetailsDataSuccess: any = isSuccess;
  const refetchReportsHistoricCnpjMerchantDetailsData = refetch;
  return {
    ReportsHistoricCnpjMerchantDetailsData,
    ReportsHistoricCnpjMerchantDetailsDataSuccess,
    isReportsHistoricCnpjMerchantDetailsDataFetching,
    ReportsHistoricCnpjMerchantDetailsDataError,
    refetchReportsHistoricCnpjMerchantDetailsData,
  };
}