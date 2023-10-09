/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  ReloadOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Grid } from "@mui/material";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useCreatePayToMerchantRefund } from "@src/services/consult/refund/refundDepositsManual/createPayToMerchant";
import { useCreatePixManualRefund } from "@src/services/consult/refund/refundDepositsManual/createRefund";
import { useDeletePixManualRefund } from "@src/services/consult/refund/refundDepositsManual/deleteRefund";
import { useGetRefundStatusManual } from "@src/services/consult/refund/refundDepositsManual/getRefreshStatus";
import { useGetRefundDepositsManual } from "@src/services/consult/refund/refundDepositsManual/getRows";
import { useGetTotalRefundDepositManual } from "@src/services/consult/refund/refundDepositsManual/getTotal";
import { useUpdateMerchantRefund } from "@src/services/consult/refund/refundDepositsManual/updateMerchant";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundManualDepositsReports } from "@src/services/reports/consult/refund/manualDeposits/createRefundManualDepositReports";
import { UpdateMerchantRefundBody } from "@src/services/types/consult/refunds/refundmanualDeposits.interface";
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
import { refundDepositsQuery } from "../../../../../../services/types/consult/refunds/refundsDeposits.interface";
import useDebounce from "../../../../../../utils/useDebounce";
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

export const RefundDepositsManual = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundDepositsQuery>(INITIAL_QUERY);
  const {
    isRefundDepositManualTotalFetching,
    refetchRefundDepositManualTotal,
    refundDepositManualTotal,
  } = useGetTotalRefundDepositManual(query);

  const {
    isRefundDepositsManualFetching,
    refetchRefundDepositsManual,
    refundDepositsManual,
    refundDepositsManualError,
  } = useGetRefundDepositsManual(query);

  const {
    RefundManualDepositsReportsError,
    RefundManualDepositsReportsIsLoading,
    RefundManualDepositsReportsIsSuccess,
    RefundManualDepositsReportsMutate,
  } = useCreateRefundManualDepositsReports(query);

  useEffect(() => {
    refetchRefundDepositsManual();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isPayMerchantModalOpen, setIsPayMerchantModalOpen] =
    useState<boolean>(false);
  const [isUpdateMerchantModalOpen, setIsUpdateMerchantModalOpen] =
    useState<boolean>(false);
  const debounceSearch = useDebounce(search);
  const [updateBody, setUpdateBody] = useState<UpdateMerchantRefundBody>({
    endToEndId: currentItem?.endToEndId,
    merchant_id: currentItem?.merchant_id,
  });
  const { mutate, isLoading } = useCreatePixManualRefund(currentItem._id);
  const { isPayToMerchantLoading, mutatePayToMerchant } =
    useCreatePayToMerchantRefund(currentItem._id);
  const { isDeleteLoading, mutateDelete } = useDeletePixManualRefund(
    currentItem._id
  );
  const { refetchRefundStatusManual } = useGetRefundStatusManual(
    currentItem._id
  );

  const {
    mutateUpdateMerchant,
    UpdateMerchantError,
    isUpdateMerchantLoading,
    isUpdateMerchantSuccess,
  } = useUpdateMerchantRefund(updateBody);

  const columns: ColumnInterface[] = [
    { name: "pix_id", type: "id" },
    { name: "endToEndId", type: "id" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "delivered_at", type: "date" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "document" },
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
        data={refundDepositManualTotal}
        fetchData={refetchRefundDepositManualTotal}
        loading={isRefundDepositManualTotalFetching}
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
              isRefundDepositsManualFetching ||
              isRefundDepositManualTotalFetching
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
            loading={isRefundDepositsManualFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch("");
            }}
            style={{
              height: 40,
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
              disabled={
                !refundDepositsManual?.total || refundDepositsManualError
              }
              mutateReport={() => RefundManualDepositsReportsMutate()}
              error={RefundManualDepositsReportsError}
              success={RefundManualDepositsReportsIsSuccess}
              loading={RefundManualDepositsReportsIsLoading}
              reportPath="/consult/refunds/refund_reports/refund_manual_reports"
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
            data={refundDepositsManual}
            items={refundDepositsManual?.items}
            columns={columns}
            loading={isRefundDepositsManualFetching}
            error={refundDepositsManualError}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              {
                label: "refresh",
                icon: <ReloadOutlined style={{ fontSize: "18px" }} />,
                onClick: () => refetchRefundStatusManual(),
                disabled: (item) =>
                  !permissions?.report?.chargeback?.manual_deposit_chargeback
                    ?.report_chargeback_manual_deposit_chargeback_validate_status &&
                  !["PROCESSING"].includes(item?.status),
              },
              {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsRefundModalOpen(true),
                disabled: (item) =>
                  !permissions?.report?.chargeback?.manual_deposit_chargeback
                    ?.report_chargeback_manual_deposit_chargeback_refund &&
                  !currentItem.merchant_id &&
                  !["WAITING", "ERROR"].includes(item?.status),
              },
              {
                label: "pay_to_merchant",
                icon: <ShopOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayMerchantModalOpen(true),
                disabled: (item) =>
                  !permissions?.report?.chargeback?.manual_deposit_chargeback
                    ?.report_chargeback_manual_deposit_chargeback_paid_to_merchant &&
                  !currentItem.merchant_id &&
                  !["WAITING", "ERROR"].includes(item?.status),
              },
              {
                label: "edit_merchant",
                icon: <EditOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayMerchantModalOpen(true),
                disabled: () =>
                  !permissions?.report?.chargeback?.manual_deposit_chargeback
                    ?.report_chargeback_manual_deposit_chargeback_update_merchant,
              },
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayMerchantModalOpen(true),
                disabled: (item) =>
                  !permissions?.report?.chargeback?.manual_deposit_chargeback
                    ?.report_chargeback_manual_deposit_chargeback_delete &&
                  !["WAITING", "ERROR"].includes(item?.status),
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
          item={currentItem}
          type="manual"
        />
      )}

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

      {isPayMerchantModalOpen && (
        <Confirmation
          open={isPayMerchantModalOpen}
          setOpen={setIsPayMerchantModalOpen}
          submit={mutatePayToMerchant}
          title={t("actions.pay_to_merchant")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.pay_to_merchant").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={isPayToMerchantLoading}
        />
      )}

      {isDeleteOpen && (
        <Confirmation
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          submit={mutateDelete}
          title={t("actions.delete")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.delete").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={isDeleteLoading}
        />
      )}

      {isUpdateMerchantModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateMerchantModalOpen}
          setOpen={setIsUpdateMerchantModalOpen}
          fields={[{ label: "merchant_id", required: true }]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.update_aggregator")}
          submit={mutateUpdateMerchant}
          submitLoading={isUpdateMerchantLoading}
          error={UpdateMerchantError}
          success={isUpdateMerchantSuccess}
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
          refetch={refetchRefundDepositManualTotal}
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
