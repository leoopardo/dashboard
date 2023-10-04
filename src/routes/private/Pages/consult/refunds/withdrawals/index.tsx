/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useGetRowsRefundWithdrawals } from "@src/services/consult/refund/refundWithdrawals/getRows";
import { useGetTotalRefundWithdrawals } from "@src/services/consult/refund/refundWithdrawals/getTotal";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundWithdrawalsReports } from "@src/services/reports/consult/refund/withdrawals/createRefundWithdrawalsReports";
import { refundWithdrawalsQuery } from "@src/services/types/consult/refunds/refundWithdrawals.interface copy";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Input, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import useDebounce from "../../../../../../utils/useDebounce";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: refundWithdrawalsQuery = {
  page: 1,
  limit: 25,
  start_date: moment(new Date())
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const RefundWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundWithdrawalsQuery>(INITIAL_QUERY);
  const {
    isRefundWithdrawalsTotalFetching,
    refetchRefundWithdrawalsTotal,
    refundWithdrawalsTotal,
    refundWithdrawalsTotalError,
  } = useGetTotalRefundWithdrawals(query);

  const {
    isRefundWithdrawalsFetching,
    refetchRefundWithdrawals,
    refundWithdrawals,
    refundWithdrawalsError,
  } = useGetRowsRefundWithdrawals(query);

  const {
    RefundWithdrawalsReportsError,
    RefundWithdrawalsReportsIsLoading,
    RefundWithdrawalsReportsIsSuccess,
    RefundWithdrawalsReportsMutate,
  } = useCreateRefundWithdrawalsReports(query);

  useEffect(() => {
    refetchRefundWithdrawals();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "endToEndId", type: "id" },
    { name: "rtrId", head: "refund_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "refund_date", type: "date" },
    { name: "receiver_name", type: "text" },
    { name: "receiver_document", type: "document" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    const q = { ...query };
    delete q.pix_id;
    delete q.endToEndId;
    delete q.txid;
    delete q.reference_id;
    delete q.buyer_document;
    delete q.payer_document;
    delete q.buyer_name;
    delete q.payer_name;

    if (debounceSearch && searchOption) {
      setQuery(() => ({ ...q, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch, searchOption]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <TotalizersCards
        data={refundWithdrawalsTotal}
        fetchData={refetchRefundWithdrawalsTotal}
        loading={isRefundWithdrawalsTotalFetching}
        query={query}
      />

      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
            loading={
              isRefundWithdrawalsFetching || isRefundWithdrawalsTotalFetching
            }
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%", height: "35px" }}
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
          <Input
            placeholder="Pesquisa"
            size="large"
            disabled={!searchOption}
            value={search || ""}
            style={{ height: "40px", width: "100%" }}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isRefundWithdrawalsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch("");
            }}
            style={{ height: 40, display: "flex", alignItems: "center" }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>

        {permissions?.report?.chargeback?.deposit_chargeback
          ?.report_chargeback_deposit_chargeback_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!refundWithdrawals?.total || refundWithdrawalsError}
              mutateReport={() => RefundWithdrawalsReportsMutate()}
              error={RefundWithdrawalsReportsError}
              success={RefundWithdrawalsReportsIsSuccess}
              loading={RefundWithdrawalsReportsIsLoading}
              reportPath="/consult/refunds/refund_reports/refund_withdrawals_reports"
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={refundWithdrawals}
            items={refundWithdrawals?.items}
            columns={columns}
            loading={isRefundWithdrawalsFetching}
            error={refundWithdrawalsError}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              /*  {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
                disabled: (item) => ["WAITING", "ERROR"].includes(item?.status),
              }, */
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
          item={currentItem}
          type="withdraw"
        />
      )}
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "status",
            "merchant_id",
            "aggregator_id",
            "aggregator_id",
            "operator_id",
          ]}
          refetch={refetchRefundWithdrawalsTotal}
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
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
