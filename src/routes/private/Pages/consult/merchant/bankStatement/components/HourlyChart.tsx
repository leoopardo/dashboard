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
import * as echarts from "echarts";
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
        color: [defaultTheme.colors.chartGreen,  defaultTheme.colors.chartRed],
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
          data: [t("table.value_in"), t("table.value_out")], textStyle: {
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
            name: t("table.value_in"),
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: defaultTheme.colors.chartGreen,
                },
                {
                  offset: 1,
                  color: defaultTheme.colors.chartBlue,
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: items?.map((item) => item.value_in),
          },
          {
            name: t("table.value_out"),
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: defaultTheme.colors.chartRed,
                },
                {
                  offset: 1,
                  color: defaultTheme.colors.chartYellow,
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: items?.map((item) => item.value_out),
          },
        ],
      }}
      opts={{ renderer: "svg" }}
      lazyUpdate
    />
  );
}
