import { MerchantHourlyItem } from "@src/services/types/consult/merchant/bankStatement";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
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
  items?: MerchantHourlyItem[] | null;
}

export function MerchantNumberLineChart({
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
      },
    },
  };

  const data = {
    labels: items?.map((item) => moment(item.date).format("DD/MM HH:00")),
    datasets: [
      {
        label: t("table.number_out"),
        data: items?.map((item) => item.number_out),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: t("table.number_in"),
        data: items?.map((item) => item.number_in),
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
      style={{marginTop: -40}}
    />
  );
}
