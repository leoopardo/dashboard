import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { NewUserInterface } from "../../../../routes/private/Pages/register/organization/users/components/newUserModal";
import { queryClient } from "../../../queryClient";
import { useEffect } from "react";

export function useUpdatePartnerUser(body: any | null) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
    NewUserInterface | null | undefined
  >(
    "updatePartnerUser",
    async () => {
      const response = await api.put("core/user/update/partner", body, {});
      await queryClient.refetchQueries({ queryKey: ["partnerUser"] });
      return response.data;
    },
    {}
  );

  const updateLoading = isLoading;
  const updateError = error;
  const updateMutate = mutate;
  const updateSuccess = isSuccess;
  const updateReset = reset;

  return {
    updateLoading,
    updateError,
    updateMutate,
    updateSuccess,
    updateReset
  };
}
