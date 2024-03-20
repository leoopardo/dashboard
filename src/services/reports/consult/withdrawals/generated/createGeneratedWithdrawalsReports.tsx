import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";

export function useCreateGeneratedWithdrawalsReports(
  body: generatedWithdrawalsRowsQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
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
  const GeneratedWithdrawalsReportsData = data;

  return {
    GeneratedWithdrawalsReportsMutate,
    GeneratedWithdrawalsReportsIsLoading,
    GeneratedWithdrawalsReportsError,
    GeneratedWithdrawalsReportsIsSuccess,
    GeneratedWithdrawalsReportsData,
  };
}
