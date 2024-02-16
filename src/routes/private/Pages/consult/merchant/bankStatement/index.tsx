/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined, EyeFilled, FilterOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useGetHourly } from "@src/services/consult/merchant/bankStatement/getHourly";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { useGetMerchantTransactions } from "@src/services/consult/merchant/bankStatement/getTransactions";
import { queryClient } from "@src/services/queryClient";
import { useCreateMerchantBankStatementReports } from "@src/services/reports/consult/merchant/createBankStatementReports";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Spin, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MerchantHourlyLineChart } from "./components/HourlyChart";
import { Totalizers } from "./components/totalizers";
import { MerchantNumberLineChart } from "./components/HourlyNumber";
import { ViewModal } from "../../deposits/components/ViewModal";
import { ViewModal as ViewWithdralModal } from "../../withdrawals/components/ViewModal";

const INITIAL_QUERY: MerchantBankStatementTotalsQuery = {
  page: 1,
  limit: 25,
  start_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  sort_field: "paid_at",
  sort_order: "desc",
};

export const MerchantBankStatement = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<MerchantBankStatementTotalsQuery>(INITIAL_QUERY);
  const [isViewDepositOpen, setIsViewDepositOpen] = useState(false);
  const [isViewWithdrawOpen, setIsViewWithdrawOpen] = useState(false);
  const {
    isMerchantBankStatementTotalsFetching,
    refetchMerchantBankStatementTotalsTotal,
  } = useGetMerchantBankStatementTotals(query);

  const { Hourly, refetchHourlyTotal } = useGetHourly(query);
  const {
    MerchantTransactions,
    isMerchantTransactionsFetching,
    MerchantTransactionsError,
    refetchMerchantTransactionsTotal,
  } = useGetMerchantTransactions(query);

  const {
    BankStatementReportsError,
    BankStatementReportsIsLoading,
    BankStatementReportsIsSuccess,
    BankStatementReportsMutate,
  } = useCreateMerchantBankStatementReports({
    ...query,
    sort_field: undefined,
    sort_order: undefined,
  });

  useEffect(() => {
    refetchHourlyTotal();
    refetchMerchantTransactionsTotal();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
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
        <Grid item xs={12} md={6} lg={6}>
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
            loading={isMerchantTransactionsFetching}
            onClickCapture={() => setQuery(INITIAL_QUERY)}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>

        {permissions.report.merchant.extract
          .report_merchant_extract_export_csv && (
          <Grid item xs={12} md={1}>
            <ExportReportsModal
              disabled={
                !MerchantTransactions?.total || MerchantTransactionsError
              }
              mutateReport={() => BankStatementReportsMutate()}
              error={BankStatementReportsError}
              success={BankStatementReportsIsSuccess}
              loading={BankStatementReportsIsLoading}
              reportPath="/consult/consult_merchant/consult_merchant_reports"
            />
          </Grid>
        )}
        <Grid item xs={12} md={2} lg={1}>
          <Button
            style={{ width: "100%" }}
            type="link"
            size="large"
            loading={isMerchantBankStatementTotalsFetching}
            onClick={() => {
              refetchMerchantTransactionsTotal();
              refetchMerchantBankStatementTotalsTotal();
            }}
            icon={<ReloadOutlined />}
          ></Button>
        </Grid>
      </Grid>

      <Totalizers query={query} />

      <Grid item xs={12} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          items={[
            {
              label: t("table.balance_history"),
              key: "1",
              children: <MerchantHourlyLineChart items={Hourly} />,
            },
            {
              label: t("table.transactions_history"),
              key: "2",
              children: <MerchantNumberLineChart items={Hourly} />,
            },
          ]}
        />
      </Grid>

      {isMerchantBankStatementTotalsFetching && (
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
            data={MerchantTransactions}
            items={MerchantTransactions?.items}
            error={MerchantTransactionsError}
            columns={[
              { name: "bank_name", type: "bankNameToIcon" },
              { name: "bank_account_number", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "paid_at", type: "date" },
              { name: "transaction_type", type: "translate" },
              { name: "fee_type", type: "translate" },
              { name: "value", type: "value" },
              { name: "fee", type: "value" },
            ]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: (item) =>
                  item?.fee_type !== "IN"
                    ? setIsViewWithdrawOpen(true)
                    : setIsViewDepositOpen(true),
              },
            ]}
            loading={isMerchantTransactionsFetching}
            removeTotal
            label={["bank_name", "value", "paid_at"]}
            bankStatement
          />
        </Grid>
      </Grid>

      {isViewDepositOpen && (
        <ViewModal
          open={isViewDepositOpen}
          setOpen={setIsViewDepositOpen}
          id={currentItem?.id}
        />
      )}

      {isViewWithdrawOpen && (
        <ViewWithdralModal
          open={isViewWithdrawOpen}
          setOpen={setIsViewWithdrawOpen}
          id={currentItem?.id}
        />
      )}

        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "operation_type",
            "bank",
            "aggregator_id",
            "operator_id",
            "partner_id",
            "merchant_id",
          ]}
          refetch={refetchMerchantTransactionsTotal}
          selectOptions={{ operation_type: ["PIX", "WITHDRAW"] }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
          maxRange
          disableMinutes
        />
      
    </Grid>
  );
};
