import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useCreateOrganizationUser(body: NewUserInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    NewUserInterface | null | undefined
  >("createOrganizationUser", async () => {
    const response = await api.post("core/user/create/organization", body, {});
    await queryClient.refetchQueries({ queryKey: ["OrganizationUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
    reset,
  };
}
