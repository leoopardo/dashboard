/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, ReloadOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedDepositsReports } from "@src/services/reports/consult/deposits/createGeneratedDepositsReports";
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
import { useGetRowsGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getRows";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getTotal";
import { generatedDepositTotalQuery } from "../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: generatedDepositTotalQuery = {
  page: 1,
  limit: 25,
  delivered_at: false,
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

export const UndeliveredDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const { t } = useTranslation();
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(query);

  const {
    depositsRows,
    isDepositsRowsFetching,
    refetchDepositsTotalRows,
    depositsRowsError,
  } = useGetRowsGeneratedDeposits(query);

  const {
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsIsSuccess,
    GeneratedDepositsReportsMutate,
  } = useCreateGeneratedDepositsReports(query);

  useEffect(() => {
    refetchDepositsTotalRows();
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
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "status" },
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      {permissions.report.deposit.undelivered_deposit
        .report_deposit_undelivered_deposit_list_totals && (
        <TotalizersCards
          data={depositsTotal}
          fetchData={() => {
            refetchDepositsTotal();
            refetchDepositsTotalRows();
          }}
          loading={isDepositsTotalFetching}
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
            loading={isDepositsRowsFetching || isDepositsTotalFetching}
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
              !["pix_id", "endToEndId", "txid", "reference_id"].includes(
                searchOption as any
              )
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
              delete query.pix_id;
              delete query.endToEndId;
              delete query.txid;
              delete query.reference_id;
              delete query.payer_document;
              delete query.buyer_document;
              delete query.buyer_name;
              delete query.payer_name;
              delete query.description;

              if (
                ["pix_id", "endToEndId", "txid", "reference_id"].includes(value)
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
              { value: "pix_id", label: t("table.pix_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payer_document", label: t("table.payer_document") },
              { value: "buyer_document", label: t("table.buyer_document") },
              { value: "buyer_name", label: t("table.buyer_name") },
              { value: "payer_name", label: t("table.payer_name") },
              { value: "txid", label: t("table.txid") },
              { value: "reference_id", label: t("table.reference_id") },
              { value: "description", label: t("table.description") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={4}>
          <Search
            query={query}
            setQuery={setQuery}
            searchOption={searchOption}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            type="dashed"
            loading={isDepositsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(undefined);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid container item xs={12} md="auto" style={{ marginLeft: "auto" }} spacing={1}>
          {permissions.report.deposit.undelivered_deposit
            .report_deposit_undelivered_deposit_export_csv && (
            <Grid item xs={12} md={6} lg={6}>
              <ExportReportsModal
                disabled={depositsRows?.items.length === 0|| depositsRowsError}
                mutateReport={() => GeneratedDepositsReportsMutate()}
                error={GeneratedDepositsReportsError}
                success={GeneratedDepositsReportsIsSuccess}
                loading={GeneratedDepositsReportsIsLoading}
                reportPath="/consult/deposit/deposits_reports/generated_deposits_reports"
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={6}>
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isDepositsTotalFetching || isDepositsRowsFetching}
              onClickCapture={() => {
                refetchDepositsTotal();
                refetchDepositsTotalRows();
              }}
            >
              <ReloadOutlined /> {t("buttons.refresh")}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={depositsRows}
            items={depositsRows?.items}
            columns={columns}
            loading={isDepositsRowsFetching}
            error={depositsRowsError}
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
            !["pix_id", "endToEndId", "txid", "reference_id"].includes(
              searchOption as any
            )
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
          refetch={refetchDepositsTotalRows}
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
