import { queryClient } from "@src/services/queryClient";
import { PartnerUsersQuery } from "@src/services/types/register/partners/partnerUsers.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";

export function useCreatePartnerUserReports(body: PartnerUsersQuery) {
  const { isLoading, error, mutate, isSuccess, reset, data } = useMutation<
    ReportsDataResponse | null | undefined
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
  const PartnerReportsData = data;

  return {
    PartnerReportsMutate,
    PartnerReportsReset,
    PartnerReportsIsLoading,
    PartnerReportsError,
    PartnerReportsIsSuccess,
    PartnerReportsData,
  };
}
