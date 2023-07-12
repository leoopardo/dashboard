/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, SearchOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getRows";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedWithdrawalsReports } from "@src/services/reports/consult/withdrawals/generated/createGeneratedWithdrawalsReports";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Alert, Button, Input, Select, Space } from "antd";
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
import useDebounce from "../../../../../../utils/useDebounce";
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
    WithdrawalsTotalError,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
  } = useGetTotalGeneratedWithdrawals(query);

  const {
    witrawalsRows,
    isWithdrawalsRowsFetching,
    refetchWithdrawalsTotalRows,
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
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const debounceSearch = useDebounce(search);

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

  useEffect(() => {
    const q = { ...query };
    delete q.pix_id;
    delete q.endToEndId;
    delete q.txid;
    delete q.reference_id;
    delete q.buyer_document;
    delete q.buyer_name;
    delete q.payer_name;

    if (debounceSearch && searchOption) {
      setQuery(() => ({ ...q, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch, searchOption]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container>
        {WithdrawalsTotalError ? (
          <Grid item xs={12} style={{ marginBottom: "10px" }}>
            <Alert
              message={WithdrawalsTotalError?.message}
              type="error"
              closable
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {permissions.report.withdraw.undelivered_withdraw
        .report_withdraw_undelivered_withdraw_list_totals && (
        <TotalizersCards
          data={WithdrawalsTotal}
          fetchData={refetchWithdrawalsTotal}
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
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => setSearchOption(value)}
            value={searchOption}
            placeholder="Opções"
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
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Pesquisa"
              size="large"
              disabled={!searchOption}
              style={{ width: "100%" }}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              loading={isWithdrawalsRowsFetching}
              type="primary"
              onClick={() => refetchWithdrawalsTotalRows()}
              disabled={typeof searchOption === "string" && !search}
            >
              <SearchOutlined />
            </Button>
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            type="dashed"
            loading={isWithdrawalsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch(null);
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
          <Grid item xs={12} md="auto" lg={1}>
            <ExportReportsModal
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
          haveInitialDate
          filters={[
            "initial_date",
            "final_date",
            "status",
            "partner_id",
            "merchant_id",
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
