import { queryClient } from "@src/services/queryClient";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateGeneratedDepositsReports(
  body: generatedDepositTotalQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    generatedDepositTotalQuery | null | undefined
  >("GeneratedDepositsReports", async () => {
    const response = await api.post("report/csv/pix", { ...body });
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
