import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import moment from "moment";
import { paidDepositRowsQuery, paidDepositTotalQuery } from "@src/services/types/consult/deposits/PaidDeposits.interface";

export function useCreatePaidDepositsReports(body: paidDepositRowsQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  paidDepositRowsQuery | null | undefined
  >("PaidDepositsReports", async () => {
    const response = await api.post(
      "report/csv/pix/paid-at",
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
