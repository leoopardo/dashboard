/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";

export function useExportHistoricCnpjByMerchantDetails(
  body: HistoricCpfByMerchantQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    HistoricCpfByMerchantQuery | null | undefined
  >("ExportHistoricCnpjByMerchantDetails", async () => {
    const response = await api.post(
      "customer/csv/history/check_cnpj/details",
      body,
      { params: body }
    );
    await queryClient.refetchQueries({
      queryKey: ["HistoricCnpjByMerchantDetails"],
    });
    return response.data;
  });

  const HistoricCnpjByMerchantDetailsMutate = mutate;
  const HistoricCnpjByMerchantDetailsIsLoading = isLoading;
  const HistoricCnpjByMerchantDetailsError: any = error;
  const HistoricCnpjByMerchantDetailsIsSuccess = isSuccess;

  return {
    HistoricCnpjByMerchantDetailsMutate,
    HistoricCnpjByMerchantDetailsIsLoading,
    HistoricCnpjByMerchantDetailsError,
    HistoricCnpjByMerchantDetailsIsSuccess,
  };
}
