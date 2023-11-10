import { queryClient } from "@src/services/queryClient";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOperatorUsersReports(body: PartnerQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PartnerQuery | null | undefined
  >("CreateOperatorReports", async () => {
    const response = await api.post("report/csv/user/operator", body, {
      params: body,
    });
    await queryClient.refetchQueries({ queryKey: ["OperatorUsersReports"] });
    return response.data;
  });

  const OperatorUsersReportsMutate = mutate;
  const OperatorUsersReportsIsLoading = isLoading;
  const OperatorUsersReportsError = error;
  const OperatorUsersReportsIsSuccess = isSuccess;

  return {
    OperatorUsersReportsMutate,
    OperatorUsersReportsIsLoading,
    OperatorUsersReportsError,
    OperatorUsersReportsIsSuccess,
  };
}
