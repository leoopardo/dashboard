import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCheckInvalidPixKey(id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    { bank_name: string; ispb: string } | null | undefined
  >("CheckInvalidPixKey", async () => {
    const response = await api.post(`pixkey/validator/check_pix_key/${id}`, {});
    await queryClient.refetchQueries({ queryKey: ["InvalidPixKey"] });
    return response.data;
  });

  const CheckMutate = mutate;
  const CheckIsLoading = isLoading;
  const CheckError: any = error;
  const CheckIsSuccess = isSuccess;

  return {
    CheckMutate,
    CheckIsLoading,
    CheckError,
    CheckIsSuccess,
  };
}
