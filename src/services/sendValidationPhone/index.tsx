import { api } from "../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../queryClient";


interface ValidatePhoneInterface {
  validation_token: string;
}
interface ValidatePhoneResponseInterface {
  cellphone: string;
  expiration: number;
}

export function useValidatePhone(body: ValidatePhoneInterface) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ValidatePhoneResponseInterface | null | undefined
  >("validatePhone", async () => {
    const response = await api.post("core/user/validate-phone", body, {});
    await queryClient.refetchQueries({ queryKey: ["Self"] });
    return response.data;
  });

  const ValidatePhone = mutate;
  const ValidatePhoneLoading = isLoading;
  const ValidatePhoneError = error;
  const ValidatePhoneSuccess = isSuccess;
  const tokenData = data;

  return {
    ValidatePhoneLoading,
    ValidatePhoneError,
    ValidatePhone,
    ValidatePhoneSuccess,
    tokenData,
  };
}
