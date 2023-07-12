import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { generatedWithdrawalsRowsQuery } from "@src/services/types/consult/withdrawals/generatedWithdrawals.interface";
import moment from "moment";
import { useMutation } from "react-query";

export function useCreateGeneratedWithdrawalsReports(
  body: generatedWithdrawalsRowsQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    generatedWithdrawalsRowsQuery | null | undefined
  >("GeneratedWithdrawalsReports", async () => {
    const response = await api.post(
      "report/csv/withdraw",
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
