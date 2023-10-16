/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, FileAddOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { useGetWithdrawReportFields } from "@src/services/consult/withdrawals/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreatePaidWithdrawalsReports } from "@src/services/reports/consult/withdrawals/paid/createGeneratedWithdrawalsReports";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Input, Select, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import { useGetRowsPaidWithdrawals } from "../../../../../../services/consult/withdrawals/paidWithdrawals/getRows";
import { useGetTotalPaidWithdrawals } from "../../../../../../services/consult/withdrawals/paidWithdrawals/getTotal";
import { paidWithdrawalsRowsQuery } from "../../../../../../services/types/consult/withdrawals/paidWithdrawals.interface";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: paidWithdrawalsRowsQuery = {
  page: 1,
  limit: 25,
  initial_date: moment(new Date())
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const PaidWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const [query, setQuery] = useState<paidWithdrawalsRowsQuery>(INITIAL_QUERY);
  const {
    PaidWithdrawalsTotal,
    isPaidWithdrawalsTotalFetching,
    refetchPaidWithdrawalsTotal,
  } = useGetTotalPaidWithdrawals(query);

  const {
    paidWithdrawalsRows,
    isPaidWithdrawalsRowsFetching,
    refetchPaidWithdrawalsTotalRows,
    paidWithdrawalsRowsError,
  } = useGetRowsPaidWithdrawals(query);

  const { fields } = useGetWithdrawReportFields();

  useEffect(() => {
    refetchPaidWithdrawalsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const {
    PaidWithdrawalsReportsError,
    PaidWithdrawalsReportsIsLoading,
    PaidWithdrawalsReportsIsSuccess,
    PaidWithdrawalsReportsMutate,
  } = useCreatePaidWithdrawalsReports({
    ...query,
    fields: { ...csvFields },
    comma_separate_value: isComma,
  });

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "delivered_at", type: "date" },
    { name: "receiver_name", type: "text" },
    { name: "receiver_document", type: "document" },
    { name: "pix_key_type", type: "text" },
    { name: "pix_key", type: "text" },
    { name: "status", type: "status" },
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      {permissions.report.withdraw.paid_withdraw
        .report_withdraw_paid_withdraw_list_totals && (
        <TotalizersCards
          data={PaidWithdrawalsTotal}
          fetchData={refetchPaidWithdrawalsTotal}
          loading={isPaidWithdrawalsTotalFetching}
          query={query}
        />
      )}

      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={
              isPaidWithdrawalsRowsFetching || isPaidWithdrawalsTotalFetching
            }
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              setSearchOption(value);
              setSearch("");
            }}
            value={searchOption}
            placeholder={t("input.options")}
            options={[
              { value: "pix_id", label: t("table.pix_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payer_document", label: t("table.payer_document") },
              { value: "buyer_document", label: t("table.buyer_document") },
              { value: "buyer_name", label: t("table.buyer_name") },
              { value: "payer_name", label: t("table.payer_name") },
              { value: "txid", label: t("table.txid") },
              { value: "reference_id", label: t("table.reference_id") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Input.Search
            placeholder="Pesquisa"
            size="large"
            value={search || ""}
            disabled={!searchOption}
            style={{ width: "100%" }}
            onChange={(event) => setSearch(event.target.value)}
            onSearch={(value) =>
              setQuery((state) => ({
                ...state,
                [`${searchOption}`]: value,
              }))
            }
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            type="dashed"
            loading={isPaidWithdrawalsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>

        {permissions.report.withdraw.paid_withdraw
          .report_withdraw_paid_withdraw_export_csv && (
          <Grid item xs={12} md="auto" lg={1}>
            <Tooltip
              placement="topRight"
              title={
                !paidWithdrawalsRows?.items.length || paidWithdrawalsRowsError
                  ? t("messages.no_records_to_export")
                  : t("messages.export_csv")
              }
              arrow
            >
              <Button
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={isPaidWithdrawalsRowsFetching}
                disabled={
                  !paidWithdrawalsRows?.items.length || paidWithdrawalsRowsError
                }
              >
                <FileAddOutlined style={{ fontSize: 22 }} /> CSV
              </Button>
            </Tooltip>
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={paidWithdrawalsRows}
            items={paidWithdrawalsRows?.items}
            columns={columns}
            loading={isPaidWithdrawalsRowsFetching}
            error={paidWithdrawalsRowsError}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
            ]}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </Grid>
      </Grid>

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={
          !paidWithdrawalsRows?.items.length || paidWithdrawalsRowsError
        }
        mutateReport={() => PaidWithdrawalsReportsMutate()}
        error={PaidWithdrawalsReportsError}
        success={PaidWithdrawalsReportsIsSuccess}
        loading={PaidWithdrawalsReportsIsLoading}
        reportPath="/consult/withdrawals/withdrawals_reports/paid_withdrawals_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="PaidWithdrawalsReportsFields"
      />

      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          id={currentItem?._id}
        />
      )}
      {isFiltersOpen && (
        <FiltersModal
          maxRange
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "initial_date",
            "final_date",
            "status",
            "partner_id",
            "merchant_id",
            "aggregator_id",
            "operator_id",
            "bank",
            "payer_bank",
            "state",
            "city",
            "gender",
            "age_start",
            "value_start",
          ]}
          refetch={refetchPaidWithdrawalsTotalRows}
          selectOptions={{
            status: [
              "PAID",
              "REFUNDED",
              "EXPIRED",
              "CANCELED",
              "WAITING",
              "WAITING_REFUND",
            ],
            gender: ["MALE", "FEMALE", "OTHER"],
          }}
          startDateKeyName="initial_date"
          endDateKeyName="final_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
