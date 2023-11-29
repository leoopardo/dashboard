/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { ReportsQuery, ReportsData } from "../../types/reports/reports.interface";

export function useGetReportsHistoricCpfMerchantDetails(params: ReportsQuery) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  ReportsData | null | undefined
  >(
    "ReportsHistoricCpfMerchantDetails",
    async () => {
      const response = await api.get(`customer/csv/history/check_cpf/details`, {params});
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const ReportsHistoricCpfMerchantDetailsData = data;
  const isReportsHistoricCpfMerchantDetailsDataFetching = isFetching;
  const ReportsHistoricCpfMerchantDetailsDataError: any = error;
  const ReportsHistoricCpfMerchantDetailsDataSuccess: any = isSuccess;
  const refetchReportsHistoricCpfMerchantDetailsData = refetch;
  return {
    ReportsHistoricCpfMerchantDetailsData,
    ReportsHistoricCpfMerchantDetailsDataSuccess,
    isReportsHistoricCpfMerchantDetailsDataFetching,
    ReportsHistoricCpfMerchantDetailsDataError,
    refetchReportsHistoricCpfMerchantDetailsData,
  };
}