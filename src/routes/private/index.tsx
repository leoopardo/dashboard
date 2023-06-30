import React, { FC, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import { Partners } from "./Pages/register/partner/partners";
import { Operators } from "./Pages/register/operator/operators";
import { OperatorUsers } from "./Pages/register/operator/users";
import { Aggregators } from "./Pages/register/aggregator/aggregators";
import { AggregatorUsers } from "./Pages/register/aggregator/users";
import { Persons } from "./Pages/register/persons";
import { PersonDetails } from "./Pages/register/persons/personDetails";
import { PersonUpdate } from "./Pages/register/persons/personUpdate";
import { PixKeyWhitelist } from "./Pages/register/persons/pixKeyWhitelist";
import { CostumerBanks } from "./Pages/register/persons/costumerBankList";
import { OrganizationBankStatement } from "./Pages/consult/organization/bankStatement";

export const PrivateRoutes = () => {
  const navigate = useNavigate();

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
          </Route>
          <Route path="deposit">
            <Route path="generated_deposits" element={<GeneratedDeposits />} />
            <Route path="paid_deposits" element={<PaidDeposits />} />
            <Route
              path="undelivered_deposits"
              element={<UndeliveredDeposits />}
            />
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
          </Route>
          <Route path="refunds">
            <Route path="refund_deposits" element={<RefundDeposits />} />
          </Route>
        </Route>

        <Route path="register">
          <Route path="organization">
            <Route path="users" element={<OrganizationUser />} />
            <Route path="categories" element={<OrganizationCategories />} />
            <Route path="bank_maintain" element={<BankMaintenence />} />
            <Route path="general_configs" element={<GeneralConfigs />} />
          </Route>
          <Route path="aggregator">
            <Route path="aggregators" element={<Aggregators />} />
            <Route path="aggregator_users" element={<AggregatorUsers />} />
          </Route>
          <Route path="partner">
            <Route path="partners" element={<Partners />} />
            <Route path="partner_users" element={<PartnerUsers />} />
          </Route>
          <Route path="operator">
            <Route path="operators" element={<Operators />} />
            <Route path="operator_users" element={<OperatorUsers />} />
          </Route>
          <Route path="merchant">
            <Route path="merchants" element={<MerchantView />} />
            <Route path="merchant_users" element={<MerchantUser />} />
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
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
