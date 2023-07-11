import { api } from "@src/config/api";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { useMutation } from "react-query";

export function useCreateSendWithdrawWebhook(body: ResendWebhookBody) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    ResendWebhookBody | null | undefined
  >("CreateResendWithdrawWebhook", async () => {
    const response = await api.post(
      "webhook/schedule/withdraw/pix",
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
