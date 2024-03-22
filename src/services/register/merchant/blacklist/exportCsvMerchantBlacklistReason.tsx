import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { MerchantBlacklistReasonQuery } from "@src/services/types/register/merchants/merchantBlacklistReasons.interface";

export function useCreateMerchantBlacklistReasonsReports(body: MerchantBlacklistReasonQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  MerchantBlacklistReasonQuery | null | undefined
  >("ExportMerchantBlacklistReason", async () => {
    const response = await api.post("/blacklist/merchant-black-list/reasons/csv", body, {  params: body,});
    await queryClient.refetchQueries({ queryKey: ["BankBlacklistReports"] });
    return response.data;
  });

  const MerchantBlacklistReasonsReportsMutate = mutate;
  const MerchantBlacklistReasonsReportsIsLoading = isLoading;
  const MerchantBlacklistReasonsReportsError = error;
  const MerchantBlacklistReasonsReportsIsSuccess = isSuccess;
  const MerchantBlacklistReasonsReportsReset = reset;
  return {
    MerchantBlacklistReasonsReportsMutate,
    MerchantBlacklistReasonsReportsIsLoading,
    MerchantBlacklistReasonsReportsError,
    MerchantBlacklistReasonsReportsIsSuccess,
    MerchantBlacklistReasonsReportsReset,
  }
}