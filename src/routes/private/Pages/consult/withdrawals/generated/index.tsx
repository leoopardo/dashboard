/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  SendOutlined,
  SettingFilled,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getRows";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { useCreateSendWithdrawWebhook } from "@src/services/consult/withdrawals/generatedWithdrawals/resendWebhook";
import { useGetWithdrawReportFields } from "@src/services/consult/withdrawals/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedWithdrawalsReports } from "@src/services/reports/consult/withdrawals/generated/createGeneratedWithdrawalsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Select, Tooltip } from "antd";
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
import { ResendWebhookModal } from "../../deposits/components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: generatedWithdrawalsRowsQuery = {
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
  status: "PAID",
};

export const GeneratedWithdrawals = () => {
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

  useEffect(() => {
    refetchWithdrawalsTotalRows();
    refetchWithdrawalsTotal()
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const {
    GeneratedWithdrawalsReportsError,
    GeneratedWithdrawalsReportsIsLoading,
    GeneratedWithdrawalsReportsIsSuccess,
    GeneratedWithdrawalsReportsMutate,
  } = useCreateGeneratedWithdrawalsReports({
    ...query,
    fields: { ...csvFields },
    comma_separate_value: isComma,
  });

  const [webhookBody, setWebhookBody] = useState<ResendWebhookBody>({
    start_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    merchant_id: undefined,
    partner_id: undefined,
    webhook_url_type: "both",
  });

  const [webhookId, setWebhookId] = useState<string>("");
  const { ResendWebMutate, ResendWebError, ResendWebIsSuccess } =
    useCreateSendWithdrawWebhook(webhookBody, webhookId);

  const { fields } = useGetWithdrawReportFields();

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "partner_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "delivered_at", type: "date" },
    { name: "receiver_name", type: "text" },
    { name: "receiver_document", type: "document" },
    { name: "pix_type", head: "payment_type", type: "pix_type" },
    { name: "pix_key", type: "text" },
    { name: "status", type: "status" },
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      {permissions.report.withdraw.generated_withdraw
        .report_withdraw_generated_withdraw_list_totals && (
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
            icon={<FilterOutlined />}
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
        <Grid item xs={12} md={4} lg={2}>
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
              delete query.withdraw_id;

              if (
                [
                  "organization_id",
                  "withdraw_id",
                  "endToEndId",
                  "payment_id",
                  "reference_id",
                  "receiver_document",
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
              { value: "withdraw_id", label: t("table.organization_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payment_id", label: t("table.payment_id") },
              { value: "reference_id", label: t("table.reference_id") },
              {
                value: "receiver_document",
                label: t("table.receiver_document"),
              },
              { value: "receiver_name", label: t("table.receiver_name") },
              { value: "description", label: t("table.description") },
              { value: "pix_key", label: t("table.pix_key") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={5} lg={3}>
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
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.report.withdraw.generated_withdraw
          .report_withdraw_generated_withdraw_resend_notification && (
          <Grid item xs={12} md={4} lg={2}>
            <Button
              type="primary"
              loading={isWithdrawalsRowsFetching}
              size="large"
              onClick={() => {
                setIsResendWebhookModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              icon={<SendOutlined />}
            >
              {t("modal.resend_webhook")}
            </Button>
          </Grid>
        )}

        {permissions.report.withdraw.generated_withdraw
          .report_withdraw_generated_withdraw_export_csv && (
          <Grid item xs={12} md={4} lg={1}>
            <Tooltip
              placement="topRight"
              title={
                witrawalsRows?.items.length === 0 || witrawalsRowsError
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
                loading={isWithdrawalsRowsFetching}
                disabled={!witrawalsRows?.items.length || witrawalsRowsError}
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                CSV
              </Button>
            </Tooltip>
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
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
              {
                label: "logs_webhooks",
                icon: <SettingFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsWebhookModalOpen(true),
              },
              permissions.report.deposit.paid_deposit
                .report_deposit_paid_deposit_resend_notification && {
                label: "resend_webhook",
                icon: <SendOutlined style={{ fontSize: "18px" }} />,
                onClick: (item) => {
                  setWebhookBody((state) => ({
                    ...state,
                    end_date: undefined,
                    start_date: undefined,
                  }));
                  setWebhookId(item?._id);
                  setIsResendWebhookModalOpen(true);
                },
                disabled: (item) => item.status !== "PAID",
              },
            ]}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
              "value",
            ]}
          />
        </Grid>
      </Grid>

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!witrawalsRows?.items.length || witrawalsRowsError}
        mutateReport={() => GeneratedWithdrawalsReportsMutate()}
        error={GeneratedWithdrawalsReportsError}
        success={GeneratedWithdrawalsReportsIsSuccess}
        loading={GeneratedWithdrawalsReportsIsLoading}
        reportPath="/consult/withdrawals/withdrawals_reports/generated_withdrawals_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="withdrawalsReportsFields"
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
              "REFUNDED_WITHDRAW",
              "CANCELED",
              "PROCESSING",
              "WAITING",
              "IN_ANALYSIS",
              "CREATED",
              "WAITING_REFUND",
            ],
            gender: ["MALE", "FEMALE", "OTHER"],
          }}
          startDateKeyName="initial_date"
          endDateKeyName="final_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isWebhookModalOpen && (
        <WebhookModal
          open={isWebhookModalOpen}
          setOpen={setIsWebhookModalOpen}
          id={currentItem?._id}
        />
      )}
      {isResendWebhookModalOpen && (
        <ResendWebhookModal
          open={isResendWebhookModalOpen}
          setOpen={setIsResendWebhookModalOpen}
          body={webhookBody}
          setBody={setWebhookBody}
          submit={ResendWebMutate}
          id={webhookId}
          setId={setWebhookId}
        />
      )}
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={ResendWebError}
        success={ResendWebIsSuccess}
      />
    </Grid>
  );
};
