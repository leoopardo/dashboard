import { queryClient } from "@src/services/queryClient";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreatePartnerReports(body: PartnerQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    PartnerQuery | null | undefined
  >("CreatePartnerReports", async () => {
    const response = await api.post("report/csv/partner", body, {  params: body,});
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
