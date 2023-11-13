/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { api } from "../../../../config/api";

export function useGetReceipts(endToEndId?: string) {
  const { data, isFetching, error, refetch, isSuccess } = useQuery<
    | {
        message: string;
        code: number;
        transaction: {
          id?: string;
          bank?: string;
          merchant_id?: number;
          acquirer_id?: string;
          value?: number;
          payer_name?: string;
          payer_document?: string;
          endToEndId?: string;
          email?: string;
          status?: string;
          date?: string;
          required_date?: string;
          refund_date?: string;
        };
      }
    | null
    | undefined
  >(
    "receipts",
    async () => {
      const response = await api.post(`reconciliation/pix/pix/e2e`, {
        endToEndId,
      });
      return response.data;
    },
    { refetchOnWindowFocus: "always", enabled: false }
  );

  const receipts = data;
  const isReceiptsFetching = isFetching;
  const receiptsError: any = error;
  const refetchReceipts = refetch;

  return {
    receipts,
    isReceiptsFetching,
    receiptsError,
    refetchReceipts,
    isSuccess,
  };
}
