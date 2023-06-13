import { api } from "../../../config/api";
import { useQuery } from "react-query";
import {
  WebhooksQuery,
  WebhooksResponse,
} from "../../types/generatedDeposits.interface";

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
