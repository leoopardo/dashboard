export interface OrganizationGeneralConfigs {
  id?: number;
  organization_id?: number;
  cash_in_permission?: boolean;
  cash_in_disabled_message?: string;
  cash_in_max_value?: number;
  cash_in_max_value_receive_by_different_payer?: number;
  cash_in_max_value_receive_by_pj?: number;
  cash_in_receive_by_different_payer?: boolean;
  cash_in_receive_by_pj?: boolean;
  paybrokers_qr_code_expire_hours?: number;
  time_receive_after_expire_qr_code_hours?: number;
  cash_out_disabled_message?: string;
  cash_out_permission?: boolean;
  cash_out_max_value?: number;
  time_to_prevent_repeated_withdraw_minutes?: number;
  auto_switch_bank_acc?: boolean;
  max_value_to_switch_bank_acc?: number;
  min_value_to_switch_bank_acc?: number;
  check_last_waiting_pix?: boolean;
  check_last_waiting_pix_time_minutes?: number;
  callback_deposit_api_enable?: boolean;
  callback_withdraw_api_enable?: boolean;
  cash_in_max_value_by_month?: number;
  cash_out_max_value_by_month?: number;
  fastpix_qr_code_expire_seconds?: number;
}
