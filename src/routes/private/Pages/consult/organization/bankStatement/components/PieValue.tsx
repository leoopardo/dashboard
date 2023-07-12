import { OrganizationBankStatementTotalsResponse } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartValues {
  items: OrganizationBankStatementTotalsResponse;
}

export function PieChart({ items }: PieChartValues) {
  const { t } = useTranslation();
  const data = {
    labels: [t("table.value_in"), t("table.value_out")],
    datasets: [
      {
        label: "",
        data: [items.value_in, items.value_out],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
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
            align: "center",
            position: items.value_in || items.value_out ? "top" : "center",
          },
        },
      }}
    />
  );
}
