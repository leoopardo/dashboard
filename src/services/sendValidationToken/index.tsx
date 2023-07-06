import { api } from "../../config/api";
import { useMutation } from "react-query";

interface ValidateTokenInterface {
  action: string;
  cellphone?: string | undefined;
}
interface ValidateTokenResponseInterface {
  cellphone: string;
  expiration: number;
}

export function useValidateToken(body: ValidateTokenInterface, dispatch?: boolean) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
    ValidateTokenResponseInterface | null | undefined
  >("validateToken", async () => {
    const response = dispatch && await api.post("core/user/validation-token", body, {});
    return response && response.data;
  });

  const ValidateToken = mutate;
  const ValidateTokenLoading = isLoading;
  const ValidateTokenError = error;
  const ValidateTokenSuccess = isSuccess;
  const tokenData = data;

  return {
    ValidateTokenLoading,
    ValidateTokenError,
    ValidateToken,
    ValidateTokenSuccess,
    tokenData,
  };
}
