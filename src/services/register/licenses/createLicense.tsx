import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../config/api";
import { LicenseItem } from "@src/services/types/register/licenses/licenses.interface";

export function useCreateLicense(body: LicenseItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  LicenseItem | null | undefined
  >("CreateLicense", async () => {
    const response = await api.post("core/license/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["Licenses"] });
    return response.data;
  });

  const LicenseMutate = mutate;
  const LicenseIsLoading = isLoading;
  const LicenseError = error;
  const LicenseIsSuccess = isSuccess;

  return {
    LicenseMutate,
    LicenseIsLoading,
    LicenseError,
    LicenseIsSuccess,reset
  };
}
