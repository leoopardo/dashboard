import { GetMerchantCategoriesData, GetMerchantCategoryQuery } from "@src/services/types/register/merchants/merchantCategories";
import { api } from "../../../../config/api";
import { useQuery } from "react-query";

export function useGetMerchantCategories(params: GetMerchantCategoryQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    GetMerchantCategoriesData | null | undefined
  >(
    "MerchantCategories",
    async () => {
      const response = await api.get(
        "core/entry-account/category",
        {
          params,
        }
      );
      return response.data;
    },
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const CategoriesData = data;
  const isCategoriesDataFetching = isFetching;
  const CategoriesDataError: any = error;
  const refetchCategoriesData = refetch;
  return {
    CategoriesData,
    isCategoriesDataFetching,
    CategoriesDataError,
    refetchCategoriesData,
  };
}
