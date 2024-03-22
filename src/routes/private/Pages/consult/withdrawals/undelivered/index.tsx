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
import { useGetRowsGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getRows";
import { useGetTotalGeneratedWithdrawals } from "@src/services/consult/withdrawals/generatedWithdrawals/getTotal";
import { useCreateSendWithdrawWebhook } from "@src/services/consult/withdrawals/generatedWithdrawals/resendWebhook";
import { useGetWithdrawReportFields } from "@src/services/consult/withdrawals/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedWithdrawalsReports } from "@src/services/reports/consult/withdrawals/generated/createGeneratedWithdrawalsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Alert, Button, Col, Row, Select, Space, Tabs, Tooltip } from "antd";
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
import { generatedWithdrawalsRowsQuery } from "../../../../../../services/types/consult/withdrawals/generatedWithdrawals.interface";
import { ResendWebhookModal } from "../../deposits/components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "./components/TotalizersCards";
import { ErrorList } from "@src/utils/errors";

const INITIAL_QUERY: generatedWithdrawalsRowsQuery = {
  page: 1,
  limit: 25,
  delivered_at: "false",
  initial_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  status: "PAID",
};

export const UndeliveredWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { t } = useTranslation();
  const [query, setQuery] =
    useState<generatedWithdrawalsRowsQuery>(INITIAL_QUERY);
  const {
    WithdrawalsTotal,
    isWithdrawalsTotalFetching,
    refetchWithdrawalsTotal,
    WithdrawalsTotalError,
  } = useGetTotalGeneratedWithdrawals(query);

  const {
    witrawalsRows,
    isWithdrawalsRowsFetching,
    refetchWithdrawalsTotalRows,
    witrawalsRowsError,
  } = useGetRowsGeneratedWithdrawals(query);

  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const { fields } = useGetWithdrawReportFields();

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

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

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
  const {
    ResendWebMutate,
    ResendWebError,
    ResendWebIsSuccess,
    ResendWebIsLoading,
  } = useCreateSendWithdrawWebhook(webhookBody, webhookId);

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
    { name: "pix_type", head: "payment_type", type: "pix_type" },
    { name: "pix_key", type: "text" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    refetchWithdrawalsTotalRows();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      {permissions?.report?.withdraw?.undelivered_withdraw
        ?.report_withdraw_undelivered_withdraw_list_totals && (
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

      {permissions?.report?.deposit?.generated_deposit
        ?.report_deposit_generated_deposit_list_totals &&
        !isWithdrawalsTotalFetching &&
        WithdrawalsTotalError && (
          <Col span={24}>
            {WithdrawalsTotalError?.response?.data?.status == 500 ? (
              <Alert
                message={`${t("table.error")}:`}
                description={t(`error.500`)}
                type="error"
                closable
                onClose={() => {
                  refetchWithdrawalsTotal();
                }}
              />
            ) : (
              <Alert
                message={`${t("table.error")}:`}
                description={t(
                  `error.${
                    (ErrorList as any)[
                      WithdrawalsTotalError?.response?.data?.message
                    ]
                  }`
                )}
                type="error"
                closable
                onClose={() => {
                  refetchWithdrawalsTotal();
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
            loading={isWithdrawalsRowsFetching || isWithdrawalsTotalFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 20 }}>
          <FilterChips initial_query={INITIAL_QUERY}
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
                      "withdraw_id",
                    ].includes(value)
                  ) {
                    delete query.initial_date;
                    delete query.final_date;
                  }
                  if (!query.initial_date && !query.final_date) {
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
                  {
                    value: "organization_id",
                    label: t("table.organization_id"),
                  },
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
              <Search
                query={query}
                setQuery={setQuery}
                searchOption={searchOption}
              />
            </Space.Compact>
          ) : (
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
                    "withdraw_id",
                  ].includes(value)
                ) {
                  delete query.initial_date;
                  delete query.final_date;
                }
                if (!query.initial_date && !query.final_date) {
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
        </Col>

        {permissions?.report?.withdraw?.undelivered_withdraw
          ?.report_withdraw_undelivered_withdraw_resend_notification && (
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
            <Button
              disabled={witrawalsRows?.items.length === 0 || witrawalsRowsError}
              type="primary"
              loading={isWithdrawalsTotalFetching || ResendWebIsLoading}
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
        {permissions?.report?.withdraw?.undelivered_withdraw
          ?.report_withdraw_undelivered_withdraw_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
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
          </Col>
        )}
      </Row>

      <Row style={{ width: "100%" }}>
        <Col xs={24}>
          <Tabs
            defaultActiveKey="1"
            onChange={(active) => {
              active === "1"
                ? setQuery((state) => ({
                    ...state,
                    delivered_at_secondary: undefined,
                    delivered_at: "false",
                  }))
                : setQuery((state) => ({
                    ...state,
                    delivered_at_secondary: "false",
                    delivered_at: undefined,
                  }));
            }}
            items={[
              {
                key: "1",
                label: t("table.webhook_url"),
                children: (
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
                      permissions?.report?.deposit?.paid_deposit
                        ?.report_deposit_paid_deposit_resend_notification && {
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
                    ]}
                  />
                ),
              },
              {
                key: "2",
                label: t("table.webhook_url_optional"),
                children: (
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
                      permissions?.report?.deposit?.paid_deposit
                        ?.report_deposit_paid_deposit_resend_notification && {
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
                    ]}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>

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

      {isWebhookModalOpen && (
        <WebhookModal
          open={isWebhookModalOpen}
          setOpen={setIsWebhookModalOpen}
          id={currentItem?._id}
        />
      )}
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
