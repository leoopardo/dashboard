/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../../../config/api";
import { queryClient } from "../../../queryClient";

export function useDeleteAggregatorReason(reason_id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    any | null | undefined
  >("DeleteAggregatorReason", async () => {
    const response = await api.delete(
      `blacklist/aggregator-black-list/reasons`,
      { params: { _id: reason_id } }
    );
    await queryClient.refetchQueries({
      queryKey: ["AggregatorBlacklistReason"],
    });
    return response.data;
  });
  const isDeleteLoading = isLoading;
  const DeleteError = error;
  const mutateDelete = mutate;
  const isDeleteSuccess = isSuccess;
  return {
    isDeleteLoading,
    DeleteError,
    mutateDelete,
    isDeleteSuccess,
  };
}
