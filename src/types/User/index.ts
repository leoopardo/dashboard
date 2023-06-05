export interface UserPermissions {
  register: {
    menu: boolean;
    paybrokers: {
      menu: boolean;
      users: {
        menu: boolean;
        paybrokers_user_list: boolean;
        paybrokers_user_create: boolean;
        paybrokers_user_update: boolean;
      };
      release_category: {
        menu: boolean;
        release_category_list: boolean;
        release_category_create: boolean;
        release_category_update: boolean;
      };
      banks_maintain: {
        menu: boolean;
        banks_maintain_list: boolean;
        banks_maintain_update: boolean;
      };
      general_configs: {
        menu: boolean;
        general_configs_list: boolean;
        general_configs_update_financial: boolean;
        general_configs_update_adminstrative: boolean;
      };
    };
    partner: {
      menu: boolean;
      users: {
        menu: boolean;
        partner_user_list: boolean;
        partner_user_create: boolean;
        partner_user_update: boolean;
      };
      partner: {
        menu: boolean;
        partner_list: boolean;
        partner_create: boolean;
        partner_update: boolean;
        partner_export_csv: boolean;
      };
    };
    merchant: {
      menu: boolean;
      users: {
        menu: boolean;
        merchant_user_list: boolean;
        merchant_user_create: boolean;
        merchant_user_update: true;
      };
      merchant: {
        menu: boolean;
        merchant_list: boolean;
        merchant_create: boolean;
        merchant_update: boolean;
        merchant_export_csv: boolean;
        merchant_config_banks: boolean;
        merchant_config_fees: boolean;
        merchant_config_merchant: boolean;
        merchant_config_paybrokers: boolean;
        merchant_config_credentials: boolean;
        merchant_config_ips: boolean;
        merchant_account: boolean;
        merchant_account_history: true;
      };
      blacklist: {
        menu: boolean;
        merchant_blacklist_list: boolean;
        merchant_blacklist_create: boolean;
        merchant_blacklist_delete: boolean;
        merchant_blacklist_export_csv: true;
      };
    };
    person: {
      menu: boolean;
      person: {
        menu: boolean;
        person_person_list: boolean;
        person_person_create: boolean;
        person_person_update: boolean;
        person_person_export_csv: boolean;
      };
      pix_whitelist: {
        menu: boolean;
        person_pix_whitelist_list: boolean;
        person_pix_whitelist_delete: boolean;
      };
      client_banks: {
        menu: boolean;
        person_client_banks_list: boolean;
        person_client_banks_export_csv: boolean;
      };
      blacklist: {
        menu: boolean;
        import_csv: {
          menu: boolean;
          person_blacklist_list: boolean;
          person_blacklist_create: boolean;
          person_blacklist_delete: boolean;
          person_blacklist_import_csv: boolean;
        };
        reason: {
          menu: boolean;
          person_blacklist_reason_list: boolean;
          person_blacklist_reason_create: boolean;
          person_blacklist_reason_update: boolean;
          person_blacklist_reason_delete: boolean;
        };
      };
    };
  };
  transactions: {
    menu: boolean;
    manual_transactions: {
      menu: boolean;
      transactions_manual_transactions_list: boolean;
      transactions_manual_transactions_create: boolean;
    };
    csv_file: {
      menu: boolean;
      transactions_csv_file_list: boolean;
      transactions_csv_file_export_csv: true;
    };
  };
  report: {
    menu: boolean;
    paybrokers: {
      menu: boolean;
      extract: {
        menu: boolean;
        report_paybrokers_extract_list: boolean;
      };
      bank_history: {
        menu: boolean;
        report_paybrokers_bank_history_list: boolean;
      };
      csv_file: {
        menu: boolean;
        report_paybrokers_csv_file_list: boolean;
      };
    };
    merchant: {
      menu: boolean;
      balance: {
        menu: boolean;
        report_merchant_balance_list: true;
      };
      extract: {
        menu: boolean;
        report_merchant_extract_list: true;
      };
      csv_file: {
        menu: boolean;
        report_merchant_csv_file_list: true;
      };
    };
    deposit: {
      menu: boolean;
      generated_deposit: {
        menu: boolean;
        report_deposit_generated_deposit_list: boolean;
        report_deposit_generated_deposit_list_totals: boolean;
        report_deposit_generated_deposit_resend_notification: boolean;
        report_deposit_generated_deposit_logs_notification: boolean;
        report_deposit_generated_deposit_export_csv: true;
      };
      paid_deposit: {
        menu: boolean;
        report_deposit_paid_deposit_list: boolean;
        report_deposit_paid_deposit_list_totals: boolean;
        report_deposit_paid_deposit_resend_notification: boolean;
        report_deposit_paid_deposit_logs_notification: boolean;
        report_deposit_paid_deposit_export_csv: true;
      };
      undelivered_deposit: {
        menu: boolean;
        report_deposit_undelivered_deposit_list: boolean;
        report_deposit_undelivered_deposit_list_totals: boolean;
        report_deposit_undelivered_deposit_resend_notification: boolean;
        report_deposit_undelivered_deposit_logs_notification: boolean;
        report_deposit_undelivered_deposit_export_csv: true;
      };
      report: {
        menu: boolean;
        report_deposit_report_list: true;
      };
    };
    withdraw: {
      menu: boolean;
      generated_withdraw: {
        menu: boolean;
        report_withdraw_generated_withdraw_list: boolean;
        report_withdraw_generated_withdraw_list_totals: boolean;
        report_withdraw_generated_withdraw_resend_notification: boolean;
        report_withdraw_generated_withdraw_logs_notification: boolean;
        report_withdraw_generated_withdraw_export_csv: true;
      };
      paid_withdraw: {
        menu: boolean;
        report_withdraw_paid_withdraw_list: boolean;
        report_withdraw_paid_withdraw_list_totals: boolean;
        report_withdraw_paid_withdraw_resend_notification: boolean;
        report_withdraw_paid_withdraw_logs_notification: boolean;
        report_withdraw_paid_withdraw_export_csv: true;
      };
      undelivered_withdraw: {
        menu: boolean;
        report_withdraw_undelivered_withdraw_list: boolean;
        report_withdraw_undelivered_withdraw_list_totals: boolean;
        report_withdraw_undelivered_withdraw_resend_notification: boolean;
        report_withdraw_undelivered_withdraw_logs_notification: boolean;
        report_withdraw_undelivered_withdraw_export_csv: true;
      };
      report: {
        menu: boolean;
        report_withdraw_report_list: true;
      };
    };
    chargeback: {
      menu: boolean;
      deposit_chargeback: {
        menu: boolean;
        report_chargeback_deposit_chargeback_list: boolean;
        report_chargeback_deposit_chargeback_list_totals: boolean;
        report_chargeback_deposit_chargeback_create: boolean;
        report_chargeback_deposit_chargeback_validate: boolean;
      };
      manual_deposit_chargeback: {
        menu: boolean;
        report_chargeback_manual_deposit_chargeback_list: boolean;
        report_chargeback_manual_deposit_chargeback_list_totals: boolean;
        report_chargeback_manual_deposit_chargeback_create: boolean;
        report_chargeback_manual_deposit_chargeback_update: boolean;
        report_chargeback_manual_deposit_chargeback_delete: boolean;
      };
      csv_file: {
        menu: true;
      };
    };
  };
  support: {
    menu: boolean;
    blacklist: {
      menu: boolean;
      banks: {
        menu: boolean;
        support_blacklist_bank_list: boolean;
        support_blacklist_bank_create: boolean;
      };
      third_party_pix_keys: {
        menu: boolean;
        support_blacklist_third_party_pix_keys_list: boolean;
        support_blacklist_third_party_pix_keys_delete: boolean;
      };
      invalid_pix_keys: {
        menu: boolean;
        support_blacklist_invalid_pix_keys_list: boolean;
        support_blacklist_invalid_pix_keys_delete: boolean;
      };
    };
  };
}

export interface User {
  id?: number;
  name: string;
  userame: string;
  merchant_id?: number;
  merchant_name?: string;
  organization_id?: number;
  partner_id?: number;
  last_signin_date: string;
  last_signin_ip: string;
  permissions: UserPermissions;
  type: number;
  phone_validated: boolean;
}
