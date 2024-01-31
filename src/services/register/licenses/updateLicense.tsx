import { queryClient } from "@src/services/queryClient";
import { LicenseItem } from "@src/services/types/register/licenses/licenses.interface";
import { useMutation } from "react-query";
import { api } from "../../../config/api";

export function useUpdateLicense(body: LicenseItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    LicenseItem | null | undefined
  >("UpdateLicense", async () => {
    const response = await api.put("core/license/update", body, {});
    await queryClient.refetchQueries({ queryKey: ["Licenses"] });
    return response.data;
  });

  const UpdateMutate = mutate;
  const UpdateReset = reset;
  const UpdateIsLoading = isLoading;
  const UpdateError = error;
  const UpdateIsSuccess = isSuccess;

  return {
    UpdateMutate,
    UpdateIsLoading,
    UpdateError,
    UpdateIsSuccess,UpdateReset
  };
}
