import { OrganizationGeneralConfigs } from "@src/services/types/register/organization/organizationGeneralConfigs.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useUpdateOrganizationGeneralConfigs(
  body: OrganizationGeneralConfigs
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OrganizationGeneralConfigs | null | undefined
  >("UpdateGeneralConfigs", async () => {
    const response = await api.put("config/adjustconfigs", body, {});
    await queryClient.refetchQueries({
      queryKey: ["OrganizationGeneralConfigs"],
    });
    return response.data;
  });
  const updateMutate = mutate;
  const updateError = error;
  const updateIsLoading = isLoading;
  const updateSuccess = isSuccess;

  return {
    updateIsLoading,
    updateError,
    updateMutate,
    updateSuccess,
  };
}
