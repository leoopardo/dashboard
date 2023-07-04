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
import { useTranslation } from "react-i18next";
import { defaultTheme } from "@src/styles/defaultTheme";
import { useMediaQuery } from "react-responsive";
import { MerchantHistoryItem } from "@src/services/types/consult/merchant/history";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MerchantHistoryLineChartInterface {
  items?: MerchantHistoryItem[];
}

export function MerchantHistoryLineChart({
  items,
}: MerchantHistoryLineChartInterface) {
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
      ?.map((item) => new Date(item?.createdAt ?? "").toLocaleDateString())
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
