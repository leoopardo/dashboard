/* eslint-disable @typescript-eslint/no-explicit-any */
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetOrganizationBankBalance } from "@src/services/consult/organization/bankBalance/getOrganizationBankBalance";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

export const BankBalanceChart = () => {
  const { t } = useTranslation();
  const {
    OrganizationBankBalance,
    isOrganizationBankBalanceFetching,
  } = useGetOrganizationBankBalance();

  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });


  //   OrganizationBankBalance?.banks.map((bank) => bank.name)
  //   OrganizationBankBalance?.banks.map((bank) => bank.value)
  return (
    <>
      {OrganizationBankBalance && bankListData && bankListData?.itens && (
        <ReactECharts
          option={{
            legend: {
              textStyle: {
                color: "#a0a0a0",
              },
            },
            tooltip: {},
            textStyle: {
              color: "#a0a0a0",
            },
            color: ["#91cc75", "#ee6666", "#5470c6"],
            dataset: {
              source: [
                [
                  "product",
                  t("table.available_balance"),
                  t("table.blocked_value"),
                  "Total",
                ],
                ...(OrganizationBankBalance?.banks?.map((bank) => {
                  return [
                    bank?.name,
                    bank?.value,
                    bank.value_blocked,
                    bank.value_blocked + bank?.value,
                  ];
                }) as any),
              ],
            },
            xAxis: {
              type: "category",
            },
            yAxis: {
              axisLabel: {
                formatter: function (value: number) {
                  return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value) || 0);
                },
              },
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
              {
                type: "bar",
                tooltip: {
                  valueFormatter: function (value: number) {
                    return new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value) || 0);
                  },
                },
              },
              {
                type: "bar",
                tooltip: {
                  valueFormatter: function (value: number) {
                    return new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value) || 0);
                  },
                },
              },
              {
                type: "bar",
                tooltip: {
                  valueFormatter: function (value: number) {
                    return new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value) || 0);
                  },
                },
              },
            ],
          }}
          opts={{ renderer: "canvas" }}
          lazyUpdate
          showLoading={isOrganizationBankBalanceFetching}
        />
      )}
    </>
  );
};
