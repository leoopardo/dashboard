import { api } from "../../../../config/api";
import { useMutation } from "react-query";
import { queryClient } from "../../../queryClient";
import { BankMaintenenceItem } from "@src/services/types/register/organization/bankMaintenence.interface";

export function useUpdateBank(
  body: BankMaintenenceItem | null,
  id: number | undefined
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    BankMaintenenceItem | null | undefined
  >("OrganizationBankUpdate", async () => {
    const response = await api.put(`config/update_banks/${id}`, body, {});
    await queryClient.refetchQueries({
      queryKey: ["OrganizationBankMaintenece"],
    });
    return response.data;
  });

  const updateBank = mutate;
  const updateBankLoading = isLoading;
  const updateBankError = error;
  const updateBankSuccess = isSuccess;

  return {
    updateBank,
    updateBankLoading,
    updateBankError,
    updateBankSuccess,
  };
}
