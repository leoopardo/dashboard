import { queryClient } from "@src/services/queryClient";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantReports(body: MerchantsQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateMerchantReports", async () => {
    const response = await api.post("report/csv/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantReports"] });
    return response.data;
  });

  const MerchantReportsMutate = mutate;
  const MerchantReportsIsLoading = isLoading;
  const MerchantReportsError = error;
  const MerchantReportsIsSuccess = isSuccess;
  const MerchantReset = reset;
  const MerchantReportsData = data;
  return {
    MerchantReportsMutate,
    MerchantReportsIsLoading,
    MerchantReportsError,
    MerchantReportsIsSuccess,
    MerchantReset,
    MerchantReportsData,
  };
}
