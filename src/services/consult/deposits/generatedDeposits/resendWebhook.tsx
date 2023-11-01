import { api } from "@src/config/api";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { useMutation } from "react-query";

export function useCreateSendWebhook(body: ResendWebhookBody, id?: string) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    ResendWebhookBody | null | undefined
  >("CreateResendWebhook", async () => {
    const response = await api.post(
      `webhook/schedule/deposit/pix/${id ?? ""}`,
      {},
      { params: { ...body } }
    );
    return response.data;
  });

  const ResendWebMutate = mutate;
  const ResendWebIsLoading = isLoading;
  const ResendWebError = error;
  const ResendWebIsSuccess = isSuccess;
  const ResendWebReset = reset;

  return {
    ResendWebMutate,
    ResendWebReset,
    ResendWebIsLoading,
    ResendWebError,
    ResendWebIsSuccess,
  };
}
