import { useValidate } from "@src/services/siginIn/validate";
import { Route, Routes } from "react-router-dom";
import { NotFount } from "../public/Pages/404";
import { GeneratedDeposits } from "./Pages/consult/deposits/generated";
import { PaidDeposits } from "./Pages/consult/deposits/paid";
import { DepositsReceipts } from "./Pages/consult/deposits/receipts";
import { GeneratedDepositsReports } from "./Pages/consult/deposits/reports/generatedDeposits";
import { PaidDepositsReports } from "./Pages/consult/deposits/reports/paidDeposits";
import { DepositsWebhooks } from "./Pages/consult/deposits/reports/webhooks";
import { UndeliveredDeposits } from "./Pages/consult/deposits/undelivered";
import { MerchantBalance } from "./Pages/consult/merchant/balance";
import { MerchantBankStatement } from "./Pages/consult/merchant/bankStatement";
import { MerchantHistory } from "./Pages/consult/merchant/history";
import { ConsultMerchantReports } from "./Pages/consult/merchant/reports";
import { OrganizationBalance } from "./Pages/consult/organization/balance";
import { OrganizationBankBalance } from "./Pages/consult/organization/bankBalance";
import { OrganizationBankStatement } from "./Pages/consult/organization/bankStatement";
import { OrganizationHistory } from "./Pages/consult/organization/history";
import { ConsultOrganizationReports } from "./Pages/consult/organization/reports";
import { CheckDocument } from "./Pages/consult/persons/checkDocument";
import { HistoricCpfByMerchant } from "./Pages/consult/persons/historicCpfByMerchant";
import { HistoricCpfByMerchantDetails } from "./Pages/consult/persons/historicCpfByMerchant/details";
import { HistoricCpfByMerchantReports } from "./Pages/consult/persons/reports/historicCpfByMerchant";
import { HistoricCpfByMerchantDetailsReports } from "./Pages/consult/persons/reports/historicCpfByMerchantDetails";
import { RefundDeposits } from "./Pages/consult/refunds/deposits";
import { RefundDepositsManual } from "./Pages/consult/refunds/depositsManual";
import { RefundDepositsReports } from "./Pages/consult/refunds/reports/deposits";
import { RefundManualDepositsReports } from "./Pages/consult/refunds/reports/manualDeposits";
import { RefundWithdrawalsReports } from "./Pages/consult/refunds/reports/withdrawals";
import { RefundWithdrawals } from "./Pages/consult/refunds/withdrawals";
import { GeneratedWithdrawals } from "./Pages/consult/withdrawals/generated";
import { PaidWithdrawals } from "./Pages/consult/withdrawals/paid";
import { GeneratedWithdrawalsReports } from "./Pages/consult/withdrawals/reports/generatedWithdrawals";
import { PaidWithdrawalsReports } from "./Pages/consult/withdrawals/reports/paidWithdrawals";
import { WithdrawWebhooks } from "./Pages/consult/withdrawals/reports/webhooks";
import { UndeliveredWithdrawals } from "./Pages/consult/withdrawals/undelivered";
import { Dashboard } from "./Pages/dashboard";
import { AggregatorTransfersBetweenAccounts } from "./Pages/moviments/aggregator/betweenAccounts";
import { AggregatorTransferBetweenAccountsReports } from "./Pages/moviments/aggregator/reports/betweenAccounts";
import { TransfersBetweenAccounts } from "./Pages/moviments/merchants/betweenAccounts";
import { MerchantManual } from "./Pages/moviments/merchants/manual";
import { MerchantPreManual } from "./Pages/moviments/merchants/preOperations";
import { ImportPreOperations } from "./Pages/moviments/merchants/preOperations/import";
import { PreManualUploads } from "./Pages/moviments/merchants/preOperations/uploads";
import { TransferBetweenAccountsReports } from "./Pages/moviments/merchants/reports/betweenAccounts";
import { MerchantManualReports } from "./Pages/moviments/merchants/reports/manual";
import { MerchantPreManualReports } from "./Pages/moviments/merchants/reports/preOperations";
import { TransferBetweenMerchants } from "./Pages/moviments/merchantsTransfers";
import { OrganizationTransfersBetweenAccounts } from "./Pages/moviments/organization/betweenAccounts";
import { OrgonizationManual } from "./Pages/moviments/organization/manual";
import { OrganizationTransferBetweenAccountsReports } from "./Pages/moviments/organization/reports/betweenAccounts";
import { OrganizationManualReports } from "./Pages/moviments/organization/reports/manual";
import { Aggregators } from "./Pages/register/aggregator/aggregators";
import { UpdateAggregator } from "./Pages/register/aggregator/aggregators/updateAggregator";
import { AggregatorDetails } from "./Pages/register/aggregator/aggregators/viewAggregator";
import { AggregatorBlacklist } from "./Pages/register/aggregator/blacklist";
import { AggregatorsReports } from "./Pages/register/aggregator/reports/aggregators";
import { AggregatorsBlacklistReports } from "./Pages/register/aggregator/reports/blacklist";
import { SelfExclusionReports } from "./Pages/register/aggregator/reports/selfExclusion";
import { AggregatorUsersReports } from "./Pages/register/aggregator/reports/users";
import { AggregatorSelfExclusion } from "./Pages/register/aggregator/selfExclusion";
import { AggregatorUsers } from "./Pages/register/aggregator/users";
import { MerchantBlacklist } from "./Pages/register/merchant/blacklist";
import { ImportBlacklist } from "./Pages/register/merchant/blacklist/importBlacklist";
import { MerchantBlacklistReasons } from "./Pages/register/merchant/blacklist/reasons";
import { MerchantsBlacklistUploads } from "./Pages/register/merchant/blacklist/uploads";
import { MerchantFeePlans } from "./Pages/register/merchant/feeplans";
import { MerchantManualEntryCategory } from "./Pages/register/merchant/manualEntryCategory";
import { MerchantView } from "./Pages/register/merchant/merchants";
import { MerchantConfigs } from "./Pages/register/merchant/merchants/components/merchantConfigs";
import { UpdateMerchant } from "./Pages/register/merchant/merchants/updateMerchant";
import { MerchantDetails } from "./Pages/register/merchant/merchants/viewMerchant";
import { MerchantBlacklistReports } from "./Pages/register/merchant/reports/blacklist";
import { MerchantReports } from "./Pages/register/merchant/reports/merchant";
import { MerchantUserReports } from "./Pages/register/merchant/reports/user";
import { MerchantUser } from "./Pages/register/merchant/users";
import { Operators } from "./Pages/register/operator/operators";
import { UpdateOperator } from "./Pages/register/operator/operators/updateOperator";
import { OperatorDetails } from "./Pages/register/operator/operators/viewOperator";
import { OperatorReports } from "./Pages/register/operator/reports/operator";
import { OperatorUsersReports } from "./Pages/register/operator/reports/users";
import { OperatorUsers } from "./Pages/register/operator/users";
import { BankMaintenence } from "./Pages/register/organization/bankMaintenance";
import { OrganizationCategories } from "./Pages/register/organization/categories";
import { GeneralConfigs } from "./Pages/register/organization/generalConfigs";
import { OrganizationCategoriesReports } from "./Pages/register/organization/reports/categories";
import { OrganizationUserReports } from "./Pages/register/organization/reports/user";
import { OrganizationUser } from "./Pages/register/organization/users";
import { Partners } from "./Pages/register/partner/partners";
import { UpdatePartner } from "./Pages/register/partner/partners/updatePartner";
import { PartnerDetails } from "./Pages/register/partner/partners/viewPartner";
import { PartnerReports } from "./Pages/register/partner/reports/partner";
import { PartnerUsersReports } from "./Pages/register/partner/reports/users";
import { PartnerUsers } from "./Pages/register/partner/users";
import { PermissionsGroups } from "./Pages/register/permissionsGroups";
import { Persons } from "./Pages/register/persons";
import { PersonBlacklistReasons } from "./Pages/register/persons/blacklist/blacklistReasons";
import { ImportPersonsBlacklist } from "./Pages/register/persons/blacklist/importBlacklist";
import { PersonBlacklistUploads } from "./Pages/register/persons/blacklist/uploads";
import { CostumerBanks } from "./Pages/register/persons/customerBankList";
import { PersonDetails } from "./Pages/register/persons/personDetails";
import { PersonUpdate } from "./Pages/register/persons/personUpdate";
import { CustomerBanksReports } from "./Pages/register/persons/reports/customerBanks";
import { PersonsReports } from "./Pages/register/persons/reports/persons";
import { AuthLogs } from "./Pages/support/apiLogs/AuthLogs";
import { DepositsErrors } from "./Pages/support/apiLogs/DepositsErrors";
import { WithdrawalsErrors } from "./Pages/support/apiLogs/WithdrawalsErrors";
import { BankBlacklist } from "./Pages/support/blacklists/bankBlacklist";
import { InvalidPixKeyBlacklist } from "./Pages/support/blacklists/invalidPixKey";
import { BankBlackistReports } from "./Pages/support/blacklists/reports/bankBlacklist";
import { ThirdPartKeyBlacklist } from "./Pages/support/blacklists/thirdPartKey";
import { ImportContastationDeposit } from "./Pages/support/contastation/importCSV";
import { ContestationUploads } from "./Pages/support/contastation/uploads";
import { CurrentAccountPage } from "./Pages/register/organization/currentAccounts";
import { Permission } from "./permission";
import { Redirect } from "./redirect";
import { SerproAssertiva } from "./Pages/consult/persons/serproAssertiva";
export const PrivateRoutes = () => {
  const { responseValidate } = useValidate();

  return (
    <Routes>
      <Route path="/login" element={<Redirect />} />
      <Route path="*" element={<NotFount />} />

      <Route path="/">
        <Route index element={<Redirect />} />
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Consultas */}
        <Route path="consult">
          {/* Consultas de Organização */}
          <Route path="consult_organization">
            <Route
              path={"organization_bank_statement"}
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.paybrokers?.extract
                      ?.menu
                  }
                >
                  <OrganizationBankStatement />
                </Permission>
              }
            />
            <Route
              path="organization_balance"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.paybrokers?.balance
                      ?.menu
                  }
                >
                  <OrganizationBalance />
                </Permission>
              }
            />
            <Route
              path="organization_bank_balance"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.paybrokers
                      ?.bank_balance?.menu
                  }
                >
                  <OrganizationBankBalance />
                </Permission>
              }
            />
            <Route
              path="organization_history"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.paybrokers
                      ?.bank_history?.menu
                  }
                >
                  <OrganizationHistory />
                </Permission>
              }
            />
            <Route
              path="consult_organization_reports"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.paybrokers?.balance
                      ?.report_paybrokers_balance_export_csv
                  }
                >
                  <ConsultOrganizationReports />
                </Permission>
              }
            />
          </Route>
          {/*Consultas de Empresa */}
          <Route path="consult_merchant">
            <Route
              path="merchant_bank_statement"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.merchant?.extract
                      ?.menu
                  }
                >
                  <MerchantBankStatement />
                </Permission>
              }
            />
            <Route
              path="merchant_balance"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.merchant?.balance
                      ?.menu
                  }
                >
                  <MerchantBalance />
                </Permission>
              }
            />
            <Route
              path="merchant_history"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.merchant
                      ?.balance_history?.menu
                  }
                >
                  <MerchantHistory />
                </Permission>
              }
            />
            <Route
              path="consult_merchant_reports"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.merchant?.extract
                      ?.report_merchant_extract_export_csv
                  }
                >
                  <ConsultMerchantReports />
                </Permission>
              }
            />
          </Route>
          {/*Consultas de Depósitos */}
          <Route path="deposit">
            <Route
              path="generated_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.deposit
                      ?.generated_deposit?.menu
                  }
                >
                  <GeneratedDeposits />
                </Permission>
              }
            />
            <Route
              path="paid_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.deposit?.paid_deposit
                      ?.menu
                  }
                >
                  <PaidDeposits />
                </Permission>
              }
            />
            <Route
              path="undelivered_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.deposit
                      ?.undelivered_deposit?.menu
                  }
                >
                  <UndeliveredDeposits />
                </Permission>
              }
            />
            <Route
              path="receipts"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.deposit
                      ?.deposit_receipt?.menu
                  }
                >
                  <DepositsReceipts />
                </Permission>
              }
            />

            <Route path="deposits_reports">
              <Route
                path="generated_deposits_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.deposit
                        ?.generated_deposit
                        ?.report_deposit_generated_deposit_export_csv
                    }
                  >
                    <GeneratedDepositsReports />
                  </Permission>
                }
              />
              <Route
                path="paid_deposits_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.deposit
                        ?.paid_deposit.report_deposit_paid_deposit_export_csv
                    }
                  >
                    <PaidDepositsReports />
                  </Permission>
                }
              />
              <Route
                path="webhooks_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.deposit
                        ?.generated_deposit
                        ?.report_deposit_generated_deposit_resend_notification
                    }
                  >
                    <DepositsWebhooks />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/*Consultas de Saques */}
          <Route path="withdrawals">
            <Route
              path="generated_withdrawals"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.withdraw
                      ?.generated_withdraw?.menu
                  }
                >
                  <GeneratedWithdrawals />
                </Permission>
              }
            />
            <Route
              path="paid_withdrawals"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.withdraw
                      ?.paid_withdraw?.menu
                  }
                >
                  <PaidWithdrawals />
                </Permission>
              }
            />
            <Route
              path="undelivered_withdrawals"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.withdraw
                      ?.undelivered_withdraw?.menu
                  }
                >
                  <UndeliveredWithdrawals />
                </Permission>
              }
            />

            <Route path="withdrawals_reports">
              <Route
                path="generated_withdrawals_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.withdraw
                        ?.generated_withdraw
                        ?.report_withdraw_generated_withdraw_export_csv
                    }
                  >
                    <GeneratedWithdrawalsReports />
                  </Permission>
                }
              />
              <Route
                path="paid_withdrawals_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.withdraw
                        ?.paid_withdraw
                        ?.report_withdraw_paid_withdraw_export_csv
                    }
                  >
                    <PaidWithdrawalsReports />
                  </Permission>
                }
              />
              <Route
                path="withdrawals_webhooks_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.withdraw
                        ?.generated_withdraw
                        ?.report_withdraw_generated_withdraw_resend_notification
                    }
                  >
                    <WithdrawWebhooks />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/*Consultas de Devoluções */}
          <Route path="refunds">
            <Route
              path="refund_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.chargeback
                      ?.deposit_chargeback?.menu
                  }
                >
                  <RefundDeposits />
                </Permission>
              }
            />
            <Route
              path="refund_withdrawals"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.chargeback
                      ?.withdraw_chargeback?.menu
                  }
                >
                  <RefundWithdrawals />
                </Permission>
              }
            />
            <Route
              path="refund_manual_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.chargeback
                      ?.manual_deposit_chargeback.menu
                  }
                >
                  <RefundDepositsManual />
                </Permission>
              }
            />

            <Route path="refund_reports">
              <Route
                path="refund_deposits_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.chargeback
                        ?.deposit_chargeback
                        ?.report_chargeback_deposit_chargeback_export_csv
                    }
                  >
                    <RefundDepositsReports />
                  </Permission>
                }
              />
              <Route
                path="refund_manual_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.chargeback
                        ?.manual_deposit_chargeback
                        ?.report_chargeback_manual_deposit_chargeback_export_csv
                    }
                  >
                    <RefundManualDepositsReports />
                  </Permission>
                }
              />
              <Route
                path="refund_withdrawals_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.chargeback
                        ?.withdraw_chargeback
                        ?.report_chargeback_withdraw_chargeback_export_csv
                    }
                  >
                    <RefundWithdrawalsReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/* Consultas de pessoas */}
          <Route path="consult_persons">
            <Route
              path="check_cpf"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.person?.check_cpf
                      ?.menu
                  }
                >
                  <CheckDocument />
                </Permission>
              }
            />
            <Route path="historic_cpf_merchant">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.menu
                    }
                  >
                    <HistoricCpfByMerchant />
                  </Permission>
                }
              />
              <Route
                path="details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.person?.menu
                    }
                  >
                    <HistoricCpfByMerchantDetails />
                  </Permission>
                }
              />
            </Route>
            <Route
              path="serpro_assertiva"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.report?.person?.check_cpf
                      ?.menu
                  }
                >
                  <SerproAssertiva />
                </Permission>
              }
            />

            <Route path="reports">
              <Route
                path="historic_cpf_merchant"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.person?.menu
                    }
                  >
                    <HistoricCpfByMerchantReports />
                  </Permission>
                }
              />
              <Route
                path="historic_cpf_merchant_details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.report?.person?.menu
                    }
                  >
                    <HistoricCpfByMerchantDetailsReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
        </Route>
        {/* cadastros */}
        <Route path="register">
          {/* cadastros de organização */}
          <Route path="organization">
            <Route
              path="users"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.paybrokers?.users
                      ?.menu
                  }
                >
                  <OrganizationUser />
                </Permission>
              }
            />
            <Route
              path="categories"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.paybrokers
                      ?.release_category?.menu
                  }
                >
                  <OrganizationCategories />
                </Permission>
              }
            />
            {/* Ajustar permissões*/}
             <Route
              path="current_accounts"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.paybrokers
                      ?.menu
                  }
                >
                  <CurrentAccountPage />
                </Permission>
              }
            />
              {/* Ajustar permissões*/}
            <Route
              path="bank_maintain"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.paybrokers
                      ?.banks_maintain?.menu
                  }
                >
                  <BankMaintenence />
                </Permission>
              }
            />
            <Route
              path="general_configs"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.paybrokers
                      ?.general_configs?.menu
                  }
                >
                  <GeneralConfigs />
                </Permission>
              }
            />
            <Route
              path="permissions_groups"
              element={
                <Permission permission={responseValidate?.type === 1}>
                  <PermissionsGroups />
                </Permission>
              }
            />
            <Route path="organization_reports">
              <Route
                path="organization_reports_users"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.paybrokers?.users
                        ?.paybrokers_user_export_csv
                    }
                  >
                    <OrganizationUserReports />
                  </Permission>
                }
              />
              <Route
                path="organization_reports_categories"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.paybrokers
                        ?.release_category
                        ?.paybrokers_release_category_export_csv
                    }
                  >
                    <OrganizationCategoriesReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/* cadastros de agregadores */}
          <Route path="aggregator">
            <Route path="aggregators">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.aggregator?.menu
                    }
                  >
                    <Aggregators />
                  </Permission>
                }
              />
              <Route
                path="update"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.aggregator?.aggregator_update
                    }
                  >
                    <UpdateAggregator />
                  </Permission>
                }
              />
              <Route
                path="details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.aggregator?.aggregator_list
                    }
                  >
                    <AggregatorDetails />
                  </Permission>
                }
              />
            </Route>

            <Route
              path="aggregator_users"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.aggregator?.users
                      ?.menu
                  }
                >
                  <AggregatorUsers />
                </Permission>
              }
            />
            <Route
              path="self_exclusion"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.aggregator
                      ?.self_exclusion?.menu
                  }
                >
                  <AggregatorSelfExclusion />
                </Permission>
              }
            />
            <Route path="aggregator_blacklist">
              <Route
                path="aggregator_blacklist_blacklist"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.blacklist?.menu
                    }
                  >
                    <AggregatorBlacklist />
                  </Permission>
                }
              />
              <Route path="aggregator_blacklist_reasons" />
            </Route>
            <Route path="aggregator_reports">
              <Route
                path="aggregator_aggregators_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.aggregator?.aggregator_export_csv
                    }
                  >
                    <AggregatorsReports />
                  </Permission>
                }
              />
              <Route
                path="aggregator_users_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator?.users
                        ?.aggregator_user_export_csv
                    }
                  >
                    <AggregatorUsersReports />
                  </Permission>
                }
              />
              <Route
                path="self_exclusion_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.self_exclusion?.aggregator_self_exclusion_export_csv
                    }
                  >
                    <SelfExclusionReports />
                  </Permission>
                }
              />
              <Route
                path="aggregator_blacklist_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.aggregator
                        ?.blacklist?.aggregator_blacklist_export_csv
                    }
                  >
                    <AggregatorsBlacklistReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/* cadastros de plataformas */}
          <Route path="partner">
            <Route path="partners">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.partner?.partner
                        ?.menu
                    }
                  >
                    <Partners />
                  </Permission>
                }
              />
              <Route
                path="details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.partner?.partner
                        ?.partner_list
                    }
                  >
                    <PartnerDetails />
                  </Permission>
                }
              />
              <Route
                path="update"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.partner?.partner
                        ?.partner_update
                    }
                  >
                    <UpdatePartner />
                  </Permission>
                }
              />
            </Route>
            <Route
              path="partner_users"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.partner?.users
                      ?.menu
                  }
                >
                  <PartnerUsers />
                </Permission>
              }
            />
            <Route path="partner_reports">
              <Route
                path="partner_partners_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.partner?.partner
                        ?.partner_export_csv
                    }
                  >
                    <PartnerReports />
                  </Permission>
                }
              />
              <Route
                path="partner_users_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.partner?.users
                        ?.partner_user_export_csv
                    }
                  >
                    <PartnerUsersReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/*cadastros de operadores */}
          <Route path="operator">
            <Route path="operators">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.operator
                        ?.operator?.menu
                    }
                  >
                    <Operators />
                  </Permission>
                }
              />
              <Route
                path="update"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.operator
                        ?.operator?.operator_update
                    }
                  >
                    <UpdateOperator />
                  </Permission>
                }
              />
              <Route
                path="details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.operator
                        ?.operator?.operator_list
                    }
                  >
                    <OperatorDetails />
                  </Permission>
                }
              />
            </Route>
            <Route
              path="operator_users"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.operator?.users
                      ?.menu
                  }
                >
                  <OperatorUsers />
                </Permission>
              }
            />
            <Route path="operator_reports">
              <Route
                path="operator_operators_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.operator
                        ?.operator?.operator_export_csv
                    }
                  >
                    <OperatorReports />
                  </Permission>
                }
              />
              <Route
                path="operator_users_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.operator?.users
                        ?.operator_user_export_csv
                    }
                  >
                    <OperatorUsersReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/* cadastros de empresas */}
          <Route path="merchant">
            <Route path="merchants">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.menu
                    }
                  >
                    <MerchantView />
                  </Permission>
                }
              />
              <Route
                path=":id"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_banks ||
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_credentials ||
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_fees ||
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_ips ||
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_merchant ||
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_config_paybrokers
                    }
                  >
                    <MerchantConfigs />
                  </Permission>
                }
              />
              <Route
                path="details"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_list
                    }
                  >
                    <MerchantDetails />
                  </Permission>
                }
              />
              <Route
                path="update"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_update
                    }
                  >
                    <UpdateMerchant />
                  </Permission>
                }
              />
            </Route>
            <Route
              path="merchant_users"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.merchant?.users
                      ?.menu
                  }
                >
                  <MerchantUser />
                </Permission>
              }
            />

            <Route path="merchant_blacklists">
              <Route
                path="merchant_blacklist"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.blacklist?.menu
                    }
                  >
                    <MerchantBlacklist />
                  </Permission>
                }
              />
              <Route
                path="merchant_blacklist_reasons"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.black_list_reason?.menu
                    }
                  >
                    <MerchantBlacklistReasons />
                  </Permission>
                }
              />
              <Route
                path="import_merchant_blacklist"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.blacklist?.merchant_blacklist_export_csv
                    }
                  >
                    <ImportBlacklist />
                  </Permission>
                }
              />
              <Route
                path="uploads_merchant_blacklist"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.blacklist?.merchant_blacklist_export_csv
                    }
                  >
                    <MerchantsBlacklistUploads />
                  </Permission>
                }
              />
            </Route>
            <Route
              path="fee_plans"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.merchant?.fee_plans
                      ?.menu
                  }
                >
                  <MerchantFeePlans />
                </Permission>
              }
            />
            <Route
              path="manual_entry_category"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.merchant
                      ?.release_category?.menu
                  }
                >
                  <MerchantManualEntryCategory />
                </Permission>
              }
            />
            <Route path="merchant_reports">
              <Route
                path="merchant_merchants_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.merchant?.merchant_export_csv
                    }
                  >
                    <MerchantReports />
                  </Permission>
                }
              />
              <Route
                path="merchant_users_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant?.users
                        ?.merchant_user_export_csv
                    }
                  >
                    <MerchantUserReports />
                  </Permission>
                }
              />
              <Route
                path="merchant_blacklist_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.merchant
                        ?.blacklist?.merchant_blacklist_export_csv
                    }
                  >
                    <MerchantBlacklistReports />
                  </Permission>
                }
              />
            </Route>
          </Route>

          {/* cadastros de pessos */}
          <Route path="person">
            <Route path="persons">
              <Route
                index
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.person
                        ?.menu
                    }
                  >
                    <Persons />
                  </Permission>
                }
              />
              <Route
                path=":cpf"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.person
                        ?.person_person_list
                    }
                  >
                    <PersonDetails />
                  </Permission>
                }
              />
              <Route path="update">
                <Route
                  path=":cpf"
                  element={
                    <Permission
                      permission={
                        responseValidate?.permissions?.register?.person?.person
                          ?.person_person_update
                      }
                    >
                      <PersonUpdate />
                    </Permission>
                  }
                />
              </Route>
            </Route>
            <Route
              path="person_accounts"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.register?.person
                      ?.client_banks?.menu
                  }
                >
                  <CostumerBanks />
                </Permission>
              }
            />
            <Route path="person_blacklist">
              <Route
                path="upload_person_blacklist"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.blacklist
                        ?.import_csv.person_blacklist_import_csv
                    }
                  >
                    <ImportPersonsBlacklist />
                  </Permission>
                }
              />
              <Route
                path="person_blacklist_uploads"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.blacklist
                        ?.import_csv.person_blacklist_import_csv
                    }
                  >
                    <PersonBlacklistUploads />
                  </Permission>
                }
              />
              <Route
                path="person_blacklist_reasons"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.blacklist
                        .reason.menu
                    }
                  >
                    <PersonBlacklistReasons />
                  </Permission>
                }
              />
            </Route>
            <Route path="person_reports">
              <Route
                path="person_persons_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person?.person
                        ?.person_person_export_csv
                    }
                  >
                    <PersonsReports />
                  </Permission>
                }
              />
              <Route
                path="client_bank_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.register?.person
                        ?.client_banks?.person_client_banks_export_csv
                    }
                  >
                    <CustomerBanksReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
        </Route>
        {/* movimentações */}
        <Route path="moviment">
          {/* movimentações de organização */}
          <Route path="organization_moviments">
            <Route
              path="organization_manual_moviments"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.transactions?.paybrokers
                      ?.manual_transactions?.menu
                  }
                >
                  <OrgonizationManual />
                </Permission>
              }
            />
            <Route path="organization_moviments_reports">
              <Route
                path="organization_manual_moviments_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.paybrokers
                        ?.manual_transactions
                        ?.paybrokers_manual_transactions_export_csv
                    }
                  >
                    <OrganizationManualReports />
                  </Permission>
                }
              />
              {/* TODO arrumar permissões */}
              <Route
                path="organization_transfer_between_accounts_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.paybrokers
                        ?.internal_transfers.menu
                    }
                  >
                    <OrganizationTransferBetweenAccountsReports />
                  </Permission>
                }
              />
            </Route>
            {/*TODO arrumar permissões */}
            <Route
              path="organization_transfer_between_accounts"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.transactions?.paybrokers
                      ?.internal_transfers?.menu
                  }
                >
                  <OrganizationTransfersBetweenAccounts />
                </Permission>
              }
            />
          </Route>
          {/* movimentções de empresa */}
          <Route path="merchant_moviments">
            <Route
              path="merchant_manual_moviments"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.transactions?.merchant
                      ?.manual_transactions?.menu
                  }
                >
                  <MerchantManual />
                </Permission>
              }
            />
            <Route path="merchant_pre_manual_moviment">
              <Route
                path="merchant_pre_manual_moviments"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.merchant_pre_manual?.menu
                    }
                  >
                    <MerchantPreManual />
                  </Permission>
                }
              />
              <Route
                path="merchant_pre_manual_moviments_import"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.merchant_pre_manual?.menu
                    }
                  >
                    <ImportPreOperations />
                  </Permission>
                }
              />
              <Route
                path="merchant_pre_manual_moviments_uploads"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.merchant_pre_manual?.menu
                    }
                  >
                    <PreManualUploads />
                  </Permission>
                }
              />
            </Route>

            <Route path="merchant_moviments_reports">
              <Route
                path="merchant_manual_moviments_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.manual_transactions
                        ?.merchant_manual_transactions_export_csv
                    }
                  >
                    <MerchantManualReports />
                  </Permission>
                }
              />
              {/*TODO arrumar permissões */}
              <Route
                path="merchant_between_accounts_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.internal_transfers
                        ?.merchant_internal_transfers_export_csv
                    }
                  >
                    <TransferBetweenAccountsReports />
                  </Permission>
                }
              />

              {/*TODO arrumar permissões */}
              <Route
                path="merchant_pre_manual_moviments_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.merchant
                        ?.internal_transfers
                        ?.merchant_internal_transfers_export_csv
                    }
                  >
                    <MerchantPreManualReports />
                  </Permission>
                }
              />
            </Route>
            {/*TODO arrumar permissões */}
            <Route
              path="between_accounts_transfers"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.transactions?.merchant
                      ?.internal_transfers?.menu
                  }
                >
                  <TransfersBetweenAccounts />
                </Permission>
              }
            />
          </Route>
          {/*TODO arrumar permissões */}
          <Route
            path="merchant_transfers"
            element={
              <Permission
                permission={responseValidate?.permissions?.transactions?.menu}
              >
                <TransferBetweenMerchants />
              </Permission>
            }
          />
          {/* movimentações de agregador */}
          <Route path="aggregator_moviments">
            {/*TODO arrumar permissões */}
            <Route
              path="aggregator_transfer_between_accounts"
              element={
                <Permission
                  permission={responseValidate?.permissions?.transactions?.menu}
                >
                  <AggregatorTransfersBetweenAccounts />
                </Permission>
              }
            />
            <Route path="aggregator_moviments_reports">
              {/*TODO arrumar permissões */}
              <Route
                path="aggregator_transfer_between_accounts_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.transactions?.menu
                    }
                  >
                    <AggregatorTransferBetweenAccountsReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
        </Route>
        {/* Suporte */}
        <Route path="support">
          {/* Logs de API */}
          <Route path="api_logs">
            <Route
              path="authentication_logs"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.logs?.auth_logs
                      ?.menu
                  }
                >
                  <AuthLogs />
                </Permission>
              }
            />
            <Route
              path="error_logs_deposits"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.logs
                      ?.deposit_error_logs?.menu
                  }
                >
                  <DepositsErrors />
                </Permission>
              }
            />
            <Route
              path="error_logs_withdrawals"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.logs
                      ?.withdraw_error_logs?.menu
                  }
                >
                  <WithdrawalsErrors />
                </Permission>
              }
            />
          </Route>
          {/* Blacklists */}
          <Route path="blacklists">
            <Route
              path="bank_institutions"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.blacklist?.banks
                      ?.menu
                  }
                >
                  <BankBlacklist />
                </Permission>
              }
            />
            <Route
              path="third_parties_pix_key"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.blacklist
                      ?.third_party_pix_keys?.menu
                  }
                >
                  <ThirdPartKeyBlacklist />
                </Permission>
              }
            />
            <Route
              path="invalid_pix_key"
              element={
                <Permission
                  permission={
                    responseValidate?.permissions?.support?.blacklist
                      ?.invalid_pix_keys?.menu
                  }
                >
                  <InvalidPixKeyBlacklist />
                </Permission>
              }
            />
            <Route path="blacklists_reports">
              <Route
                path="bank_institutions_reports"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.support?.blacklist?.banks
                        ?.support_blacklist_bank_export_csv
                    }
                  >
                    <BankBlackistReports />
                  </Permission>
                }
              />
            </Route>
          </Route>
          {/* Contastations */}
          <Route path="contestation">
            <Route path="deposit_contestation">
              <Route
                path="uploads"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.support?.contestation
                        ?.deposits?.menu
                    }
                  >
                    <ContestationUploads />
                  </Permission>
                }
              />
              <Route
                path="import_csv"
                element={
                  <Permission
                    permission={
                      responseValidate?.permissions?.support?.contestation
                        ?.deposits?.import_csv.menu
                    }
                  >
                    <ImportContastationDeposit />
                  </Permission>
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
