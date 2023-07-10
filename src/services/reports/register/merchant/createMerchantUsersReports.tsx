import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { MerchantUsersQuery } from "@src/services/types/merchantRegister.interface";

export function useCreateMerchantUsersReports(body: MerchantUsersQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  MerchantUsersQuery | null | undefined
  >("CreateMerchantUsersReports", async () => {
    const response = await api.post("report/csv/user/merchant", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantUserReports"] });
    return response.data;
  });

  const MerchantUsersReportsMutate = mutate;
  const MerchantUsersReportsIsLoading = isLoading;
  const MerchantUsersReportsError = error;
  const MerchantUsersReportsIsSuccess = isSuccess;

  return {
    MerchantUsersReportsMutate,
    MerchantUsersReportsIsLoading,
    MerchantUsersReportsError,
    MerchantUsersReportsIsSuccess,
  };
}
