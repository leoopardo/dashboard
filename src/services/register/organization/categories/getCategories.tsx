import { api } from "../../../../config/api";
import { useQuery } from "react-query";
import { OrganizationCategoriesQuery, OrganizationCategoriesResponse } from "../../../types/register/organization/organizationCategories.interface";

export function useGetOrganizationCategories(params: OrganizationCategoriesQuery) {
  const { data, isFetching, error, refetch } = useQuery<
    OrganizationCategoriesResponse | null | undefined
  >(
    "OrganizationCategories",
    async () => {
      const response = await api.get(
        "core/entry-account/organization/category",
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
