import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { PartnerUsersQuery } from "@src/services/types/register/partners/partnerUsers.interface";

export function useCreatePartnerUserReports(body: PartnerUsersQuery) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerUsersQuery | null | undefined
  >("PartnerUsersReports", async () => {
    const response = await api.post("report/csv/user/partner", body, {});
    await queryClient.refetchQueries({ queryKey: ["PartnerUserReports"] });
    return response.data;
  });

  const PartnerReportsMutate = mutate;
  const PartnerReportsIsLoading = isLoading;
  const PartnerReportsError = error;
  const PartnerReportsIsSuccess = isSuccess;
  const PartnerReportsReset = reset;

  return {
    PartnerReportsMutate,
    PartnerReportsReset,
    PartnerReportsIsLoading,
    PartnerReportsError,
    PartnerReportsIsSuccess,
  };
}
