import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useUpdateOperatorUser(body: any | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    NewUserInterface | null | undefined
  >("updateOperatorUser", async () => {
    const response = await api.put("core/user/update/partner", body, {});
    await queryClient.refetchQueries({ queryKey: ["OperatorUser"] });
    return response.data;
  });

  const updateLoading = isLoading;
  const updateError = error;
  const updateMutate = mutate;
  const updateSuccess = isSuccess;

  return {
    updateLoading,
    updateError,
    updateMutate,
    updateSuccess,
  };
}
