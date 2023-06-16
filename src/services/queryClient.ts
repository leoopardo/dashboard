import { toast } from "react-hot-toast";
import { QueryCache, QueryClient } from "react-query";
import i18n from "../i18n";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      retry: false,
    },
  },
});
