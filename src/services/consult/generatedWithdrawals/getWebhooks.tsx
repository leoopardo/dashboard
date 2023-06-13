import { api } from "../../../config/api";
import { useQuery } from "react-query";
import {
  WebhooksQuery,
  WebhooksResponse,
} from "../../types/generatedDeposits.interface";

export function useGetWithdrawalsWebhooks(id: string, params: WebhooksQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    WebhooksResponse | null | undefined
  >(
    "webhooks1",
    async () => {
      const response = await api.get(`report/logs/webhooks/withdraw/${id}`, {
        params,
      });
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const withdrawalsWebhooks = data;
  const isWithdrawalsWebhooksFetching = isFetching;
  const withdrawalsWebhooksError: any = error;
  const refetchWithdrawalsWebhooks = refetch;
  return {
    withdrawalsWebhooks,
    isWithdrawalsWebhooksFetching,
    withdrawalsWebhooksError,
    refetchWithdrawalsWebhooks,
  };
}
