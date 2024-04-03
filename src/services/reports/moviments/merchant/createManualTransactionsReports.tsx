import { queryClient } from "@src/services/queryClient";
import { GetMerchantMovimentsQuery } from "@src/services/types/moviments/merchant/getMoviments";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantManualReports(
  body: GetMerchantMovimentsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateMerchantManualReports", async () => {
    const response = await api.post(
      "core/csv/merchant/entry-account",
      {
        ...body,
      },
    );
    await queryClient.refetchQueries({
      queryKey: ["MerchantManualReports"],
    });
    return response.data;
  });

  const MerchantManualReportsMutate = mutate;
  const MerchantManualReportsIsLoading = isLoading;
  const MerchantManualReportsError = error;
  const MerchantManualReportsIsSuccess = isSuccess;
  const MerchantManualReportsData = data;

  return {
    MerchantManualReportsMutate,
    MerchantManualReportsIsLoading,
    MerchantManualReportsError,
    MerchantManualReportsIsSuccess,
    MerchantManualReportsData,
  };
}
