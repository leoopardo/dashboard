import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import moment from "moment";

export function useCreateGeneratedDepositsReports(
  body: generatedDepositTotalQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    generatedDepositTotalQuery | null | undefined
  >("GeneratedDepositsReports", async () => {
    const response = await api.post(
      "report/csv/pix",
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
      queryKey: ["GeneratedDepositsUserReports"],
    });
    return response.data;
  });

  const GeneratedDepositsReportsMutate = mutate;
  const GeneratedDepositsReportsIsLoading = isLoading;
  const GeneratedDepositsReportsError = error;
  const GeneratedDepositsReportsIsSuccess = isSuccess;

  return {
    GeneratedDepositsReportsMutate,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsSuccess,
  };
}
