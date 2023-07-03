import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { OrganizationHistoryItem } from "@src/services/types/consult/organization/history";
import { useTranslation } from "react-i18next";
import { defaultTheme } from "@src/styles/defaultTheme";
import moment from "moment";
import { useMediaQuery } from "react-responsive";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OrganizationHistoryLineChartInterface {
  items?: OrganizationHistoryItem[];
}

export function OrganizationHistoryLineChart({
  items,
}: OrganizationHistoryLineChartInterface) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("table.balance_history"),
      },
    },
  };

  const data = {
    labels: items
      ?.map((item) =>
        moment(item.createdAt).subtract(3, "hours").format("YYYY/DD/MM")
      )
      .sort((a, b) => -1),
    datasets: [
      {
        label: t("table.balance_reserved"),
        data: items?.map((item) => item.balance_reserved).sort((a, b) => -1),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: t("table.balance_to_payment"),
        data: items?.map((item) => item.balance_to_payment).sort((a, b) => -1),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: t("table.balance_to_transactions"),
        data: items
          ?.map((item) => item.balance_to_transactions)
          .sort((a, b) => -1),
        borderColor: defaultTheme.colors.paid,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  return (
    <Line
      options={{
        ...options,
      }}
      data={data}
      width={1800}
      height={isMobile ? 2000 : 500}
    />
  );
}
