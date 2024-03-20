import { queryClient } from "@src/services/queryClient";
import { GetMerchantMovimentsQuery } from "@src/services/types/moviments/merchant/getMoviments";
import { useMutation } from "react-query";
import { api } from "@src/config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreatePreMerchantManualReports(
  body: GetMerchantMovimentsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreatePreManualReports", async () => {
    const response = await api.post(
      "core/csv/pre-entry-account/",
      {
        ...body,
      },
      { params: body }
    );
    await queryClient.refetchQueries({
      queryKey: ["PreManualReports"],
    });
    return response.data;
  });

  const preManualReportsMutate = mutate;
  const preManualReportsIsLoading = isLoading;
  const preManualReportsError = error;
  const preManualReportsIsSuccess = isSuccess;
  const preManualReportsData = data;

  return {
    preManualReportsMutate,
    preManualReportsIsLoading,
    preManualReportsError,
    preManualReportsIsSuccess,
    preManualReportsData,
  };
}
