import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { OrganizationBalance } from "@src/services/types/consult/organization/balance/balnce.interface";
import { defaultTheme } from "@src/styles/defaultTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartValues {
  items: OrganizationBalance;
}

export function OrganizationBalanceChart({ items }: PieChartValues) {
  const { t } = useTranslation();
  const data = {
    labels: [
      t("table.balance_to_transactions"),
      t("table.balance_to_payment"),
      t("table.balance_reserved"),
      t("table.balance_total"),
    ],
    datasets: [
      {
        label: "",
        data: [
          items.balance_to_transactions,
          items.balance_to_payment,
          items.balance_reserved,
          items.balance_total,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",

          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "#006086",
          defaultTheme.colors.warnning,
          defaultTheme.colors.error,
          defaultTheme.colors.paid,
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
