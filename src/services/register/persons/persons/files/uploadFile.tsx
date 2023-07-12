import { queryClient } from "@src/services/queryClient";
import { useMutation } from "react-query";
import { api } from "../../../../../config/api";

export interface CreateFileInterface {
  file_name: string;
  base64_file: string;
}

export function useUploadFile(body: CreateFileInterface | null, cpf?: string) {
  const { isLoading, error, mutate, isSuccess } = useMutation<
    CreateFileInterface | null | undefined
  >("attachFile", async () => {
    const response = await api.post(
      `customer/persons/${cpf}/files/attach`,
      body,
      {}
    );
    await queryClient.refetchQueries({ queryKey: ["personFiles"] });
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
