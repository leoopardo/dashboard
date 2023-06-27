import { api } from "../../../../config/api";
import { useMutation, } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useCreatePartnerUser(body: NewUserInterface) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    NewUserInterface | null | undefined
  >("createPartnerUser", async () => {
    const response = await api.post("core/user/create/partner", body, {});
    await queryClient.refetchQueries({ queryKey: ["partnerUser"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
