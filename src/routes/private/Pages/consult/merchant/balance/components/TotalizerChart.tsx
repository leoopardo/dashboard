import { MerchantBalanceData } from "@src/services/types/consult/merchant/balance";
import { defaultTheme } from "@src/styles/defaultTheme";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartValues {
  items?: MerchantBalanceData | null;
}

export function MerchantBalanceChart({ items }: PieChartValues) {
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
          items?.balance_to_transactions_total ??
            items?.balance_to_transactions,
          items?.balance_to_payment_total ?? items?.balance_to_payment,
          items?.balance_reserved_total ?? items?.balance_reserved,
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
