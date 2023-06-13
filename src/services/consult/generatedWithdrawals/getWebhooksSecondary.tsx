import { api } from "../../../config/api";
import { useQuery } from "react-query";
import {
  WebhooksQuery,
  WebhooksResponse,
} from "../../types/generatedDeposits.interface";

export function useGetWithdrawalsWebhooks2(id: string, params: WebhooksQuery) {
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

  const withdrawalsWebhooks2 = data;
  const isWithdrawalsWebhooks2Fetching = isFetching;
  const withdrawalsWebhooks2Error: any = error;
  const refetchWithdrawalsWebhooks2 = refetch;
  return {
    withdrawalsWebhooks2,
    isWithdrawalsWebhooks2Fetching,
    withdrawalsWebhooks2Error,
    refetchWithdrawalsWebhooks2,
  };
}
