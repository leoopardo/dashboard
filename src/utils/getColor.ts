import { defaultTheme } from "../styles/defaultTheme";

export const getColor = (
  color: "error" | "paid" | "waiting" | "waiting_refund" | "refund"
) => {
  return defaultTheme.colors[color];
};
