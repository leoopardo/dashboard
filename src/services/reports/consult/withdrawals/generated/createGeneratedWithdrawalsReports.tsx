import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { useMutation } from "react-query";

export function useCreateGeneratedWithdrawalsReports(
  body: generatedWithdrawalsRowsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    generatedWithdrawalsRowsQuery | null | undefined
  >("GeneratedWithdrawalsReports", async () => {
    const response = await api.post("report/csv/withdraw", { ...body }, {});
    await queryClient.refetchQueries({
      queryKey: ["GeneratedWithdrawalsReports"],
    });
    return response.data;
  });

  const GeneratedWithdrawalsReportsMutate = mutate;
  const GeneratedWithdrawalsReportsIsLoading = isLoading;
  const GeneratedWithdrawalsReportsError = error;
  const GeneratedWithdrawalsReportsIsSuccess = isSuccess;

  return {
    GeneratedWithdrawalsReportsMutate,
    GeneratedWithdrawalsReportsIsLoading,
    GeneratedWithdrawalsReportsError,
    GeneratedWithdrawalsReportsIsSuccess,
  };
}
