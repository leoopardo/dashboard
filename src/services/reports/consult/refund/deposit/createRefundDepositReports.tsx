import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { ReportsDataResponse, ReportsQuery } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";

export function useCreateRefundDepositsReports(body: ReportsQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateRefundDepositsReports", async () => {
    const response = await api.post("refund/csv/pix", body, {});
    await queryClient.refetchQueries({ queryKey: ["RefundDepositsReports"] });
    return response.data;
  });

  const RefundDepositsReportsMutate = mutate;
  const RefundDepositsReportsIsLoading = isLoading;
  const RefundDepositsReportsError = error;
  const RefundDepositsReportsIsSuccess = isSuccess;
  const RefundDepositsReset = reset;
  const RefundDepositsReportsData = data;
  return {
    RefundDepositsReportsMutate,
    RefundDepositsReportsIsLoading,
    RefundDepositsReportsError,
    RefundDepositsReportsIsSuccess,
    RefundDepositsReset,
    RefundDepositsReportsData,
  };
}
