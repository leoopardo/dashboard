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
import { Auth } from "./auth";
import { OrganizationCategories } from "./Pages/register/organization/categories";

export const PrivateRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Redirect />} />
      <Route path="*" element={<NotFount />} />

      <Route path="/" element={<Auth />}>
        <Route index element={<Redirect />} />
        <Route path="consult">
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
          </Route>
          <Route path="merchant">
            <Route path="merchant_users" element={<MerchantUser />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
