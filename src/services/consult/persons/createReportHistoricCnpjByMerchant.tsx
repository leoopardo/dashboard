/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { useMutation } from "react-query";

export function useExportHistoricCnpjByMerchant(body: HistoricCpfByMerchantQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    HistoricCpfByMerchantQuery | null | undefined
  >("ExportHistoricCnpjByMerchant", async () => {
    const response = await api.post("customer/csv/history/check_cnpj", body, {  params: body});
    await queryClient.refetchQueries({ queryKey: ["HistoricCnpjByMerchant"] });
    return response.data;
  });

  const HistoricCnpjByMerchantReportsMutate = mutate;
  const HistoricCnpjByMerchantReportsIsLoading = isLoading;
  const HistoricCnpjByMerchantReportsError: any = error;
  const HistoricCnpjByMerchantReportsIsSuccess = isSuccess;

  return {
    HistoricCnpjByMerchantReportsMutate,
    HistoricCnpjByMerchantReportsIsLoading,
    HistoricCnpjByMerchantReportsError,
    HistoricCnpjByMerchantReportsIsSuccess,
  };
}