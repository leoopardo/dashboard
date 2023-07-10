import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";

export function useCreatePartnerReports(body: PartnerQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PartnerQuery | null | undefined
  >("CreatePartnerReports", async () => {
    const response = await api.post("report/csv/partner", body, {});
    await queryClient.refetchQueries({ queryKey: ["PartnersReports"] });
    return response.data;
  });

  const PartnerReportsMutate = mutate;
  const PartnerReportsIsLoading = isLoading;
  const PartnerReportsError = error;
  const PartnerReportsIsSuccess = isSuccess;

  return {
    PartnerReportsMutate,
    PartnerReportsIsLoading,
    PartnerReportsError,
    PartnerReportsIsSuccess,
  };
}
