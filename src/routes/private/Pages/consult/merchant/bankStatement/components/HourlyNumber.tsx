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
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { useTranslation } from "react-i18next";

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
  return (
    <ReactECharts
      option={{
        color: [defaultTheme.colors.chartGreen, defaultTheme.colors.chartRed],
        title: {
          text: t("messages.operations_number_chart_area"),
          textStyle: {
            color: "#a0a0a0",
          },
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: [t("table.number_in"), t("table.number_out")],
          textStyle: {
            color: "#a0a0a0",
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: items?.map((item) => moment(item.date).format("DD/MM HH:00")),
          },
        ],
        yAxis: [
          {
            type: "value",
            
          },
        ],
        series: [
          {
            name: t("table.number_in"),
            type: "line",
            smooth: true,

            data: items?.map((item) => item.number_in),
          },
          {
            name: t("table.number_out"),
            type: "line",
            smooth: true,

            data: items?.map((item) => item.number_out),
          },
        ],
      }}
      opts={{ renderer: "svg" }}
      lazyUpdate
    />
  );
}
