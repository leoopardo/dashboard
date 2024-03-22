/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IHistoricCpfByMerchant,
  HistoricCpfByMerchantQuery,
} from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetHistoricCnpjByMerchant(
  params?: HistoricCpfByMerchantQuery
) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    IHistoricCpfByMerchant[] | null | undefined
  >(
    "HistoricCnpjByMerchant",
    async () => {
      const response = await api.get("customer/history/check_cnpj", { params });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const HistoricCnpjByMerchantData = data;
  const isHistoricCnpjByMerchantDataFetching = isFetching;
  const HistoricCnpjByMerchantDataError: any = error;
  const HistoricCnpjByMerchantDataSuccess: any = isSuccess;
  const refetchHistoricCnpjByMerchantData = refetch;
  return {
    HistoricCnpjByMerchantData,
    isHistoricCnpjByMerchantDataFetching,
    HistoricCnpjByMerchantDataError,
    HistoricCnpjByMerchantDataSuccess,
    refetchHistoricCnpjByMerchantData,
  };
}
