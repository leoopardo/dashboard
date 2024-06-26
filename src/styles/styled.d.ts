import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      dark: string;
      grey: string;
      primary: string;
      secondary: string;
      refund_to_merchant: string;
      refunded: string;
      success: string;
      refunded_withdraw: string;
      paid_to_merchant: string;
      paid_to_end_user: string;
      refund_to_end_user: string;
      completed: string;
      invalid: string;
      paid: string;
      refund: string;
      error: string;
      expired: string;
      canceled: string;
      warnning: string;
      processing: string;
      in_analysis: string;
      pending: string;
      waiting: string;
      waiting_refund: string;
      waiting_refund_to_end_user: string;
      info: string;
      chartGreen: string;
      chartYellow: string;
      chartBlue: string;
      chartRed: string;
      expiring_in_30_days: string;
      active: string;
    };
  }
}
