import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useUpdateOrganizationUser(body: any | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    NewUserInterface | null | undefined
  >("updateOrganizationUser", async () => {
    const response = await api.put("core/user/update/organization", body, {});
    await queryClient.refetchQueries({ queryKey: ["OrganizationUser"] });
    return response.data;
  });

  const updateLoading = isLoading;
  const updateError = error;
  const updateMutate = mutate;
  const updateSuccess = isSuccess;
  const updateReset = reset;

  return {
    updateLoading,
    updateError,
    updateMutate,
    updateSuccess,
    updateReset,
  };
}
