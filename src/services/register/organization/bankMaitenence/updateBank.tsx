import { BankMaintenenceItem } from "@src/services/types/register/organization/bankMaintenence.interface";
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useUpdateBank(
  body: BankMaintenenceItem | null,
  id: number | undefined
) {
  const { isLoading, error, mutate, isSuccess, reset } = useMutation<
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
    updateBankSuccess,reset
  };
}
