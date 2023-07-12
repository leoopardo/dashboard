import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";

export function useCreateMerchant(body: NewUserInterface) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    NewUserInterface | null | undefined
  >("createMerchant", async () => {
    const response = await api.post("core/merchant/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsRegister"] });
    return response.data;
  });

  const CreateMutate = mutate;
  const CreateIsLoading = isLoading;
  const CreateError = error;
  const CreateIsSuccess = isSuccess;

  return {
    CreateIsLoading,
    CreateError,
    CreateMutate,
    CreateIsSuccess,
  };
}
