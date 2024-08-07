import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { ReportsDataResponse, ReportsQuery } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";

export function useCreateRefundManualDepositsReports(body: ReportsQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateRefundManualDepositsReports", async () => {
    const response = await api.post("refund/csv/pix-manual", body, {});
    await queryClient.refetchQueries({ queryKey: ["RefundManualDepositsReports"] });
    return response.data;
  });

  const RefundManualDepositsReportsMutate = mutate;
  const RefundManualDepositsReportsIsLoading = isLoading;
  const RefundManualDepositsReportsError = error;
  const RefundManualDepositsReportsIsSuccess = isSuccess;
  const RefundManualDepositsReset = reset;
  const RefundManualDepositsReportsData = data;
  return {
    RefundManualDepositsReportsMutate,
    RefundManualDepositsReportsIsLoading,
    RefundManualDepositsReportsError,
    RefundManualDepositsReportsIsSuccess,
    RefundManualDepositsReset,
    RefundManualDepositsReportsData,
  };
}
