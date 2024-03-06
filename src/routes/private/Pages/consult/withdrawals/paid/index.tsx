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
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { useCreateSendWithdrawWebhook } from "@src/services/consult/withdrawals/generatedWithdrawals/resendWebhook";
import { useGetPaidWithdrawReportFields } from "@src/services/consult/withdrawals/paidWithdrawals/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreatePaidWithdrawalsReports } from "@src/services/reports/consult/withdrawals/paid/createGeneratedWithdrawalsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Alert, Button, Col, Row, Select, Space, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import { useGetRowsPaidWithdrawals } from "../../../../../../services/consult/withdrawals/paidWithdrawals/getRows";
import { useGetTotalPaidWithdrawals } from "../../../../../../services/consult/withdrawals/paidWithdrawals/getTotal";
import { paidWithdrawalsRowsQuery } from "../../../../../../services/types/consult/withdrawals/paidWithdrawals.interface";
import { ResendWebhookModal } from "../../deposits/components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "./components/TotalizersCards";
import { ErrorList } from "@src/utils/errors";

const INITIAL_QUERY: paidWithdrawalsRowsQuery = {
  page: 1,
  limit: 25,
  initial_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const PaidWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { t } = useTranslation();
  const [query, setQuery] = useState<paidWithdrawalsRowsQuery>(INITIAL_QUERY);
  const {
    PaidWithdrawalsTotal,
    isPaidWithdrawalsTotalFetching,
    refetchPaidWithdrawalsTotal,
    PaidWithdrawalsTotalError,
  } = useGetTotalPaidWithdrawals(query);

  const {
    paidWithdrawalsRows,
    isPaidWithdrawalsRowsFetching,
    refetchPaidWithdrawalsTotalRows,
    paidWithdrawalsRowsError,
  } = useGetRowsPaidWithdrawals(query);

  const { fields } = useGetPaidWithdrawReportFields();

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
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

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "partner_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "small_date" },
    { name: "delivered_at", type: "small_date" },
    { name: "receiver_name", type: "text" },
    { name: "receiver_document", type: "document" },
    { name: "pix_type", head: "pix_type", type: "pix_type" },
    { name: "pix_key", type: "text" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    refetchPaidWithdrawalsTotalRows();
    refetchPaidWithdrawalsTotal();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      {permissions.report.withdraw.paid_withdraw
        .report_withdraw_paid_withdraw_list_totals && (
        <TotalizersCards
          data={PaidWithdrawalsTotal}
          fetchData={() => {
            refetchPaidWithdrawalsTotal();
            refetchPaidWithdrawalsTotalRows();
          }}
          loading={isPaidWithdrawalsTotalFetching}
          query={query}
        />
      )}

      {permissions.report.deposit.generated_deposit
        .report_deposit_generated_deposit_list_totals &&
        !isPaidWithdrawalsTotalFetching &&
        PaidWithdrawalsTotalError && (
          <Col span={24}>
            {PaidWithdrawalsTotalError?.response?.data?.status == 500 ? (
              <Alert
                message={`${t("table.error")}:`}
                description={t(`error.500`)}
                type="error"
                closable
                onClose={() => {
                  refetchPaidWithdrawalsTotal();
                }}
              />
            ) : (
              <Alert
                message={`${t("table.error")}:`}
                description={t(
                  `error.${
                    (ErrorList as any)[
                      PaidWithdrawalsTotalError?.response?.data?.message
                    ]
                  }`
                )}
                type="error"
                closable
                onClose={() => {
                  refetchPaidWithdrawalsTotal();
                }}
              />
            )}
          </Col>
        )}

      <Row
        align="middle"
        justify="start"
        gutter={[8, 8]}
        style={{ width: "100%" }}
      >
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={
              isPaidWithdrawalsRowsFetching || isPaidWithdrawalsTotalFetching
            }
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
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
        </Col>
      </Row>

      <Row
        align="middle"
        justify="start"
        style={{ width: "100%" }}
        gutter={[8, 8]}
      >
        <Col xs={{ span: 24 }} md={{ span: 18 }} lg={{ span: 9 }}>
          {!isMobile ? (
            <Space.Compact style={{ width: "100%" }} size="large">
              <Select
                allowClear
                onClear={() => {
                  delete query.organization_id;
                  delete query.endToEndId;
                  delete query.payment_id;
                  delete query.reference_id;
                  delete query.receiver_document;
                  delete query.receiver_name;
                  delete query.description;
                  delete query.withdraw_id;
                }}
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
                      "endToEndId",
                      "payment_id",
                      "reference_id",
                      "receiver_document",
                    ].includes(value)
                  ) {
                    delete query.initial_date;
                    delete query.final_date;
                  } else if (!query.initial_date && !query.final_date) {
                    setQuery((state) => ({
                      ...state,
                      initial_date: moment(new Date())
                        .startOf("day")
                        .utc()
                        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                      final_date: moment(new Date())
                        .add(1, "day")
                        .startOf("day")
                        .utc()
                        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
              <Search
                query={query}
                setQuery={setQuery}
                searchOption={searchOption}
              />
            </Space.Compact>
          ) : (
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
                    "endToEndId",
                    "payment_id",
                    "reference_id",
                    "receiver_document",
                  ].includes(value)
                ) {
                  delete query.initial_date;
                  delete query.final_date;
                } else if (!query.initial_date && !query.final_date) {
                  setQuery((state) => ({
                    ...state,
                    initial_date: moment(new Date())
                      .startOf("day")
                      .utc()
                      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                    final_date: moment(new Date())
                      .add(1, "day")
                      .startOf("day")
                      .utc()
                      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
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
          )}
        </Col>
        {isMobile && (
          <Col xs={{ span: 24 }}>
            <Search
              query={query}
              setQuery={setQuery}
              searchOption={searchOption}
            />
          </Col>
        )}

        <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 4 }}>
          <Button
            size="large"
            type="dashed"
            loading={isPaidWithdrawalsRowsFetching}
            danger
            onClick={() => {
              setSearchOption(undefined);
              setQuery(INITIAL_QUERY);
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
        </Col>
        {permissions.report.withdraw.generated_withdraw
          .report_withdraw_generated_withdraw_resend_notification && (
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
            <Button
              type="primary"
              loading={isPaidWithdrawalsRowsFetching}
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
          </Col>
        )}

        {permissions.report.withdraw.paid_withdraw
          .report_withdraw_paid_withdraw_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
            <Tooltip
              placement="topRight"
              title={
                paidWithdrawalsRows?.items.length === 0 ||
                paidWithdrawalsRowsError
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
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                CSV
              </Button>
            </Tooltip>
          </Col>
        )}
      </Row>

      <Row style={{ width: "100%" }}>
        <Col xs={24}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={paidWithdrawalsRows}
            items={paidWithdrawalsRows?.items}
            columns={columns}
            loading={isPaidWithdrawalsRowsFetching}
            error={paidWithdrawalsRowsError}
            refetch={() => {
              refetchPaidWithdrawalsTotalRows();
              refetchPaidWithdrawalsTotal();
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
        </Col>
      </Row>

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

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        id={currentItem?._id}
      />

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
          gender: ["MALE", "FEMALE", "OTHER"],
        }}
        startDateKeyName="initial_date"
        endDateKeyName="final_date"
        initialQuery={INITIAL_QUERY}
      />
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
    </Row>
  );
};
