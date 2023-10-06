/* eslint-disable @typescript-eslint/no-explicit-any */
import { DepositWebhooksData, DepositWebhooksQuery } from "@src/services/types/consult/deposits/webhooks.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetDepositsWebhooks(
  params: DepositWebhooksQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  DepositWebhooksData | null | undefined
  >(
    "depositsWebhooks",
    async () => {
      const response = await api.get("webhook/schedule/deposit/pix", {
        params,
      });
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const depositsWebhooks = data;
  const isDepositsWebhooksFetching = isFetching;
  const depositsWebhooksError: any = error;
  const refetchDepositsWebhooks = refetch;
  return {
    depositsWebhooks,
    isDepositsWebhooksFetching,
    depositsWebhooksError,
    refetchDepositsWebhooks,
  };
}
