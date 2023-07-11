import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { BankBlacklistQuery } from "@src/services/types/support/blacklists/bankBlacklist.interface";

export function useCreateBankBlacklistReports(body: BankBlacklistQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  BankBlacklistQuery | null | undefined
  >("CreateBankBlacklistReports", async () => {
    const response = await api.post("/blacklist/bank-black-list/csv", body, {});
    await queryClient.refetchQueries({ queryKey: ["BankBlacklistReports"] });
    return response.data;
  });

  const BankBlacklistReportsMutate = mutate;
  const BankBlacklistReportsIsLoading = isLoading;
  const BankBlacklistReportsError = error;
  const BankBlacklistReportsIsSuccess = isSuccess;
  const BankBlacklistReset = reset;
  return {
    BankBlacklistReportsMutate,
    BankBlacklistReportsIsLoading,
    BankBlacklistReportsError,
    BankBlacklistReportsIsSuccess,
    BankBlacklistReset
  };
}
