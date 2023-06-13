import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      onError(err) {
          window.alert(err)
      },
    },
  },
});
