import { Route, Routes } from "react-router-dom";
import { NotFount } from "../public/Pages/404";
import { GeneratedDeposits } from "./Pages/consult/deposits/generated";
import { PaidDeposits } from "./Pages/consult/deposits/paid";
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
import { TransferBetweenAccountsReports } from "./Pages/moviments/merchants/reports/betweenAccounts";
import { MerchantManualReports } from "./Pages/moviments/merchants/reports/manual";
import { OrganizationTransfersBetweenAccounts } from "./Pages/moviments/organization/betweenAccounts";
import { OrgonizationManual } from "./Pages/moviments/organization/manual";
import { OrganizationTransferBetweenAccountsReports } from "./Pages/moviments/organization/reports/betweenAccounts";
import { OrganizationManualReports } from "./Pages/moviments/organization/reports/manual";
import { Aggregators } from "./Pages/register/aggregator/aggregators";
import { AggregatorBlacklist } from "./Pages/register/aggregator/blacklist";
import { AggregatorsReports } from "./Pages/register/aggregator/reports/aggregators";
import { SelfExclusionReports } from "./Pages/register/aggregator/reports/selfExclusion";
import { AggregatorUsersReports } from "./Pages/register/aggregator/reports/users";
import { AggregatorSelfExclusion } from "./Pages/register/aggregator/selfExclusion";
import { AggregatorUsers } from "./Pages/register/aggregator/users";
import { MerchantBlacklist } from "./Pages/register/merchant/blacklist";
import { ImportBlacklist } from "./Pages/register/merchant/blacklist/importBlacklist";
import { MerchantBlacklistReasons } from "./Pages/register/merchant/blacklist/reasons";
import { MerchantFeePlans } from "./Pages/register/merchant/feeplans";
import { MerchantManualEntryCategory } from "./Pages/register/merchant/manualEntryCategory";
import { MerchantView } from "./Pages/register/merchant/merchants";
import { MerchantConfigs } from "./Pages/register/merchant/merchants/components/merchantConfigs";
import { MerchantReports } from "./Pages/register/merchant/reports/merchant";
import { MerchantUserReports } from "./Pages/register/merchant/reports/user";
import { MerchantUser } from "./Pages/register/merchant/users";
import { Operators } from "./Pages/register/operator/operators";
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
import { PartnerReports } from "./Pages/register/partner/reports/partner";
import { PartnerUsersReports } from "./Pages/register/partner/reports/users";
import { PartnerUsers } from "./Pages/register/partner/users";
import { Persons } from "./Pages/register/persons";
import { PersonBlacklistReasons } from "./Pages/register/persons/blacklist/blacklistReasons";
import { ImportPersonsBlacklist } from "./Pages/register/persons/blacklist/importBlacklist";
import { PersonBlacklistUploads } from "./Pages/register/persons/blacklist/uploads";
import { CostumerBanks } from "./Pages/register/persons/customerBankList";
import { PersonDetails } from "./Pages/register/persons/personDetails";
import { PersonUpdate } from "./Pages/register/persons/personUpdate";
import { PixKeyWhitelist } from "./Pages/register/persons/pixKeyWhitelist";
import { PixKeyWhitelistReports } from "./Pages/register/persons/reports/PixKeyWhitelist";
import { CustomerBanksReports } from "./Pages/register/persons/reports/customerBanks";
import { PersonsReports } from "./Pages/register/persons/reports/persons";
import { AuthLogs } from "./Pages/support/apiLogs/AuthLogs";
import { DepositsErrors } from "./Pages/support/apiLogs/DepositsErrors";
import { WithdrawalsErrors } from "./Pages/support/apiLogs/WithdrawalsErrors";
import { BankBlacklist } from "./Pages/support/blacklists/bankBlacklist";
import { InvalidPixKeyBlacklist } from "./Pages/support/blacklists/invalidPixKey";
import { BankBlackistReports } from "./Pages/support/blacklists/reports/bankBlacklist";
import { ThirdPartKeyBlacklist } from "./Pages/support/blacklists/thirdPartKey";
import { TransferBetweenMerchants } from "./Pages/moviments/merchantsTransfers";
import { Redirect } from "./redirect";

export const PrivateRoutes = () => {
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
              path="organization_bank_statement"
              element={<OrganizationBankStatement />}
            />
            <Route
              path="organization_balance"
              element={<OrganizationBalance />}
            />
            <Route
              path="organization_bank_balance"
              element={<OrganizationBankBalance />}
            />
            <Route
              path="organization_history"
              element={<OrganizationHistory />}
            />
            <Route
              path="consult_organization_reports"
              element={<ConsultOrganizationReports />}
            />
          </Route>
          {/*Consultas de Empresa */}
          <Route path="consult_merchant">
            <Route
              path="merchant_bank_statement"
              element={<MerchantBankStatement />}
            />
            <Route path="merchant_balance" element={<MerchantBalance />} />
            <Route path="merchant_history" element={<MerchantHistory />} />
            <Route
              path="consult_merchant_reports"
              element={<ConsultMerchantReports />}
            />
          </Route>
          {/*Consultas de Depósitos */}
          <Route path="deposit">
            <Route path="generated_deposits" element={<GeneratedDeposits />} />
            <Route path="paid_deposits" element={<PaidDeposits />} />
            <Route
              path="undelivered_deposits"
              element={<UndeliveredDeposits />}
            />

            <Route path="deposits_reports">
              <Route
                path="generated_deposits_reports"
                element={<GeneratedDepositsReports />}
              />
              <Route
                path="paid_deposits_reports"
                element={<PaidDepositsReports />}
              />
              <Route path="webhooks_reports" element={<DepositsWebhooks />} />
            </Route>
          </Route>
          {/*Consultas de Saques */}
          <Route path="withdrawals">
            <Route
              path="generated_withdrawals"
              element={<GeneratedWithdrawals />}
            />
            <Route path="paid_withdrawals" element={<PaidWithdrawals />} />
            <Route
              path="undelivered_withdrawals"
              element={<UndeliveredWithdrawals />}
            />

            <Route path="withdrawals_reports">
              <Route
                path="generated_withdrawals_reports"
                element={<GeneratedWithdrawalsReports />}
              />
              <Route
                path="paid_withdrawals_reports"
                element={<PaidWithdrawalsReports />}
              />
                 <Route
                path="withdrawals_webhooks_reports"
                element={<WithdrawWebhooks />}
              />
            </Route>
          </Route>
          {/*Consultas de Devoluções */}
          <Route path="refunds">
            <Route path="refund_deposits" element={<RefundDeposits />} />
            <Route path="withdrawals" element={<RefundWithdrawals />} />
            <Route
              path="refund_manual_deposits"
              element={<RefundDepositsManual />}
            />

            <Route path="refund_reports">
              <Route
                path="refund_deposits_reports"
                element={<RefundDepositsReports />}
              />
              <Route
                path="refund_manual_reports"
                element={<RefundManualDepositsReports />}
              />
              <Route
                path="refund_withdrawals_reports"
                element={<RefundWithdrawalsReports />}
              />
            </Route>
          </Route>
          {/* checar cpf */}
          <Route path="consult_persons">
            <Route path="check_cpf" element={<CheckDocument />} />
          </Route>
        </Route>
        {/* cadastros */}
        <Route path="register">
          {/* cadastros de organização */}
          <Route path="organization">
            <Route path="users" element={<OrganizationUser />} />
            <Route path="categories" element={<OrganizationCategories />} />
            <Route path="bank_maintain" element={<BankMaintenence />} />
            <Route path="general_configs" element={<GeneralConfigs />} />
            <Route path="organization_reports">
              <Route
                path="organization_reports_users"
                element={<OrganizationUserReports />}
              />
              <Route
                path="organization_reports_categories"
                element={<OrganizationCategoriesReports />}
              />
            </Route>
          </Route>
          {/* cadastros de agregadores */}
          <Route path="aggregator">
            <Route path="aggregators" element={<Aggregators />} />
            <Route path="aggregator_users" element={<AggregatorUsers />} />
            <Route
              path="self_exclusion"
              element={<AggregatorSelfExclusion />}
            />
            <Route path="aggregator_blacklist">
              <Route
                path="aggregator_blacklist_blacklist"
                element={<AggregatorBlacklist />}
              />
              <Route path="aggregator_blacklist_reasons" />
            </Route>
            <Route path="aggregator_reports">
              <Route
                path="aggregator_aggregators_reports"
                element={<AggregatorsReports />}
              />
              <Route
                path="aggregator_users_reports"
                element={<AggregatorUsersReports />}
              />{" "}
              <Route
                path="self_exclusion_reports"
                element={<SelfExclusionReports />}
              />
            </Route>
          </Route>
          {/* cadastros de plataformas */}
          <Route path="partner">
            <Route path="partners" element={<Partners />} />
            <Route path="partner_users" element={<PartnerUsers />} />
            <Route path="partner_reports">
              <Route
                path="partner_partners_reports"
                element={<PartnerReports />}
              />
              <Route
                path="partner_users_reports"
                element={<PartnerUsersReports />}
              />
            </Route>
          </Route>
          {/*cadastros de operadores */}
          <Route path="operator">
            <Route path="operators" element={<Operators />} />
            <Route path="operator_users" element={<OperatorUsers />} />
            <Route path="operator_reports">
              <Route
                path="operator_operators_reports"
                element={<OperatorReports />}
              />
              <Route
                path="operator_users_reports"
                element={<OperatorUsersReports />}
              />
            </Route>
          </Route>
          {/* cadastros de empresas */}
          <Route path="merchant">
            <Route path="merchants">
              <Route index element={<MerchantView />} />
              <Route path=":id" element={<MerchantConfigs />} />
            </Route>
            <Route path="merchant_users" element={<MerchantUser />} />

            <Route path="merchant_blacklists">
              <Route
                path="merchant_blacklist"
                element={<MerchantBlacklist />}
              />
              <Route
                path="merchant_blacklist_reasons"
                element={<MerchantBlacklistReasons />}
              />
              <Route
                path="import_merchant_blacklist"
                element={<ImportBlacklist />}
              />
            </Route>
            <Route path="fee_plans" element={<MerchantFeePlans />} />
            <Route
              path="manual_entry_category"
              element={<MerchantManualEntryCategory />}
            />
            <Route path="merchant_reports">
              <Route
                path="merchant_merchants_reports"
                element={<MerchantReports />}
              />
              <Route
                path="merchant_users_reports"
                element={<MerchantUserReports />}
              />
            </Route>
          </Route>

          {/* cadastros de pessos */}
          <Route path="person">
            <Route path="persons">
              <Route index element={<Persons />} />
              <Route path=":cpf" element={<PersonDetails />} />
              <Route path="update">
                <Route path=":cpf" element={<PersonUpdate />} />{" "}
              </Route>
            </Route>
            <Route path="whitelist" element={<PixKeyWhitelist />} />
            <Route path="person_accounts" element={<CostumerBanks />} />
            <Route path="person_blacklist">
              <Route
                path="upload_person_blacklist"
                element={<ImportPersonsBlacklist />}
              />{" "}
              <Route
                path="person_blacklist_uploads"
                element={<PersonBlacklistUploads />}
              />
              <Route
                path="person_blacklist_reasons"
                element={<PersonBlacklistReasons />}
              />
            </Route>
            <Route path="person_reports">
              <Route
                path="person_persons_reports"
                element={<PersonsReports />}
              />
              <Route
                path="client_bank_reports"
                element={<CustomerBanksReports />}
              />
              <Route
                path="pix_whitelist_reports"
                element={<PixKeyWhitelistReports />}
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
              element={<OrgonizationManual />}
            />
            <Route path="organization_moviments_reports">
              <Route
                path="organization_manual_moviments_reports"
                element={<OrganizationManualReports />}
              />
              <Route
                path="organization_transfer_between_accounts_reports"
                element={<OrganizationTransferBetweenAccountsReports />}
              />
            </Route>
            <Route
              path="organization_transfer_between_accounts"
              element={<OrganizationTransfersBetweenAccounts />}
            />
          </Route>
          {/* movimentções de empresa */}
          <Route path="merchant_moviments">
            <Route
              path="merchant_manual_moviments"
              element={<MerchantManual />}
            />
            <Route path="merchant_moviments_reports">
              <Route
                path="merchant_manual_moviments_reports"
                element={<MerchantManualReports />}
              />
              <Route
                path="merchant_between_accounts_reports"
                element={<TransferBetweenAccountsReports />}
              />
            </Route>
            <Route
              path="between_accounts_transfers"
              element={<TransfersBetweenAccounts />}
            />
          </Route>
          <Route path="merchant_transfers"  element={<TransferBetweenMerchants />} />
          {/* movimentações de agregador */}
          <Route path="aggregator_moviments">
            <Route
              path="aggregator_transfer_between_accounts"
              element={<AggregatorTransfersBetweenAccounts />}
            />
            <Route path="aggregator_moviments_reports">
              <Route
                path="aggregator_transfer_between_accounts_reports"
                element={<AggregatorTransferBetweenAccountsReports />}
              />
            </Route>
          </Route>

        </Route>
        {/* Suporte */}
        <Route path="support">
          {/* Logs de API */}
          <Route path="api_logs">
            <Route path="authentication_logs" element={<AuthLogs />} />
            <Route path="error_logs_deposits" element={<DepositsErrors />} />
            <Route
              path="error_logs_withdrawals"
              element={<WithdrawalsErrors />}
            />
          </Route>
          {/* Blacklists */}
          <Route path="blacklists">
            <Route path="bank_institutions" element={<BankBlacklist />} />
            <Route
              path="third_parties_pix_key"
              element={<ThirdPartKeyBlacklist />}
            />
            <Route
              path="invalid_pix_key"
              element={<InvalidPixKeyBlacklist />}
            />
            <Route path="blacklists_reports">
              <Route
                path="bank_institutions_reports"
                element={<BankBlackistReports />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
