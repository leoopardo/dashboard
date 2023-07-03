import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { OrganizationBankStatementTotalsResponse } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { useTranslation } from "react-i18next";
import { defaultTheme } from "@src/styles/defaultTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartValues {
  items: OrganizationBankStatementTotalsResponse;
}

export function PieBankfee({ items }: PieChartValues) {
  const { t } = useTranslation();
  const data = {
    labels: [t("table.bank_fee_in"), t("table.bank_fee_out")],
    datasets: [
      {
        label: "",
        data: [items.bank_fee_in, items.bank_fee_out],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return <Doughnut data={data} />;
}
