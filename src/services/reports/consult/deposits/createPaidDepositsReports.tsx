import { queryClient } from "@src/services/queryClient";
import { paidDepositRowsQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreatePaidDepositsReports(body: paidDepositRowsQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
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
  const PaidDepositsReportsData = data;

  return {
    PaidDepositsReportsMutate,
    PaidDepositsReportsIsLoading,
    PaidDepositsReportsError,
    PaidDepositsReportsIsSuccess,
    PaidDepositsReportsData,
  };
}
