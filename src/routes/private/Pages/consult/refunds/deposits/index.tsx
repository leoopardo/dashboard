/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, ShopOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { Toast } from "@src/components/Toast";
import { useCreateDepositrefund } from "@src/services/consult/refund/refundDeposits/createRefund";
import { useUpatePayToMerchant } from "@src/services/consult/refund/refundDeposits/updateRefundToMerchant";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundDepositsReports } from "@src/services/reports/consult/refund/deposit/createRefundDepositReports";
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
import { useGetRowsRefundDeposits } from "../../../../../../services/consult/refund/refundDeposits/getRows";
import { useGetTotalRefundDeposits } from "../../../../../../services/consult/refund/refundDeposits/getTotal";
import {
  refundDepositRowsItems,
  refundDepositsQuery,
} from "../../../../../../services/types/consult/refunds/refundsDeposits.interface";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: refundDepositsQuery = {
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

export const RefundDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundDepositsQuery>(INITIAL_QUERY);
  const {
    refundDepositsTotal,
    isRefundDepositsTotalFetching,
    refetchRefundDepositsTotal,
  } = useGetTotalRefundDeposits(query);

  const {
    refundDepositsRows,
    isRefundDepositsRowsFetching,
    refetchRefundDepositsTotalRows,
    refundDepositsRowsError,
  } = useGetRowsRefundDeposits(query);

  useEffect(() => {
    refetchRefundDepositsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isPayToMerchantModalOpen, setIsPayToMerchantModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] =
    useState<refundDepositRowsItems | null>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const { error, isLoading, isSuccess, mutate } = useCreateDepositrefund(
    currentItem?._id
  );

  const { payToMerchantSuccess, payToMerchanterror, payToMerchantMutate } =
    useUpatePayToMerchant(currentItem?._id);

  const {
    RefundDepositsReportsError,
    RefundDepositsReportsIsLoading,
    RefundDepositsReportsIsSuccess,
    RefundDepositsReportsMutate,
  } = useCreateRefundDepositsReports(query);

  const columns: ColumnInterface[] = [
    { name: "pix_id", type: "id" },
    { name: "endToEndId", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "status" },
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      <TotalizersCards
        data={refundDepositsTotal}
        fetchData={refetchRefundDepositsTotal}
        loading={isRefundDepositsTotalFetching}
        query={query}
      />

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
              isRefundDepositsRowsFetching || isRefundDepositsTotalFetching
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
            haveInitialDate={
              !["pix_id", "endToEndId", "txid", "rtrid"].includes(
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
              delete query.rtrid;
              delete query.buyer_document;
              delete query.buyer_name;
              if (["pix_id", "endToEndId", "txid", "rtrid"].includes(value)) {
                delete query.start_date;
                delete query.end_date;
              } else {
                setQuery((state) => ({
                  start_date: moment(new Date()).format(
                    "YYYY-MM-DDTHH:mm:ss.SSS"
                  ),
                  end_date: moment(new Date())
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
              { value: "txid", label: t("table.txid") },
              { value: "rtrid", label: t("table.refund_id") },
              { value: "payer_document", label: t("table.payer_document") },
              { value: "buyer_document", label: t("table.buyer_document") },
              { value: "buyer_name", label: t("table.buyer_name") },
              { value: "payer_name", label: t("table.payer_name") },
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
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            type="dashed"
            loading={isRefundDepositsRowsFetching}
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
        {permissions?.report?.chargeback?.deposit_chargeback
          ?.report_chargeback_deposit_chargeback_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!refundDepositsRows?.total || refundDepositsRowsError}
              mutateReport={() => RefundDepositsReportsMutate()}
              error={RefundDepositsReportsError}
              success={RefundDepositsReportsIsSuccess}
              loading={RefundDepositsReportsIsLoading}
              reportPath="/consult/refunds/refund_reports/refund_deposits_reports"
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
            data={refundDepositsRows}
            items={refundDepositsRows?.items}
            columns={columns}
            loading={isRefundDepositsRowsFetching}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              permissions?.report?.chargeback?.deposit_chargeback
                ?.report_chargeback_deposit_chargeback_refund && {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsRefundModalOpen(true),
                disabled: (item) =>
                  !["WAITING", "ERROR"].includes(item?.status),
              },

              permissions?.report?.chargeback?.deposit_chargeback
                ?.report_chargeback_deposit_chargeback_paid_to_merchant && {
                label: "pay_to_merchant",
                icon: <ShopOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayToMerchantModalOpen(true),
                disabled: (item) =>
                  !["WAITING", "ERROR"].includes(item?.status),
              },
            ]}
            removeTotal
            label={["merchant_name", "status", "createdAt", "delivered_at"]}
          />
        </Grid>
      </Grid>

      {isRefundModalOpen && (
        <Confirmation
          open={isRefundModalOpen}
          setOpen={setIsRefundModalOpen}
          submit={mutate}
          title={t("actions.refund")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.refund").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={isLoading}
        />
      )}
      {isPayToMerchantModalOpen && (
        <Confirmation
          open={isPayToMerchantModalOpen}
          setOpen={setIsPayToMerchantModalOpen}
          submit={payToMerchantMutate}
          title={t("actions.pay_to_merchant")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.pay_to_merchant").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={isLoading}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          item={currentItem}
          type="Refund"
        />
      )}
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate={
            !["pix_id", "endToEndId", "txid", "rtrid"].includes(
              searchOption as any
            )
          }
          filters={[
            "start_date",
            "end_date",
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
          refetch={refetchRefundDepositsTotalRows}
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

      <Toast
        actionError={t("messages.refund")}
        actionSuccess={t("messages.refunded")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionError={t("messages.refund")}
        actionSuccess={t("messages.refunded")}
        error={payToMerchanterror}
        success={payToMerchantSuccess}
      />
    </Grid>
  );
};
