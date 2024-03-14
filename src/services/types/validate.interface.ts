export interface ValidateInterface {
  id: number;
  name: string;
  username: string;
  organization_id: number;
  aggregator_id?: number;
  operator_id?: number;
  partner_id?: number;
  merchant_id?: number;
  last_signin_date: string;
  last_signin_ip: string;
  permissions: {
    register: {
      paybrokers: {
        menu: boolean;
        account: {
          menu: boolean;
          account_api_create: boolean;
          account_api_list: boolean;
          account_api_update: boolean;
        };
        users: {
          menu: boolean;
          paybrokers_user_list: boolean;
          paybrokers_user_create: boolean;
          paybrokers_user_update: boolean;
          paybrokers_user_export_csv: boolean;
        };
        release_category: {
          menu: boolean;
          paybrokers_release_category_list: boolean;
          paybrokers_release_category_create: boolean;
          paybrokers_release_category_update: boolean;
          paybrokers_release_category_export_csv: boolean;
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
          partner_user_export_csv: boolean;
        };
        partner: {
          menu: boolean;
          partner_list: boolean;
          partner_create: boolean;
          partner_update: boolean;
          partner_export_csv: boolean;
          partner_responsible_list: boolean;
          partner_responsible_create: boolean;
          partner_responsible_update: boolean;
          partner_responsible_delete: boolean;
          partner_files_list: boolean;
          partner_files_create: boolean;
          partner_files_delete: boolean;
          partner_customWebhook_delete: boolean;
          partner_customWebhook_list: boolean;
          partner_customWebhook_update: boolean;
        };
      };
      merchant: {
        menu: boolean;
        users: {
          menu: boolean;
          merchant_user_list: boolean;
          merchant_user_create: boolean;
          merchant_user_update: boolean;
          merchant_user_export_csv: boolean;
        };
        merchant: {
          menu: boolean;
          merchant_list: boolean;
          merchant_create: boolean;
          merchant_update: boolean;
          merchant_export_csv: boolean;
          merchant_config_banks: boolean;
          merchant_config_fees: boolean;
          merchant_list_fees: boolean;
          merchant_config_merchant: boolean;
          merchant_config_paybrokers: boolean;
          merchant_config_credentials: boolean;
          merchant_config_ips: boolean;
          merchant_account_api_get: boolean;
          merchant_account_api_update: boolean;
          merchant_responsible_list: boolean;
          merchant_responsible_create: boolean;
          merchant_responsible_update: boolean;
          merchant_responsible_delete: boolean;
          merchant_files_list: boolean;
          merchant_files_create: boolean;
          merchant_files_delete: boolean;
        };
        release_category: {
          menu: boolean;
          merchant_release_category_list: boolean;
          merchant_release_category_create: boolean;
          merchant_release_category_update: boolean;
          merchant_release_category_export_csv: boolean;
        };
        fee_plans: {
          menu: boolean;
          merchant_fee_plans_list: boolean;
          merchant_fee_plans_create: boolean;
          merchant_fee_plans_update: boolean;
          merchant_fee_plans_delete: boolean;
          merchant_fee_plans_export_csv: boolean;
        };
        blacklist: {
          menu: boolean;
          merchant_blacklist_list: boolean;
          merchant_blacklist_create: boolean;
          merchant_blacklist_delete: boolean;
          merchant_blacklist_export_csv: boolean;
        };
        black_list_reason: {
          menu: boolean;
          merchant_blacklist_reason_list: boolean;
          merchant_blacklist_reason_create: boolean;
          merchant_blacklist_reason_delete: boolean;
          merchant_blacklist_reason_update: boolean;
          merchant_blacklist_reason_export_csv: boolean;
        };
      };
      aggregator: {
        menu: boolean;
        users: {
          menu: boolean;
          aggregator_user_list: boolean;
          aggregator_user_create: boolean;
          aggregator_user_update: boolean;
          aggregator_user_export_csv: boolean;
        };
        aggregator: {
          menu: boolean;
          aggregator_list: boolean;
          aggregator_create: boolean;
          aggregator_update: boolean;
          aggregator_export_csv: boolean;
          aggregator_responsible_list: boolean;
          aggregator_responsible_create: boolean;
          aggregator_responsible_update: boolean;
          aggregator_responsible_delete: boolean;
          aggregator_files_list: boolean;
          aggregator_files_create: boolean;
          aggregator_files_delete: boolean;
        };
        aggregator_config: {
          menu: boolean;
          aggregator_config_update: boolean;
        };
        blacklist: {
          menu: boolean;
          aggregator_blacklist_list: boolean;
          aggregator_blacklist_create: boolean;
          aggregator_blacklist_delete: boolean;
          aggregator_blacklist_export_csv: boolean;
        };
        black_list_reason: {
          menu: boolean;
          aggregator_blacklist_reason_list: boolean;
          aggregator_blacklist_reason_create: boolean;
          aggregator_blacklist_reason_delete: boolean;
          aggregator_blacklist_reason_update: boolean;
          aggregator_blacklist_reason_export_csv: boolean;
        };
        self_exclusion: {
          menu: boolean;
          aggregator_self_exclusion_list: boolean;
          aggregator_self_exclusion_create: boolean;
          aggregator_self_exclusion_delete: boolean;
          aggregator_self_exclusion_update: boolean;
          aggregator_self_exclusion_export_csv: boolean;
        };
      };
      operator: {
        menu: boolean;
        users: {
          menu: boolean;
          operator_user_list: boolean;
          operator_user_create: boolean;
          operator_user_update: boolean;
          operator_user_export_csv: boolean;
        };
        operator: {
          menu: boolean;
          operator_list: boolean;
          operator_create: boolean;
          operator_update: boolean;
          operator_export_csv: boolean;
          operator_responsible_list: boolean;
          operator_responsible_create: boolean;
          operator_responsible_update: boolean;
          operator_responsible_delete: boolean;
          operator_files_list: boolean;
          operator_files_create: boolean;
          operator_files_delete: boolean;
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
          person_pix_whitelist_export_csv: boolean;
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
            person_blacklist_import_csv: boolean;
          };
          reason: {
            menu: boolean;
            person_blacklist_reason_list: boolean;
            person_blacklist_reason_create: boolean;
            person_blacklist_reason_update: boolean;
            person_blacklist_reason_delete: boolean;
            person_blacklist_export_csv: boolean;
          };
        };
      };
      licenses: {
        menu: boolean;
        licenses: {
          menu: boolean;
          license_create: boolean;
          license_delete: boolean;
          license_export_csv: boolean;
          license_files_create: boolean;
          license_files_delete: boolean;
          license_files_list: boolean;
          license_list: boolean;
          license_update: boolean;
        };
      };
    };
    transactions: {
      menu: boolean;
      paybrokers: {
        menu: boolean;
        manual_transactions: {
          menu: boolean;
          paybrokers_manual_transactions_list: boolean;
          paybrokers_manual_transactions_create: boolean;
          paybrokers_manual_transactions_export_csv: boolean;
        };
        internal_transfers: {
          menu: boolean;
          paybrokers_internal_transfers_list: boolean;
          paybrokers_internal_transfers_create: boolean;
          paybrokers_internal_transfers_export_csv: boolean;
        };
      };
      merchant: {
        menu: boolean;
        merchant_pre_manual: {
          menu: boolean;
          merchant_pre_manual_transactions_list: boolean;
          merchant_pre_manual_transactions_create: boolean;
          merchant_pre_manual_transactions_update: boolean;
          merchant_pre_manual_transactions_delete: boolean;
          merchant_pre_manual_transactions_approve: boolean;
        };
        manual_transactions: {
          menu: boolean;
          merchant_manual_transactions_list: boolean;
          merchant_manual_transactions_create: boolean;
          merchant_manual_transactions_export_csv: boolean;
        };
        internal_transfers: {
          menu: boolean;
          merchant_internal_transfers_list: boolean;
          merchant_internal_transfers_create: boolean;
          merchant_internal_transfers_export_csv: boolean;
        };
      };
    };
    report: {
      menu: boolean;
      paybrokers: {
        menu: boolean;
        extract: {
          menu: boolean;
          report_paybrokers_extract_list: boolean;
          report_paybrokers_extract_export_csv: boolean;
        };
        balance: {
          menu: boolean;
          report_paybrokers_balance_list: boolean;
          report_paybrokers_balance_export_csv: boolean;
        };
        bank_history: {
          menu: boolean;
          report_paybrokers_bank_history_list: boolean;
          report_paybrokers_bank_history_export_csv: boolean;
        };
        bank_balance: {
          menu: boolean;
          report_paybrokers_bank_balance_list: boolean;
          report_paybrokers_bank_balance_history_list: boolean;
        };
      };
      merchant: {
        menu: boolean;
        extract: {
          menu: boolean;
          report_merchant_extract_list: boolean;
          report_merchant_extract_export_csv: boolean;
        };
        balance: {
          menu: boolean;
          report_merchant_balance_list: boolean;
          report_merchant_balance_export_csv: boolean;
        };
        balance_history: {
          menu: boolean;
          report_merchant_balance_history_list: boolean;
          report_merchant_balance_history_export_csv: boolean;
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
          report_deposit_generated_deposit_export_csv: boolean;
        };
        paid_deposit: {
          menu: boolean;
          report_deposit_paid_deposit_list: boolean;
          report_deposit_paid_deposit_list_totals: boolean;
          report_deposit_paid_deposit_resend_notification: boolean;
          report_deposit_paid_deposit_logs_notification: boolean;
          report_deposit_paid_deposit_export_csv: boolean;
        };
        undelivered_deposit: {
          menu: boolean;
          report_deposit_undelivered_deposit_list: boolean;
          report_deposit_undelivered_deposit_list_totals: boolean;
          report_deposit_undelivered_deposit_resend_notification: boolean;
          report_deposit_undelivered_deposit_logs_notification: boolean;
          report_deposit_undelivered_deposit_export_csv: boolean;
        };
        deposit_receipt: {
          menu: boolean;
          report_deposit_receipt_list: boolean;
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
          report_withdraw_generated_withdraw_receipt: boolean;
          report_withdraw_generated_withdraw_export_csv: boolean;
        };
        paid_withdraw: {
          menu: boolean;
          report_withdraw_paid_withdraw_list: boolean;
          report_withdraw_paid_withdraw_list_totals: boolean;
          report_withdraw_paid_withdraw_resend_notification: boolean;
          report_withdraw_paid_withdraw_logs_notification: boolean;
          report_withdraw_paid_withdraw_receipt: boolean;
          report_withdraw_paid_withdraw_export_csv: boolean;
        };
        undelivered_withdraw: {
          menu: boolean;
          report_withdraw_undelivered_withdraw_list: boolean;
          report_withdraw_undelivered_withdraw_list_totals: boolean;
          report_withdraw_undelivered_withdraw_resend_notification: boolean;
          report_withdraw_undelivered_withdraw_logs_notification: boolean;
          report_withdraw_undelivered_withdraw_export_csv: boolean;
        };
      };
      chargeback: {
        menu: boolean;
        deposit_chargeback: {
          menu: boolean;
          report_chargeback_deposit_chargeback_list: boolean;
          report_chargeback_deposit_chargeback_list_totals: boolean;
          report_chargeback_deposit_chargeback_receipt: boolean;
          report_chargeback_deposit_chargeback_refund: boolean;
          report_chargeback_deposit_chargeback_paid_to_merchant: boolean;
          report_chargeback_deposit_chargeback_validate_status: boolean;
          report_chargeback_deposit_chargeback_export_csv: boolean;
        };
        manual_deposit_chargeback: {
          menu: boolean;
          report_chargeback_manual_deposit_chargeback_list: boolean;
          report_chargeback_manual_deposit_chargeback_list_totals: boolean;
          report_chargeback_manual_deposit_chargeback_refund: boolean;
          report_chargeback_manual_deposit_chargeback_update_merchant: boolean;
          report_chargeback_manual_deposit_chargeback_paid_to_merchant: boolean;
          report_chargeback_manual_deposit_chargeback_validate_status: boolean;
          report_chargeback_manual_deposit_chargeback_delete: boolean;
          report_chargeback_manual_deposit_chargeback_receipt: boolean;
          report_chargeback_manual_deposit_chargeback_export_csv: boolean;
          report_chargeback_manual_deposit_chargeback_paid_to_enduser: boolean;
        };
        withdraw_chargeback: {
          menu: boolean;
          report_chargeback_withdraw_chargeback_list: boolean;
          report_chargeback_withdraw_chargeback_list_totals: boolean;
          report_chargeback_withdraw_chargeback_validate_status: boolean;
          report_chargeback_withdraw_chargeback_paid_to_merchant: boolean;
          report_chargeback_withdraw_chargeback_export_csv: boolean;
        };
      };
      person: {
        menu: boolean;
        report_check_document_by_merchant_export_csv: boolean;
        report_check_document_by_merchant_list: boolean;
        report_check_document_total: boolean;
        report_person_check_cpf_list: boolean;
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
          support_blacklist_bank_delete: boolean;
          support_blacklist_bank_export_csv: boolean;
        };
        third_party_pix_keys: {
          menu: boolean;
          support_blacklist_third_party_pix_keys_list: boolean;
          support_blacklist_third_party_pix_keys_delete: boolean;
          support_blacklist_third_party_pix_keys_create_csv: boolean;
        };
        invalid_pix_keys: {
          menu: boolean;
          support_blacklist_invalid_pix_keys_list: boolean;
          support_blacklist_invalid_pix_keys_check: boolean;
          support_blacklist_invalid_pix_keys_delete: boolean;
          support_blacklist_invalid_pix_keys_export_csv: boolean;
        };
      };
      contestation: {
        menu: boolean;
        deposits: {
          menu: boolean;
          import_csv: {
            menu: boolean;
            support_deposit_impugnment_import_csv: boolean;
            support_deposit_impugnment_list: boolean;
          };
        };
        withdraw: {
          menu: boolean;
          import_csv: {
            menu: boolean;
            support_withdraw_impugnment_list: boolean;
            support_withdraw_impugnment_import_csv: boolean;
          };
        };
      };
      logs: {
        menu: boolean;
        withdraw_error_logs: {
          menu: boolean;
          report_withdraw_error_logs_list: boolean;
          report_withdraw_error_logs_export_csv: boolean;
        };
        deposit_error_logs: {
          menu: boolean;
          report_deposit_error_logs_list: boolean;
          report_deposit_error_logs_export_csv: boolean;
        };
        auth_logs: {
          menu: boolean;
          support_logs_api_auth_list: boolean;
        };
      };
    };
  };
  type: number;
  phone_validated: boolean;
}
