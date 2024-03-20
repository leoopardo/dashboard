import { queryClient } from "@src/services/queryClient";
import { generatedDepositTotalQuery } from "@src/services/types/consult/deposits/generatedDeposits.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreateGeneratedDepositsReports(
  body: generatedDepositTotalQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
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
  const GeneratedDepositsReportsData = data;

  return {
    GeneratedDepositsReportsMutate,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsSuccess,
    GeneratedDepositsReportsData,
  };
}
