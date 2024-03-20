import { queryClient } from "@src/services/queryClient";
import { OperatorQuery } from "@src/services/types/register/operators/operators.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOperatorReports(body: OperatorQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateOperatorReports", async () => {
    const response = await api.post("report/csv/operator", body, {
     
    });
    await queryClient.refetchQueries({ queryKey: ["OperatorsReports"] });
    return response.data;
  });

  const OperatorReportsMutate = mutate;
  const OperatorReportsIsLoading = isLoading;
  const OperatorReportsError = error;
  const OperatorReportsIsSuccess = isSuccess;
  const OperatorReportsData = data;

  return {
    OperatorReportsMutate,
    OperatorReportsIsLoading,
    OperatorReportsError,
    OperatorReportsIsSuccess,
    OperatorReportsData,
  };
}
