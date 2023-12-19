import { MerchantHourlyItem } from "@src/services/types/consult/merchant/bankStatement";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
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

export function MerchantHourlyLineChart({
  items,
}: OrganizationHistoryLineChartInterface) {
  const { t } = useTranslation();
  return (
    <ReactECharts
      option={{
        color: [defaultTheme.colors.chartGreen, defaultTheme.colors.chartRed],
        title: {
          text: t("messages.value_chart_area"),
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
          data: [t("table.value_in"), t("table.value_out")],
          textStyle: {
            color: "#a0a0a0",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
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
            axisLabel: {
              formatter: (value: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value ?? 0),
            },
          },
        ],
        series: [
          {
            name: t("table.value_in"),
            type: "line",
            smooth: true,
            data: items?.map((item) => item.value_in),
            tooltip: {
              valueFormatter: (value: number) =>
              moneyFormatter(value ?? 0),
            },
          },
          {
            name: t("table.value_out"),
            type: "line",
            smooth: true,
            data: items?.map((item) => item.value_out),
            tooltip: {
              valueFormatter: (value: number) =>
              moneyFormatter(value ?? 0),
            },
          },
        ],
      }}
      opts={{ renderer: "svg" }}
      lazyUpdate
    />
  );
}
