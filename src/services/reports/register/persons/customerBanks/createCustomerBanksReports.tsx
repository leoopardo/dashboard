import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../../config/api";
import { useMutation } from "react-query";
import { ClientBankQuery } from "@src/services/types/banks.interface";

export function useCreateCustomerBanksReports(body: ClientBankQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  ClientBankQuery | null | undefined
  >("CreateCustomerBanksReports", async () => {
    const response = await api.post("blacklist/bank-list/csv", body, {});
    await queryClient.refetchQueries({ queryKey: ["CustomerBanksReports"] });
    return response.data;
  });

  const CustomerBanksReportsMutate = mutate;
  const CustomerBanksReportsIsLoading = isLoading;
  const CustomerBanksReportsError = error;
  const CustomerBanksReportsIsSuccess = isSuccess;

  return {
    CustomerBanksReportsMutate,
    CustomerBanksReportsIsLoading,
    CustomerBanksReportsError,
    CustomerBanksReportsIsSuccess,
  };
}
