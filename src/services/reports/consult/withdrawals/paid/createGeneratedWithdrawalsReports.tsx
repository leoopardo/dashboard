import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { paidWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/paidWithdrawals.interface";
import moment from "moment";
import { useMutation } from "react-query";

export function useCreatePaidWithdrawalsReports(
  body: paidWithdrawalsRowsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    paidWithdrawalsRowsQuery | null | undefined
  >("PaidWithdrawalsReports", async () => {
    const response = await api.post(
      "report/csv/withdraw/paid-at",
      {},
      {
        params: {
          ...body,
          initial_date: body.initial_date
            ? moment(body.initial_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
          final_date: body.final_date
            ? moment(body.final_date)
                .add(3, "hours")
                .format("YYYY-MM-DDTHH:mm:ss.SSS")
            : null,
        },
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
