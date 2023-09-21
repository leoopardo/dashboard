import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      dark: string;
      primary: string;
      secondary: string;

      success: string;
      refunded_withdraw: string;
      paid: string;
      refund: string;
      error: string;
      expired: string;
      canceled: string;
      warnning: string;
      in_analysis: string;
      pending: string;
      waiting: string;
      waiting_refund: string;
      info: string;
    };
  }
}
