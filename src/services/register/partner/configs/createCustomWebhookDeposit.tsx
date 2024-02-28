import { queryClient } from "@src/services/queryClient";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";
import { useMutation } from "react-query";
import { DepositFields } from "@src/services/types/register/partners/configs/partnerConfigs.interface";
import { api } from "@src/config/api";

export function useCreateCustomDepositWebhook({id, body}: {id?: number, body?: DepositFields}) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    PartnerItem | null | undefined
  >("CreatePartnerCustomWebhookDeposit", async () => {
    const response = await api.post(`core/partner/custom-webhook/deposit/${id}`, body, {});
    await queryClient.refetchQueries({ queryKey: ["partnerCustomWebhookDeposit"] });
    return response.data;
  });

  const CreateCustomDepositWebhookMutate = mutate;
  const CreateCustomDepositWebhookIsLoading = isLoading;
  const CreateCustomDepositWebhookError = error;
  const CreateCustomDepositWebhookIsSuccess = isSuccess;
  const CreateCustomDepositWebhookReset = reset;

  return {
    CreateCustomDepositWebhookMutate,
    CreateCustomDepositWebhookIsLoading,
    CreateCustomDepositWebhookError,
    CreateCustomDepositWebhookIsSuccess,
    CreateCustomDepositWebhookReset
  };
}
