/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHistoricCpfByMerchant, HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { useQuery } from "react-query";
import { api } from "../../../config/api";

export function useGetHistoricCpfByMerchant(
  params?: HistoricCpfByMerchantQuery
) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    IHistoricCpfByMerchant | null | undefined
  >(
    "HistoricCpfByMerchant",
    async () => {
      const response = await api.get("customer/history/check_cpf", { params });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const HistoricCpfByMerchantData = data;
  const isHistoricCpfByMerchantDataFetching = isFetching;
  const HistoricCpfByMerchantDataError: any = error;
  const HistoricCpfByMerchantDataSuccess: any = isSuccess;
  const refetchHistoricCpfByMerchantData = refetch;
  return {
    HistoricCpfByMerchantData,
    HistoricCpfByMerchantDataSuccess,
    isHistoricCpfByMerchantDataFetching,
    HistoricCpfByMerchantDataError,
    refetchHistoricCpfByMerchantData,
  };
}
