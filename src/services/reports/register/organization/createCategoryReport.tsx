import { queryClient } from "@src/services/queryClient";
import { OrganizationCategoriesQuery } from "@src/services/types/register/organization/organizationCategories.interface";
import { ReportsDataResponse } from "@src/services/types/reports/reports.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useCreateOrganizationCategoryReports(
  body: OrganizationCategoriesQuery
) {
  const { isLoading, error, mutate, isSuccess, data } = useMutation<
  ReportsDataResponse | null | undefined
  >("CreateCategoryReports", async () => {
    const response = await api.post(
      "core/csv/organization/entry-account/category",
      body,
      { params: body }
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
  const CategoryReportsData = data;
  return {
    CategoryReportsMutate,
    CategoryReportsIsLoading,
    CategoryReportsError,
    CategoryReportsIsSuccess,
    CategoryReportsData,
  };
}
