import { queryClient } from "@src/services/queryClient";
import { MerchantBlacklistQuery } from "@src/services/types/register/merchants/merchantBlacklist.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantBlacklistReports(body: MerchantBlacklistQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  MerchantBlacklistQuery | null | undefined
  >("CreateMerchantBlacklistReports", async () => {
    const response = await api.post("blacklist/merchant-black-list/csv", body, {  params: body,});
    await queryClient.refetchQueries({ queryKey: ["MerchantBlacklistReports"] });
    return response.data;
  });

  const MerchantBlacklistReportsMutate = mutate;
  const MerchantBlacklistReportsIsLoading = isLoading;
  const MerchantBlacklistReportsError = error;
  const MerchantBlacklistReportsIsSuccess = isSuccess;
  const MerchantBlacklistReset = reset;
  return {
    MerchantBlacklistReportsMutate,
    MerchantBlacklistReportsIsLoading,
    MerchantBlacklistReportsError,
    MerchantBlacklistReportsIsSuccess,
    MerchantBlacklistReset,
  };
}
