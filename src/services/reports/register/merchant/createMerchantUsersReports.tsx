import { queryClient } from "@src/services/queryClient";
import { MerchantUsersQuery } from "@src/services/types/merchantRegister.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateMerchantUsersReports(body: MerchantUsersQuery) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ReportsDataResponse | null | undefined
  >("CreateMerchantUsersReports", async () => {
    const response = await api.post("report/csv/user/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantUserReports"] });
    return response.data;
  });

  const MerchantUsersReportsMutate = mutate;
  const MerchantUsersReportsIsLoading = isLoading;
  const MerchantUsersReportsError = error;
  const MerchantUsersReportsIsSuccess = isSuccess;
  const MerchantUsersReportsData = data;

  return {
    MerchantUsersReportsMutate,
    MerchantUsersReportsIsLoading,
    MerchantUsersReportsError,
    MerchantUsersReportsIsSuccess,
    MerchantUsersReportsData,
  };
}
