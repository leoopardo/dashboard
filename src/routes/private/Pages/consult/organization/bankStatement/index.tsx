/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useGetOrganizationPerbank } from "@src/services/consult/organization/bankStatement/getPerBank";
import { useGetOrganizationBankStatementTotals } from "@src/services/consult/organization/bankStatement/getTotals";
import { queryClient } from "@src/services/queryClient";
import { useCreateBankStatementReports } from "@src/services/reports/consult/organization/createBankStatementReports";
import { OrganizationBankStatementTotalsQuery } from "@src/services/types/consult/organization/bankStatement/totals.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Totalizers } from "./components/Totalizers";
import { useTheme } from "@src/contexts/ThemeContext";
import { moneyFormatter } from "@src/utils/moneyFormatter";

const INITIAL_QUERY: OrganizationBankStatementTotalsQuery = {
  start_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const OrganizationBankStatement = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [, setCurrentItem] = useState<any>();
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<OrganizationBankStatementTotalsQuery>(INITIAL_QUERY);
  const { theme } = useTheme();
  const {
    OrganizationBankStatementTotals,
    isOrganizationBankStatementTotalsFetching,
    refetchOrganizationBankStatementTotalsTotal,
  } = useGetOrganizationBankStatementTotals(query);
  const {
    OrganizationPerbank,
    OrganizationPerbankError,
    isOrganizationPerbankFetching,
    refetchOrganizationPerbank,
  } = useGetOrganizationPerbank(query);

  const {
    BankStatementReportsError,
    BankStatementReportsIsLoading,
    BankStatementReportsIsSuccess,
    BankStatementReportsMutate,
  } = useCreateBankStatementReports(query);

  useEffect(() => {
    refetchOrganizationPerbank();
  }, [
    query.page,
    query.bank,
    query.payment_type,
    query.end_date,
    query.start_date,
  ]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="dashed"
            danger
            loading={isOrganizationBankStatementTotalsFetching}
            onClickCapture={() => setQuery(INITIAL_QUERY)}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            style={{ width: "100%" }}
            type="primary"
            size="large"
            loading={isOrganizationBankStatementTotalsFetching}
            onClick={() => {
              refetchOrganizationPerbank();
              refetchOrganizationBankStatementTotalsTotal();
            }}
            icon={<ReloadOutlined />}
          >
            {t("buttons.refresh")}
          </Button>
        </Grid>
        {permissions.report.paybrokers.extract
          .report_paybrokers_extract_export_csv && (
          <Grid item xs={12} md="auto" lg={1}>
            <ExportReportsModal
              disabled={
                !OrganizationPerbank?.length || OrganizationPerbankError
              }
              mutateReport={() => BankStatementReportsMutate()}
              error={BankStatementReportsError}
              success={BankStatementReportsIsSuccess}
              loading={BankStatementReportsIsLoading}
              reportPath="/consult/consult_organization/consult_organization_reports"
            />
          </Grid>
        )}
      </Grid>
      <Totalizers query={query} />

      {true && (
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            marginTop: "50px",
          }}
        >
          <Grid item xs={12} md={2} style={{ marginRight: -30 }}>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: "item",
                },
                darkMode: theme === "dark",
                legend: {
                  textStyle: {
                    color: "#a0a0a0",
                  },
                },
                color: [
                  defaultTheme.colors.chartGreen,
                  defaultTheme.colors.chartRed,
                ],
                series: [
                  {
                    name: `${t("table.number_in")} / ${t("table.number_out")}`,
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderWidth: 2,
                    },
                    label: {
                      show: false,
                      position: "center",
                    },
                    emphasis: {
                      label: {
                        show: false,
                        fontSize: 40,
                        fontWeight: "bold",
                      },
                    },
                    labelLine: {
                      show: false,
                    },
                    data: [
                      {
                        value: OrganizationBankStatementTotals.number_in,
                        name: t("table.number_in"),
                      },
                      {
                        value: OrganizationBankStatementTotals.number_out,
                        name: t("table.number_out"),
                      },
                    ],
                  },
                ],
              }}
              opts={{ renderer: "svg" }}
              lazyUpdate
            />
          </Grid>
          <Grid item xs={10}>
            <ReactECharts
              option={{
                legend: {
                  textStyle: {
                    color: "#c5c5c5",
                  },
                },
                color: [
                  defaultTheme.colors.chartGreen,
                  defaultTheme.colors.chartRed,
                  defaultTheme.colors.chartBlue,
                ],
                tooltip: {},
                dataset: {
                  source: [
                    [
                      "product",
                      t("table.in"),
                      t("table.out"),
                      t("table.total"),
                    ],

                    [
                      t("table.value"),
                      OrganizationBankStatementTotals.value_in,
                      OrganizationBankStatementTotals.value_out,
                      OrganizationBankStatementTotals.value_total,
                    ],
                    [
                      t("table.fee"),
                      OrganizationBankStatementTotals.fee_in,
                      OrganizationBankStatementTotals.fee_out,
                      OrganizationBankStatementTotals.fee_total,
                    ],
                    [
                      t("table.bank_fee"),
                      OrganizationBankStatementTotals.bank_fee_in,
                      OrganizationBankStatementTotals.bank_fee_out,
                      OrganizationBankStatementTotals.bank_fee_total,
                    ],
                    [
                      t("table.result"),
                      OrganizationBankStatementTotals.result_in,
                      OrganizationBankStatementTotals.result_out,
                      OrganizationBankStatementTotals.result_total,
                    ],
                  ],
                },
                xAxis: { type: "category" },
                yAxis: {
                  axisLabel: {
                    formatter: (value: number) =>
                    moneyFormatter(value ?? 0),
                  },
                },
                series: [
                  {
                    type: "bar",
                    tooltip: {
                      valueFormatter: (value: number) =>
                        moneyFormatter(value ?? 0),
                    },
                  },
                  {
                    type: "bar",
                    tooltip: {
                      valueFormatter: (value: number) =>
                        moneyFormatter(value ?? 0),
                    },
                  },
                  {
                    type: "bar",
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
          </Grid>
        </Grid>
      )}
      {isOrganizationBankStatementTotalsFetching && (
        <Grid container>
          <Grid
            item
            xs={12}
            style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Spin tip={t("messages.loading")} size="default">
              <Grid item xs={12} style={{ height: "50px" }} />
            </Spin>{" "}
          </Grid>
        </Grid>
      )}

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={OrganizationPerbank}
            items={OrganizationPerbank}
            error={OrganizationPerbankError}
            columns={[
              { name: "bank", type: "bankNameToIcon", sort: true },
              { name: "number_in", type: "text", sort: true },
              { name: "value_in", type: "value" },
              { name: "fee_in", type: "value" },
              { name: "number_out", type: "text" },
              { name: "value_out", type: "value" },
              { name: "fee_out", type: "value" },
              { name: "number_total", type: "text" },
              { name: "value_total", type: "value" },
              { name: "fee_total", type: "value" },
            ]}
            loading={isOrganizationPerbankFetching}
            removeTotal
            label={["bank", "value_total"]}
            removePagination
          />
        </Grid>
      </Grid>

        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={["start_date", "end_date", "payment_type", "bank"]}
          refetch={refetchOrganizationPerbank}
          selectOptions={{ payment_type: ["pix", "withdraw"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      
    </Grid>
  );
};
