import React, { FC, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Home } from "./Pages/home";
import { NotFount } from "../public/Pages/404";
import { Redirect } from "./redirect";
import { GeneratedDeposits } from "./Pages/consult/deposits/generated";
import { PaidDeposits } from "./Pages/consult/deposits/paid";
import { UndeliveredDeposits } from "./Pages/consult/deposits/undelivered";
import { GeneratedWithdrawals } from "./Pages/consult/withdrawals/generated";
import { PaidWithdrawals } from "./Pages/consult/withdrawals/paid";
import { UndeliveredWithdrawals } from "./Pages/consult/withdrawals/undelivered";
import { RefundDeposits } from "./Pages/consult/refunds/deposits";

export const PrivateRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Redirect />} />
      <Route path="home" element={<Home />} />
      <Route path="*" element={<NotFount />} />

      <Route path="/">
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
      </Route>
    </Routes>
  );
};
