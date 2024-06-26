/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EyeFilled,
  FileAddOutlined,
  SendOutlined,
  SettingFilled
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { useTotalizer } from "@src/contexts/totalizerContext";
import { useCreateSendWebhook } from "@src/services/consult/deposits/generatedDeposits/resendWebhook";
import { useGetDepositReportFields } from "@src/services/consult/deposits/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedDepositsReports } from "@src/services/reports/consult/deposits/createGeneratedDepositsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { ErrorList } from "@src/utils/errors";
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
import { useGetRowsGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getRows";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/consult/deposits/generatedDeposits/getTotal";
import { generatedDepositTotalQuery } from "../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import { ResendWebhookModal } from "../components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "../generated/components/TotalizersCards";

const INITIAL_QUERY: generatedDepositTotalQuery = {
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

export const UndeliveredDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { t } = useTranslation();
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const {
    depositsTotal,
    isDepositsTotalFetching,
    refetchDepositsTotal,
    depositsTotalError,
  } = useGetTotalGeneratedDeposits(query);

  const {
    depositsRows,
    isDepositsRowsFetching,
    refetchDepositsTotalRows,
    depositsRowsError,
  } = useGetRowsGeneratedDeposits(query);

  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const { fields } = useGetDepositReportFields();
  const {
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsIsSuccess,
    GeneratedDepositsReportsMutate,
    GeneratedDepositsReportsData,
  } = useCreateGeneratedDepositsReports({
    ...query,
    fields: { ...csvFields },
    comma_separate_value: isComma,
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const [webhookBody, setWebhookBody] = useState<ResendWebhookBody>({
    start_date: moment(new Date()).subtract(1, "day").startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date()).startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    merchants_ids: undefined,
    partners_ids: undefined,
    webhook_url_type: "both",
    delivered_at: false
  });
  const [webhookId, setWebhookId] = useState<string>("");

  const { ResendWebMutate, ResendWebError, ResendWebIsSuccess } =
    useCreateSendWebhook(webhookBody, webhookId);
  const { setTotalizer } = useTotalizer();

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "partner_name", type: "text" },
    { name: "createdAt", type: "small_date" },
    { name: "status", type: "transaction_status" },
    { name: "delivered_at", head: "webhook", type: "webhook_status" },
    { name: "value", type: "value" },
    { name: "pix_type", head: "pix_type", type: "pix_type" },
    { name: "buyer", type: "transaction_person" },
  ];

  useEffect(() => {
    refetchDepositsTotalRows();
    refetchDepositsTotal();
  }, [query, GeneratedDepositsReportsData]);

  useEffect(() => {
    if (
      permissions?.report?.deposit?.generated_deposit
        ?.report_deposit_generated_deposit_list_totals &&
      depositsTotal
    )
      setTotalizer(
        <TotalizersCards
          data={depositsTotal}
          fetchData={() => {
            refetchDepositsTotal();
          }}
          loading={isDepositsTotalFetching}
          query={query}
          setIsFiltersOpen={setIsFiltersOpen}
        />
      );

    return () => {
      setTotalizer(undefined);
    };
  }, [depositsTotal, query, isDepositsTotalFetching]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "8px" }}
    >
      <Row
        gutter={[8, 8]}
        align="middle"
        justify="center"
        style={{ width: "100%", padding: 16 }}
      >
        {permissions?.report?.deposit?.generated_deposit
          ?.report_deposit_generated_deposit_list_totals &&
          !isDepositsTotalFetching &&
          depositsTotalError && (
            <Col span={24}>
              {depositsTotalError?.response?.data?.status == 500 ? (
                <Alert
                  message={`${t("table.error")}:`}
                  description={t(`error.500`)}
                  type="error"
                  closable
                  onClose={() => {
                    refetchDepositsTotal();
                  }}
                />
              ) : (
                <Alert
                  message={`${t("table.error")}:`}
                  description={t(
                    `error.${
                      (ErrorList as any)[
                        depositsTotalError?.response?.data?.message
                      ]
                    }`
                  )}
                  type="error"
                  closable
                  onClose={() => {
                    refetchDepositsTotal();
                  }}
                />
              )}
            </Col>
          )}

        <Row
          align="middle"
          justify="start"
          style={{ width: "100%" }}
          gutter={[8, 8]}
        >
          <Col xs={{ span: 24 }} md={{ span: 18 }} lg={{ span: 13 }}>
            {!isMobile ? (
              <Space.Compact style={{ width: "100%" }} size="large">
                <Select
                  allowClear
                  onClear={() => {
                    delete query.pix_id;
                    delete query.endToEndId;
                    delete query.txid;
                    delete query.reference_id;
                    delete query.payer_document;
                    delete query.buyer_document;
                    delete query.buyer_name;
                    delete query.payer_name;
                    delete query.description;
                  }}
                  style={{ width: "60%" }}
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
                      [
                        "pix_id",
                        "endToEndId",
                        "txid",
                        "reference_id",
                        "payer_document",
                        "buyer_document",
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
                    { value: "pix_id", label: t("table.pix_id") },
                    { value: "endToEndId", label: t("table.endToEndId") },
                    {
                      value: "payer_document",
                      label: t("table.payer_document"),
                    },
                    {
                      value: "buyer_document",
                      label: t("table.buyer_document"),
                    },
                    { value: "buyer_name", label: t("table.buyer_name") },
                    { value: "payer_name", label: t("table.payer_name") },
                    { value: "txid", label: t("table.txid") },
                    { value: "reference_id", label: t("table.reference_id") },
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
                  delete query.pix_id;
                  delete query.endToEndId;
                  delete query.txid;
                  delete query.reference_id;
                  delete query.payer_document;
                  delete query.buyer_document;
                  delete query.buyer_name;
                  delete query.payer_name;
                  delete query.description;
                }}
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
                    [
                      "pix_id",
                      "endToEndId",
                      "txid",
                      "reference_id",
                      "payer_document",
                      "buyer_document",
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
              type="default"
              loading={isDepositsRowsFetching}
              danger
              onClick={() => {
                setSearchOption(undefined);
                setQuery(INITIAL_QUERY);
                refetchDepositsTotalRows();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
              icon={<FilterAltOffOutlinedIcon />}
            >
              {t("table.clear_filters")}
            </Button>
          </Col>

          {permissions?.report?.deposit?.generated_deposit
            ?.report_deposit_generated_deposit_resend_notification && (
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
              <Button
                disabled={depositsRows?.items.length === 0 || depositsRowsError}
                type="default"
                loading={isDepositsRowsFetching}
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
          {permissions?.report?.deposit?.undelivered_deposit
            ?.report_deposit_undelivered_deposit_export_csv && (
            <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
              <Tooltip
                placement="topLeft"
                title={
                  depositsRows?.items.length === 0 || depositsRowsError
                    ? t("messages.no_records_to_export")
                    : t("messages.export_csv")
                }
                arrow
              >
                <Button
                  onClick={() => setIsExportReportsOpen(true)}
                  style={{ width: "100%" }}
                  type="default"
                  size="large"
                  loading={GeneratedDepositsReportsIsLoading}
                  disabled={!depositsRows?.items.length || depositsRowsError}
                  icon={<FileAddOutlined style={{ fontSize: 22 }} />}
                >
                  CSV
                </Button>
              </Tooltip>
            </Col>
          )}
        </Row>
        <Row
          align="middle"
          justify="start"
          gutter={[8, 8]}
          style={{ width: "100%" }}
        >
          <Col xs={{ span: 24 }} md={{ span: 20 }}>
            <FilterChips
              initial_query={INITIAL_QUERY}
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
          </Col>
        </Row>
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
                    data={depositsRows}
                    items={depositsRows?.items}
                    columns={columns}
                    loading={isDepositsRowsFetching}
                    error={depositsRowsError}
                    refetch={() => {
                      refetchDepositsTotal();
                      refetchDepositsTotalRows();
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
                    data={depositsRows}
                    items={depositsRows?.items}
                    columns={columns}
                    loading={isDepositsRowsFetching}
                    error={depositsRowsError}
                    refetch={() => {
                      refetchDepositsTotal();
                      refetchDepositsTotalRows();
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
      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!depositsRows?.items.length || depositsRowsError}
        mutateReport={() => GeneratedDepositsReportsMutate()}
        error={GeneratedDepositsReportsError}
        success={GeneratedDepositsReportsIsSuccess}
        loading={GeneratedDepositsReportsIsLoading}
        reportPath="/consult/deposit/deposits_reports/generated_deposits_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="depositReportsFields"
        url={GeneratedDepositsReportsData?.url}
      />
    </Row>
  );
};
