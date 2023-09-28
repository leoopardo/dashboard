import { useMutation } from "react-query";
import { api } from "../../../../config/api";

export function useUpdateMerchantBlacklist(body: { content: string } | null) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
  { content: string } | null | undefined
  >("UploadBlacklistFile", async () => {
    const response = await api.post("customer/bulk_create/merchants", body, {});
    // await queryClient.refetchQueries({ queryKey: ["MerchantBlacklist"] });
    return response.data;
  });

  return {
    isLoading,
    error,
    mutate,
    isSuccess,
  };
}
