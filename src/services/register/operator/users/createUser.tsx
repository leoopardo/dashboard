import { api } from "../../../../config/api";
import { useMutation, } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useCreateOperatorUser(body: NewUserInterface) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    NewUserInterface | null | undefined
  >("createOperatorUser", async () => {
    const response = await api.post("core/user/create/partner", body, {});
    await queryClient.refetchQueries({ queryKey: ["operatorUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
