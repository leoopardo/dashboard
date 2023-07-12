import { api } from "@config/api";
import { MerchantBankResponse } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import { useQuery } from "react-query";

export function useMerchantBankConfig(id?: string) {
  const { data, isFetching, error, refetch } =
    useQuery<MerchantBankResponse | null>(
      "MerchantBankConfig",
      async () => {
        const response = await api.get("core/merchant/config/banks", {
          params: { merchant_id: id },
        });
        return response.data;
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
      }
    );

  const merchantBankData = data;
  const isMerchantBankFetching = isFetching;
  const merchantBankError: any = error;
  const refetchMerchantBankData = refetch;
  return {
    merchantBankData,
    isMerchantBankFetching,
    merchantBankError,
    refetchMerchantBankData,
  };
}
