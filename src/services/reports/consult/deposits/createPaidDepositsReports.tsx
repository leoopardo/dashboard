import { queryClient } from "@src/services/queryClient";
import { paidDepositRowsQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreatePaidDepositsReports(body: paidDepositRowsQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    paidDepositRowsQuery | null | undefined
  >("PaidDepositsReports", async () => {
    const response = await api.post(
      "report/csv/pix/paid-at",
      {
        ...body,
      },
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["PaidDepositsReports"],
    });
    return response.data;
  });

  const PaidDepositsReportsMutate = mutate;
  const PaidDepositsReportsIsLoading = isLoading;
  const PaidDepositsReportsError = error;
  const PaidDepositsReportsIsSuccess = isSuccess;

  return {
    PaidDepositsReportsMutate,
    PaidDepositsReportsIsLoading,
    PaidDepositsReportsError,
    PaidDepositsReportsIsSuccess,
  };
}
