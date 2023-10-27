import { MerchantHourlyItem } from "@src/services/types/consult/merchant/bankStatement";
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

export function MerchantNumberLineChart({
  items,
}: OrganizationHistoryLineChartInterface) {
  const { t } = useTranslation();
  return (
    <ReactECharts
      option={{
        color: ["#80FFA5", "#FF0087"],
        title: {
          text: t("messages.operations_number_chart_area"),
          textStyle: {
            color: "#a0a0a0",
          },
          show: false
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
          data: [t("table.number_in"), t("table.number_out")], textStyle: {
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
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: items?.map((item) => item.number_in),
          },
          {
            name: t("table.number_out"),
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
                  color: "rgb(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgb(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: items?.map((item) => item.number_out),
          },
        ],
      }}
      opts={{ renderer: "svg" }}
      lazyUpdate
    />
  );
}
