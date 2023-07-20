import { queryClient } from "@src/services/queryClient";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantReports(body: MerchantsQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    MerchantsQuery | null | undefined
  >("CreateMerchantReports", async () => {
    const response = await api.post("report/csv/merchant", body, {  params: body,});
    await queryClient.refetchQueries({ queryKey: ["MerchantReports"] });
    return response.data;
  });

  const MerchantReportsMutate = mutate;
  const MerchantReportsIsLoading = isLoading;
  const MerchantReportsError = error;
  const MerchantReportsIsSuccess = isSuccess;
  const MerchantReset = reset;
  return {
    MerchantReportsMutate,
    MerchantReportsIsLoading,
    MerchantReportsError,
    MerchantReportsIsSuccess,
    MerchantReset,
  };
}
