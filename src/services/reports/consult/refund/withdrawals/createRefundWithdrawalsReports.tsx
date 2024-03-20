import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { ReportsDataResponse, ReportsQuery } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";

export function useCreateRefundWithdrawalsReports(body: ReportsQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateRefundWithdrawalsReports", async () => {
    const response = await api.post("refund/csv/withdraw", body, {});
    await queryClient.refetchQueries({
      queryKey: ["RefundWithdrawalsReports"],
    });
    return response.data;
  });

  const RefundWithdrawalsReportsMutate = mutate;
  const RefundWithdrawalsReportsIsLoading = isLoading;
  const RefundWithdrawalsReportsError = error;
  const RefundWithdrawalsReportsIsSuccess = isSuccess;
  const RefundWithdrawalsReset = reset;
  const RefundWithdrawalsReportsData = data;
  return {
    RefundWithdrawalsReportsMutate,
    RefundWithdrawalsReportsIsLoading,
    RefundWithdrawalsReportsError,
    RefundWithdrawalsReportsIsSuccess,
    RefundWithdrawalsReset,
    RefundWithdrawalsReportsData,
  };
}
