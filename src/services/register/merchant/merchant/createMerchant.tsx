import { MerchantsItem } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useCreateMerchant(body: MerchantsItem) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
  MerchantsItem | null | undefined
  >("createMerchant", async () => {
    const response = await api.post("core/merchant/create", body, {});
    await queryClient.refetchQueries({ queryKey: ["MerchantsRegister"] });
    return response.data;
  });

  const CreateMutate = mutate;
  const CreateIsLoading = isLoading;
  const CreateError = error;
  const CreateIsSuccess = isSuccess;
  const ClearCreate = reset

  return {
    CreateIsLoading,
    CreateError,
    CreateMutate,
    CreateIsSuccess,ClearCreate
  };
}
