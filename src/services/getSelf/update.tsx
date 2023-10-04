/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "react-query";
import { api } from "../../config/api";
import { queryClient } from "../queryClient";
import {
  SelfInterface,
  UpdateSelf,
} from "../types/register/self/self.interface";

export function useUpdateSelf(body: UpdateSelf) {
  const { error, isLoading, mutate, isSuccess, reset } = useMutation<
    SelfInterface | null | undefined
  >("Self", async () => {
    const response = await api.put("core/user/update/self", body, {});
    
    await queryClient.refetchQueries({ queryKey: ["Self"] });
    return response.data;
  });

  return {
    error,
    isLoading,
    mutate,
    isSuccess,
    reset,
  };
}
