import { api } from "@src/config/api";
import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";

export interface CreateFileInterface {
  file_name?: string;
  base64_file?: string;
}

export function useUploadLegalPersonFile(
  body?: CreateFileInterface,
  cpf?: string
) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateFileInterface | null | undefined
  >("UploadLegalPersonFile", async () => {
    const response = await api.post(
      `customer/company/${cpf}/files/attach`,
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["LegalPersonFiles"] });
    return response.data;
  });

  const FileMutate = mutate;
  const FileIsLoading = isLoading;
  const FileError = error;
  const FileIsSuccess = isSuccess;

  return {
    FileMutate,
    FileIsLoading,
    FileError,
    FileIsSuccess,
  };
}
