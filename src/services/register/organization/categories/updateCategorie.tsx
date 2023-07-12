import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export interface UpdateCategoryInterface {
  name?: string;
  description?: string;
  entry_account_category_id?: number;
  status?: boolean;
}

export function useUpdateOrganizationCategory(body: UpdateCategoryInterface) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    UpdateCategoryInterface | null | undefined
  >("UpdateCategory", async () => {
    const response = await api.put(
      "core/entry-account/organization/update/category",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["OrganizationCategories"] });
    return response.data;
  });

  const updateMutate = mutate;
  const updateError = error;
  const updateIsLoading = isLoading;
  const updateSuccess = isSuccess;

  return {
    updateIsLoading,
    updateError,
    updateMutate,
    updateSuccess,
  };
}
