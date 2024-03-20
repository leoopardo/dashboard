/* eslint-disable @typescript-eslint/no-explicit-any */
import { HistoricCpfByMerchantQueryDetails, HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetHistoricCpfByMerchantDetails(
  params?: HistoricCpfByMerchantQuery
) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  HistoricCpfByMerchantQueryDetails | null | undefined
  >(
    "HistoricCpfByMerchantDetails",
    async () => {
      const response = await api.get("customer/history/check_cpf/details", { params });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  

  const HistoricCpfByMerchantDetailsData = data;
  const isHistoricCpfByMerchantDetailsDataFetching = isFetching;
  const HistoricCpfByMerchantDetailsDataError: any = error;
  const HistoricCpfByMerchantDetailsDataSuccess: any = isSuccess;
  const refetchHistoricCpfByMerchantDetailsData = refetch;
  return {
    HistoricCpfByMerchantDetailsData,
    HistoricCpfByMerchantDetailsDataSuccess,
    isHistoricCpfByMerchantDetailsDataFetching,
    HistoricCpfByMerchantDetailsDataError,
    refetchHistoricCpfByMerchantDetailsData,
  };
}
