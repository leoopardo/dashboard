import { queryClient } from "@src/services/queryClient";
import { GetMerchantMovimentsQuery } from "@src/services/types/moviments/merchant/getMoviments";
import { useMutation } from "react-query";
import { api } from "@src/config/api";

export function useCreatePreMerchantManualReports(
  body: GetMerchantMovimentsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    GetMerchantMovimentsQuery | null | undefined
  >("CreatePreManualReports", async () => {
    const response = await api.post(
      "core/csv/pre-entry-account/",
      {
        ...body,
        category_id: body.merchant_category_id,
      },
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

  return {
    preManualReportsMutate,
    preManualReportsIsLoading,
    preManualReportsError,
    preManualReportsIsSuccess,
  };
}
