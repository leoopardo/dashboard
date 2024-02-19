/* eslint-disable @typescript-eslint/no-explicit-any */
import { DepositWebhooksData, DepositWebhooksQuery } from "@src/services/types/consult/deposits/webhooks.interface";
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetWithdrawWebhooks(
  params: DepositWebhooksQuery
) {
  const { data, isFetching, error, refetch } = useQuery<
  DepositWebhooksData | null | undefined
  >(
    "WithdrawWebhooks",
    async () => {

      const response = await api.get("webhook/schedule/withdraw/pix", {
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

  const WithdrawWebhooks = data;
  const isWithdrawWebhooksFetching = isFetching;
  const WithdrawWebhooksError: any = error;
  const refetchWithdrawWebhooks = refetch;
  return {
    WithdrawWebhooks,
    isWithdrawWebhooksFetching,
    WithdrawWebhooksError,
    refetchWithdrawWebhooks,
  };
}
