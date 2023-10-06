import { queryClient } from "@src/services/queryClient";
import { GetMerchantMovimentsQuery } from "@src/services/types/moviments/merchant/getMoviments";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantManualReports(
  body: GetMerchantMovimentsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    GetMerchantMovimentsQuery | null | undefined
  >("CreateMerchantManualReports", async () => {
    const response = await api.post(
      "core/csv/merchant/entry-account",
      {
        ...body,
      },
      { params: body }
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

  return {
    MerchantManualReportsMutate,
    MerchantManualReportsIsLoading,
    MerchantManualReportsError,
    MerchantManualReportsIsSuccess,
  };
}
