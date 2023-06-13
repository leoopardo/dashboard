import { api } from "../../../config/api";
import { useQuery } from "react-query";
import {
  WebhooksQuery,
  WebhooksResponse,
} from "../../types/generatedDeposits.interface";

export function useGetDepositWebhooks2(id: string, params: WebhooksQuery) {
  const { data, isFetching, error, refetch } = useQuery<
  WebhooksResponse | null | undefined
  >(
    "webhooks2",
    async () => {
      const response = await api.get(`report/logs/webhooks/pix/secondary${id}`, {
        params,
      });
      return response.data;
    },
    { refetchOnWindowFocus: "always" }
  );

  const depositWebhooks2 = data;
  const isDepositWebhooks2Fetching = isFetching;
  const depositWebhooks2Error: any = error;
  const refetchDepositWebhooks2 = refetch;
  return {
    depositWebhooks2,
    isDepositWebhooks2Fetching,
    depositWebhooks2Error,
    refetchDepositWebhooks2,
  };
}
