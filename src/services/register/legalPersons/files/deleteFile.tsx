import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export interface CreateDeleteFileInterface {
  file_name: string;
  base64_file: string;
}

export function useDeleteLegalPersonFile(cpf?: string, id?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateDeleteFileInterface | null | undefined
  >("attachLegalPersonDeleteFile", async () => {
    const response = await api.delete(
      `customer/company/${cpf}/files/dettach/${id}`
    );
    await queryClient.refetchQueries({ queryKey: ["LegalPersonFiles"] });
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
