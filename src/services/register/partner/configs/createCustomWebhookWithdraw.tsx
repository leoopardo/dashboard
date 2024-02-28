import { queryClient } from "@src/services/queryClient";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { WithdrawFields } from "@src/services/types/register/partners/configs/partnerConfigs.interface";

import { api } from "@src/config/api";

export function useCreateCustomWithdrawWebhook({
  id,
  body,
}: {
  id?: number;
  body: WithdrawFields;
}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerItem | null | undefined
  >("CreatePartnerCustomWebhookWithdraw", async () => {
    const response = await api.post(
      `core/partner/custom-webhook/withdraw/${id}`,
      body,
      {}
    );
    await queryClient.refetchQueries({
      queryKey: ["partnerCustomWebhookWithdraw"],
    });
    return response.data;
  });

  const CreateCustomWithdrawWebhookMutate = mutate;
  const CreateCustomWithdrawWebhookIsLoading = isLoading;
  const CreateCustomWithdrawWebhookError = error;
  const CreateCustomWithdrawWebhookIsSuccess = isSuccess;
  const CreateCustomWithdrawWebhookReset = reset;

  return {
    CreateCustomWithdrawWebhookMutate,
    CreateCustomWithdrawWebhookIsLoading,
    CreateCustomWithdrawWebhookError,
    CreateCustomWithdrawWebhookIsSuccess,
    CreateCustomWithdrawWebhookReset,
  };
}
