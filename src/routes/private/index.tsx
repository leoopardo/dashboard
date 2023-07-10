import { Routes, Route } from "react-router-dom";
import { NotFount } from "../public/Pages/404";
import { Redirect } from "./redirect";
import { GeneratedDeposits } from "./Pages/consult/deposits/generated";
import { PaidDeposits } from "./Pages/consult/deposits/paid";
import { UndeliveredDeposits } from "./Pages/consult/deposits/undelivered";
import { GeneratedWithdrawals } from "./Pages/consult/withdrawals/generated";
import { PaidWithdrawals } from "./Pages/consult/withdrawals/paid";
import { UndeliveredWithdrawals } from "./Pages/consult/withdrawals/undelivered";
import { RefundDeposits } from "./Pages/consult/refunds/deposits";
import { OrganizationUser } from "./Pages/register/organization/users";
import { MerchantUser } from "./Pages/register/merchant/users";
import { OrganizationCategories } from "./Pages/register/organization/categories";
import { BankMaintenence } from "./Pages/register/organization/bankMaintenance";
import { GeneralConfigs } from "./Pages/register/organization/generalConfigs";
import { PartnerUsers } from "./Pages/register/partner/users";
import { MerchantView } from "./Pages/register/merchant/merchants";
import { MerchantConfigs } from "./Pages/register/merchant/merchants/components/merchantConfigs";
import { Partners } from "./Pages/register/partner/partners";
import { Operators } from "./Pages/register/operator/operators";
import { OperatorUsers } from "./Pages/register/operator/users";
import { Aggregators } from "./Pages/register/aggregator/aggregators";
import { AggregatorUsers } from "./Pages/register/aggregator/users";
import { Persons } from "./Pages/register/persons";
import { PersonDetails } from "./Pages/register/persons/personDetails";
import { PersonUpdate } from "./Pages/register/persons/personUpdate";
import { PixKeyWhitelist } from "./Pages/register/persons/pixKeyWhitelist";
import { CostumerBanks } from "./Pages/register/persons/customerBankList";
import { OrganizationBankStatement } from "./Pages/consult/organization/bankStatement";
import { OrganizationBalance } from "./Pages/consult/organization/balance";
import { OrganizationHistory } from "./Pages/consult/organization/history";
import { MerchantBankStatement } from "./Pages/consult/merchant/bankStatement";
import { MerchantBalance } from "./Pages/consult/merchant/balance";
import { MerchantHistory } from "./Pages/consult/merchant/history";
import { OrgonizationManual } from "./Pages/moviments/organization/manual";
import { MerchantManual } from "./Pages/moviments/merchants/manual";
import { CheckDocument } from "./Pages/consult/persons/checkDocument";
import { DepositsErrors } from "./Pages/support/apiLogs/DepositsErrors";
import { WithdrawalsErrors } from "./Pages/support/apiLogs/WithdrawalsErrors";
import { BankBlacklist } from "./Pages/support/blacklists/bankBlacklist";
import { ThirdPartKeyBlacklist } from "./Pages/support/blacklists/thirdPartKey";
import { InvalidPixKeyBlacklist } from "./Pages/support/blacklists/invalidPixKey";
import { OrganizationUserReports } from "./Pages/register/organization/reports/user";
import { OrganizationCategoriesReports } from "./Pages/register/organization/reports/categories";
import { PartnerReports } from "./Pages/register/partner/reports/partner";
import { PartnerUsersReports } from "./Pages/register/partner/reports/users";
import { GeneratedDepositsReports } from "./Pages/consult/deposits/reports/generatedDeposits";
import { MerchantBlacklist } from "./Pages/register/merchant/blacklist";
import { MerchantReports } from "./Pages/register/merchant/reports/merchant";
import { MerchantUserReports } from "./Pages/register/merchant/reports/user";
import { PersonsReports } from "./Pages/register/persons/reports/persons";
import { CustomerBanksReports } from "./Pages/register/persons/reports/customerBanks";
import { PixKeyWhitelistReports } from "./Pages/register/persons/reports/PixKeyWhitelist";
import { OrganizationManualReports } from "./Pages/moviments/organization/reports";
import { MerchantManualReports } from "./Pages/moviments/merchants/reports";
import { ConsultOrganizationReports } from "./Pages/consult/organization/reports";
import { ConsultMerchantReports } from "./Pages/consult/merchant/reports";
import { PaidDepositsReports } from "./Pages/consult/deposits/reports/paidDeposits";
import { GeneratedWithdrawalsReports } from "./Pages/consult/withdrawals/reports/generatedWithdrawals";
import { PaidWithdrawalsReports } from "./Pages/consult/withdrawals/reports/paidWithdrawals";
import { RefundDepositsReports } from "./Pages/consult/refunds/reports/deposits";
import { RefundManualDepositsReports } from "./Pages/consult/refunds/reports/manualDeposits";
import { RefundWithdrawalsReports } from "./Pages/consult/refunds/reports/withdrawals";
import { BankBlackistReports } from "./Pages/support/blacklists/reports/bankBlacklist";

export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Redirect />} />
      <Route path="*" element={<NotFount />} />

      <Route path="/">
        <Route index element={<Redirect />} />
        <Route path="consult">
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
              path="organization_history"
              element={<OrganizationHistory />}
            />
            <Route
              path="consult_organization_reports"
              element={<ConsultOrganizationReports />}
            />
          </Route>

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
            </Route>
          </Route>

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
            </Route>
          </Route>

          <Route path="refunds">
            <Route path="refund_deposits" element={<RefundDeposits />} />

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

          <Route path="consult_persons">
            <Route path="check_cpf" element={<CheckDocument />} />
          </Route>
        </Route>

        <Route path="register">
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
          <Route path="aggregator">
            <Route path="aggregators" element={<Aggregators />} />
            <Route path="aggregator_users" element={<AggregatorUsers />} />
          </Route>
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
          <Route path="operator">
            <Route path="operators" element={<Operators />} />
            <Route path="operator_users" element={<OperatorUsers />} />
          </Route>
          <Route path="merchant">
            <Route path="merchants">
              <Route index element={<MerchantView />} />
              <Route path=":id" element={<MerchantConfigs />} />
            </Route>
            <Route path="merchant_users" element={<MerchantUser />} />

            <Route path="merchant_blacklist" element={<MerchantBlacklist />} />
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

        <Route path="moviment">
          <Route path="organization_moviments">
            <Route
              path="organization_manual_moviments"
              element={<OrgonizationManual />}
            />
            <Route
              path="organization_moviments_reports"
              element={<OrganizationManualReports />}
            />
          </Route>
          <Route path="merchant_moviments">
            <Route
              path="merchant_manual_moviments"
              element={<MerchantManual />}
            />
            <Route
              path="merchant_moviments_reports"
              element={<MerchantManualReports />}
            />
          </Route>
        </Route>
        <Route path="support">
          <Route path="api_logs">
            <Route path="error_logs_deposits" element={<DepositsErrors />} />
            <Route
              path="error_logs_withdrawals"
              element={<WithdrawalsErrors />}
            />
          </Route>
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
