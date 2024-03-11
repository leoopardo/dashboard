import { defaultTheme } from "../styles/defaultTheme";

export const getColor = (
  color:
    | "error"
    | "paid"
    | "waiting"
    | "waiting_refund"
    | "refund"
    | "waiting_refund_to_end_user"
    | "paid_to_merchant"
    | "paid_to_end_user"
    | "refund_to_end_user"
    | "refund_to_merchant"
) => {
  return defaultTheme.colors[color];
};
