import { useQuery } from "react-query";
import { api } from "../../../../config/api";
import {
  WebhooksQuery,
  WebhooksResponse,
} from "../../../types/consult/deposits/generatedDeposits.interface";

export function useGetDepositWebhooks(id: string, params: WebhooksQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    WebhooksResponse | null | undefined
  >(
    "webhooks1",
    async () => {
      const response = await api.get(`report/logs/webhooks/pix/${id}`, {
        params,
      });
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const depositWebhooks = data;
  const isDepositWebhooksFetching = isFetching;
  const depositWebhooksError: any = error;
  const refetchDepositWebhooks = refetch;
  return {
    depositWebhooks,
    isDepositWebhooksFetching,
    depositWebhooksError,
    refetchDepositWebhooks,
  };
}
