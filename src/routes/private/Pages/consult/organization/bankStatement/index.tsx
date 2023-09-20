/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined } from "@ant-design/icons";
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
import { Button, Divider, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { PieBankfee } from "./components/PieBankFee";
import { PieFee } from "./components/PieFee";
import { PieNumber } from "./components/PieNumber";
import { PieResult } from "./components/PieResult";
import { PieChart } from "./components/PieValue";
import { Totalizers } from "./components/Totalizers";

const INITIAL_QUERY: OrganizationBankStatementTotalsQuery = {
  start_date: moment(new Date())
    .startOf("day").add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day").add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const OrganizationBankStatement = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [, setCurrentItem] = useState<any>();
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<OrganizationBankStatementTotalsQuery>(INITIAL_QUERY);

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
            style={{ width: "100%", height: 40 }}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
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
          >
            <ReloadOutlined /> {t("buttons.refresh")}
          </Button>
        </Grid>
        {permissions.report.paybrokers.extract
          .report_paybrokers_extract_export_csv && (
          <Grid item xs={12} md="auto" lg={1}>
            <ExportReportsModal
              disabled={!OrganizationPerbank?.length || OrganizationPerbankError}
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

      {OrganizationBankStatementTotals.result_total > 0 &&
        !isOrganizationBankStatementTotalsFetching && (
          <Grid
            container
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "50px",
            }}
          >
            <Grid xs={12} md={2}>
              <PieNumber items={OrganizationBankStatementTotals} />
            </Grid>
            {!isMobile && (
              <Grid
                item
                xs={1}
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Divider
                  type="vertical"
                  style={{ height: !isMobile ? "100%" : "150px" }}
                />
              </Grid>
            )}

            <Grid xs={6} md={2}>
              <PieChart items={OrganizationBankStatementTotals} />
            </Grid>
            <Grid xs={6} md={2}>
              <PieFee items={OrganizationBankStatementTotals} />
            </Grid>
            <Grid xs={6} md={2}>
              <PieBankfee items={OrganizationBankStatementTotals} />
            </Grid>
            <Grid xs={6} md={2}>
              <PieResult items={OrganizationBankStatementTotals} />
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

      {isFiltersOpen && (
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
      )}
    </Grid>
  );
};
