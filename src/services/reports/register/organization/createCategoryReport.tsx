import { queryClient } from "@src/services/queryClient";
import { OrganizationCategoriesQuery } from "@src/services/types/register/organization/organizationCategories.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOrganizationCategoryReports(
  body: OrganizationCategoriesQuery
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    OrganizationCategoriesQuery | null | undefined
  >("CreateCategoryReports", async () => {
    const response = await api.post(
      "core/csv/organization/entry-account/category",
      body,
      {  params: body,}
    );
    await queryClient.refetchQueries({
      queryKey: ["OrganizationCategoriesReports"],
    });
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
