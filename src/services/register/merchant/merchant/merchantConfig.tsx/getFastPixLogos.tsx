/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@config/api";
import { IMerchantLogosResponse } from "@src/services/types/register/merchants/merchantConfig.interface";
import { useQuery } from "react-query";

export function useGetMerchantLogos(id?: string) {
  const { data, isFetching, error, refetch } =
    useQuery<IMerchantLogosResponse | null>(
      "MerchantLogos",
      async () => {
        const response = await api.get("/core/merchant/logos", {
          params: { merchant_id: id },
        });
        return response.data;
      },
      {refetchOnWindowFocus: false}
    );

  const merchantLogosData = data;
  const isMerchantLogosFetching = isFetching;
  const merchantLogosError: any = error;
  const refetchMerchantLogosData = refetch;
  return {
    merchantLogosData,
    isMerchantLogosFetching,
    merchantLogosError,
    refetchMerchantLogosData,
  };
}
