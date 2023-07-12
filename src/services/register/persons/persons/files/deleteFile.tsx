import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";

export interface CreateDeleteFileInterface {
  file_name: string;
  base64_file: string;
}

export function useDeleteDeleteFile(cpf?: string, id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateDeleteFileInterface | null | undefined
  >("attachDeleteFile", async () => {
    const response = await api.delete(
      `customer/persons/${cpf}/files/dettach/${id}`
    );
    await queryClient.refetchQueries({ queryKey: ["personFiles"] });
    return response.data;
  });

  const DeleteFileMutate = mutate;
  const DeleteFileIsLoading = isLoading;
  const DeleteFileError = error;
  const DeleteFileIsSuccess = isSuccess;

  return {
    DeleteFileMutate,
    DeleteFileIsLoading,
    DeleteFileError,
    DeleteFileIsSuccess,
  };
}
