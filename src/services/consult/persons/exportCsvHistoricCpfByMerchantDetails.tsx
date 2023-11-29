/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";

export function useExportHistoricCpfByMerchantDetails(body: HistoricCpfByMerchantQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    HistoricCpfByMerchantQuery | null | undefined
  >("ExportHistoricCpfByMerchantDetails", async () => {
    const response = await api.post("customer/csv/history/check_cpf/details", body, {  params: body});
    await queryClient.refetchQueries({ queryKey: ["HistoricCpfByMerchantDetails"] });
    return response.data;
  });

  const HistoricCpfByMerchantDetailsMutate = mutate;
  const HistoricCpfByMerchantDetailsIsLoading = isLoading;
  const HistoricCpfByMerchantDetailsError: any = error;
  const HistoricCpfByMerchantDetailsIsSuccess = isSuccess;

  return {
    HistoricCpfByMerchantDetailsMutate,
    HistoricCpfByMerchantDetailsIsLoading,
    HistoricCpfByMerchantDetailsError,
    HistoricCpfByMerchantDetailsIsSuccess,
  };
}