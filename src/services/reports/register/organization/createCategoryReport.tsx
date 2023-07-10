import { queryClient } from "@src/services/queryClient";
import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { OrganizationCategoriesQuery } from "@src/services/types/register/organization/organizationCategories.interface";

export function useCreateOrganizationCategoryReports(body: OrganizationCategoriesQuery) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  OrganizationCategoriesQuery | null | undefined
  >("CreateCategoryReports", async () => {
    const response = await api.post("core/csv/organization/entry-account/category", body, {});
    await queryClient.refetchQueries({ queryKey: ["OrganizationCategoriesReports"] });
    return response.data;
  });

  const CategoryReportsMutate = mutate;
  const CategoryReportsIsLoading = isLoading;
  const CategoryReportsError = error;
  const CategoryReportsIsSuccess = isSuccess;

  return {
    CategoryReportsMutate,
    CategoryReportsIsLoading,
    CategoryReportsError,
    CategoryReportsIsSuccess,
  };
}
