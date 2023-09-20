import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { paidWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/paidWithdrawals.interface";
import { useMutation } from "react-query";

export function useCreatePaidWithdrawalsReports(
  body: paidWithdrawalsRowsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    paidWithdrawalsRowsQuery | null | undefined
  >("PaidWithdrawalsReports", async () => {
    const response = await api.post(
      "report/csv/withdraw/paid-at",
      { ...body },
      {
        params: {},
      }
    );
    await queryClient.refetchQueries({
      queryKey: ["PaidWithdrawalsReports"],
    });
    return response.data;
  });

  const PaidWithdrawalsReportsMutate = mutate;
  const PaidWithdrawalsReportsIsLoading = isLoading;
  const PaidWithdrawalsReportsError = error;
  const PaidWithdrawalsReportsIsSuccess = isSuccess;

  return {
    PaidWithdrawalsReportsMutate,
    PaidWithdrawalsReportsIsLoading,
    PaidWithdrawalsReportsError,
    PaidWithdrawalsReportsIsSuccess,
  };
}
