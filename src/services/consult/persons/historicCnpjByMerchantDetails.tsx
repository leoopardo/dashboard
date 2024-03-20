/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../config/api";
import { HistoricCpfByMerchantQuery, HistoricCpfByMerchantQueryDetails } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";

export function useGetHistoricCnpjByMerchantDetails(
  params?: HistoricCpfByMerchantQuery
) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
  HistoricCpfByMerchantQueryDetails | null | undefined
  >(
    "HistoricCnpjByMerchantDetails",
    async () => {
      const response = await api.get("customer/history/check_Cnpj/details", { params });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  

  const HistoricCnpjByMerchantDetailsData = data;
  const isHistoricCnpjByMerchantDetailsDataFetching = isFetching;
  const HistoricCnpjByMerchantDetailsDataError: any = error;
  const HistoricCnpjByMerchantDetailsDataSuccess: any = isSuccess;
  const refetchHistoricCnpjByMerchantDetailsData = refetch;
  return {
    HistoricCnpjByMerchantDetailsData,
    HistoricCnpjByMerchantDetailsDataSuccess,
    isHistoricCnpjByMerchantDetailsDataFetching,
    HistoricCnpjByMerchantDetailsDataError,
    refetchHistoricCnpjByMerchantDetailsData,
  };
}
