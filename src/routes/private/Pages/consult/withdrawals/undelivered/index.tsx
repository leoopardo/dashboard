/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getRows";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedWithdrawalsReports } from "@src/services/reports/consult/withdrawals/generated/createGeneratedWithdrawalsReports";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import { generatedWithdrawalsRowsQuery } from "../../../../../../services/types/consult/withdrawals/generatedWithdrawals.interface";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: generatedWithdrawalsRowsQuery = {
  page: 1,
  limit: 25,
  delivered_at: false,
  initial_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const UndeliveredWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<generatedWithdrawalsRowsQuery>(INITIAL_QUERY);
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(query);

  const {
    witrawalsRows,
    isWithdrawalsRowsFetching,
    refetchWithdrawalsTotalRows,
    witrawalsRowsError,
  } = useGetRowsGeneratedWithdrawals(query);

  const {
    GeneratedWithdrawalsReportsError,
    GeneratedWithdrawalsReportsIsLoading,
    GeneratedWithdrawalsReportsIsSuccess,
    GeneratedWithdrawalsReportsMutate,
  } = useCreateGeneratedWithdrawalsReports(query);

  useEffect(() => {
    refetchWithdrawalsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

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
      {permissions.report.withdraw.undelivered_withdraw
        .report_withdraw_undelivered_withdraw_list_totals && (
        <TotalizersCards
          data={WithdrawalsTotal}
          fetchData={() => {
            refetchWithdrawalsTotal();
            refetchWithdrawalsTotalRows();
          }}
          loading={isWithdrawalsTotalFetching}
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
            loading={isWithdrawalsRowsFetching || isWithdrawalsTotalFetching}
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
            haveInitialDate={
              ![
                "organization_id",
                "endToEndId",
                "payment_id",
                "reference_id",
              ].includes(searchOption as any)
            }
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              delete query.organization_id;
              delete query.endToEndId;
              delete query.payment_id;
              delete query.reference_id;
              delete query.receiver_document;
              delete query.receiver_name;
              delete query.description;
              if (
                [
                  "organization_id",
                  "endToEndId",
                  "payment_id",
                  "reference_id",
                ].includes(value)
              ) {
                delete query.initial_date;
                delete query.final_date;
              } else {
                setQuery((state) => ({
                  initial_date: moment(new Date()).format(
                    "YYYY-MM-DDTHH:mm:ss.SSS"
                  ),
                  final_date: moment(new Date())
                    .add(1, "hour")
                    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                  ...state,
                }));
              }
              setSearchOption(value);
            }}
            value={searchOption}
            placeholder={t("input.options")}
            options={[
              { value: "organization_id", label: t("table.organization_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payment_id", label: t("table.payment_id") },
              { value: "reference_id", label: t("table.reference_id") },
              {
                value: "receiver_document",
                label: t("table.receiver_document"),
              },
              { value: "receiver_name", label: t("table.receiver_name") },
              { value: "description", label: t("table.description") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Search
            query={query}
            setQuery={setQuery}
            searchOption={searchOption}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Button
            size="large"
            type="dashed"
            loading={isWithdrawalsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(undefined);
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
        {permissions.report.withdraw.undelivered_withdraw
          .report_withdraw_undelivered_withdraw_export_csv && (
          <Grid item xs={12} md="auto" lg={2}>
            <ExportReportsModal
              disabled={witrawalsRows?.items.length === 0 || witrawalsRowsError}
              mutateReport={() => GeneratedWithdrawalsReportsMutate()}
              error={GeneratedWithdrawalsReportsError}
              success={GeneratedWithdrawalsReportsIsSuccess}
              loading={GeneratedWithdrawalsReportsIsLoading}
              reportPath="/consult/withdrawals/withdrawals_reports/generated_withdrawals_reports"
            />
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
            data={witrawalsRows}
            items={witrawalsRows?.items}
            columns={columns}
            loading={isWithdrawalsRowsFetching}
            error={witrawalsRowsError}
            refetch={() => {
              refetchWithdrawalsTotalRows();
              refetchWithdrawalsTotal();
            }}
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
          haveInitialDate={
            ![
              "organization_id",
              "endToEndId",
              "payment_id",
              "reference_id",
            ].includes(searchOption as any)
          }
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
          refetch={refetchWithdrawalsTotalRows}
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
