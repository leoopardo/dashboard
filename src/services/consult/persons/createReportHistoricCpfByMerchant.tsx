/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";

export function useExportHistoricCpfByMerchant(body: HistoricCpfByMerchantQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    HistoricCpfByMerchantQuery | null | undefined
  >("ExportHistoricCpfByMerchant", async () => {
    const response = await api.post("customer/csv/history/check_cpf", body, {  params: body});
    await queryClient.refetchQueries({ queryKey: ["HistoricCpfByMerchant"] });
    return response.data;
  });

  const HistoricCpfByMerchantReportsMutate = mutate;
  const HistoricCpfByMerchantReportsIsLoading = isLoading;
  const HistoricCpfByMerchantReportsError: any = error;
  const HistoricCpfByMerchantReportsIsSuccess = isSuccess;

  return {
    HistoricCpfByMerchantReportsMutate,
    HistoricCpfByMerchantReportsIsLoading,
    HistoricCpfByMerchantReportsError,
    HistoricCpfByMerchantReportsIsSuccess,
  };
}