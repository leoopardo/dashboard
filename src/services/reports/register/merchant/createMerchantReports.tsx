import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";

export function useCreateMerchantReports(body: MerchantsQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  MerchantsQuery | null | undefined
  >("CreateMerchantReports", async () => {
    const response = await api.post("report/csv/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantReports"] });
    return response.data;
  });

  const MerchantReportsMutate = mutate;
  const MerchantReportsIsLoading = isLoading;
  const MerchantReportsError = error;
  const MerchantReportsIsSuccess = isSuccess;

  return {
    MerchantReportsMutate,
    MerchantReportsIsLoading,
    MerchantReportsError,
    MerchantReportsIsSuccess,
  };
}
