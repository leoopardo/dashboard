import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

interface CreateCategoryInterface {
  name: string;
  description: string;
}

export function useCreateOrganizationCategory(body: CreateCategoryInterface) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    CreateCategoryInterface | null | undefined
  >("CreateCategory", async () => {
    const response = await api.post(
      "core/entry-account/organization/create/category",
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["OrganizationCategories"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,reset
  };
}
