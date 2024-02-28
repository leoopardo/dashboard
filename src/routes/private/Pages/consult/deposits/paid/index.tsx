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
import { useCreateSendWebhook } from "@src/services/consult/deposits/generatedDeposits/resendWebhook";
import { useGetPaidDepositReportFields } from "@src/services/consult/deposits/paidDeposits/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreatePaidDepositsReports } from "@src/services/reports/consult/deposits/createPaidDepositsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Col, Row, Select, Space, Tooltip } from "antd";
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
import { useGetRowsPaidDeposits } from "../../../../../../services/consult/deposits/paidDeposits/getRows";
import { useGetTotalPaidDeposits } from "../../../../../../services/consult/deposits/paidDeposits/getTotal";
import { paidDepositRowsQuery } from "../../../../../../services/types/consult/deposits/PaidDeposits.interface";
import { ResendWebhookModal } from "../components/ResendWebhookModal";
import { ViewModal } from "../components/ViewModal";
import { WebhookModal } from "../components/webhooksModal";
import { TotalizersCards } from "./components/TotalizersCards";

const INITIAL_QUERY: paidDepositRowsQuery = {
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

export const PaidDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { t } = useTranslation();
  const [query, setQuery] = useState<paidDepositRowsQuery>(INITIAL_QUERY);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const { paidTotal, isPaidTotalFetching, refetchPaidTotal } =
    useGetTotalPaidDeposits(query);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const { paidRows, isPaidRowsFetching, refetchPaidTotalRows, paidRowsError } =
    useGetRowsPaidDeposits(query);

  const { fields } = useGetPaidDepositReportFields();

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
    useCreateSendWebhook(webhookBody, webhookId);

  const {
    PaidDepositsReportsError,
    PaidDepositsReportsIsLoading,
    PaidDepositsReportsIsSuccess,
    PaidDepositsReportsMutate,
  } = useCreatePaidDepositsReports({
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

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "partner_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "small_date" },
    { name: "delivered_at", type: "small_date" },
    { name: "pix_type", head: "pix_type", type: "pix_type" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "status" },
    { name: "deadline", type: "deadline" },
  ];

  useEffect(() => {
    refetchPaidTotalRows();
    refetchPaidTotal();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      {permissions.report.deposit.paid_deposit
        .report_deposit_paid_deposit_list_totals && (
        <TotalizersCards
          data={paidTotal}
          fetchData={() => {
            refetchPaidTotal();
            refetchPaidTotalRows();
          }}
          loading={isPaidTotalFetching}
          query={query}
        />
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
            loading={isPaidRowsFetching || isPaidTotalFetching}
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
              !["pix_id", "endToEndId", "txid", "reference_id"].includes(
                searchOption as any
              )
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
          {!isMobile && (
            <Space.Compact style={{ width: "100%" }} size="large">
              <Select
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
                  } else {
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
              />{" "}
              <Search
                query={query}
                setQuery={setQuery}
                searchOption={searchOption}
              />
            </Space.Compact>
          )}
          {isMobile && (
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
                } else {
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
            type="dashed"
            loading={isPaidRowsFetching}
            danger
            onClick={() => {
              setSearchOption(undefined);
              setQuery(INITIAL_QUERY);
            }}
            style={{
              height: 40,
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
        {permissions.report.deposit.generated_deposit
          .report_deposit_generated_deposit_resend_notification && (
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
            <Button
              disabled={paidRows?.items.length === 0 || paidRowsError}
              type="primary"
              loading={isPaidRowsFetching}
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

        {permissions.report.deposit.paid_deposit
          .report_deposit_paid_deposit_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
            <Tooltip
              placement="topRight"
              title={
                paidRows?.items.length === 0 || paidRowsError
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
                loading={isPaidRowsFetching}
                disabled={paidRows?.items.length === 0 || paidRowsError}
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
            data={paidRows}
            items={paidRows?.items}
            columns={columns}
            loading={isPaidRowsFetching}
            error={paidRowsError}
            refetch={() => {
              refetchPaidTotalRows();
              refetchPaidTotal();
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

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        id={currentItem?._id}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!paidRows?.items.length || paidRowsError}
        mutateReport={() => PaidDepositsReportsMutate()}
        error={PaidDepositsReportsError}
        success={PaidDepositsReportsIsSuccess}
        loading={PaidDepositsReportsIsLoading}
        reportPath="/consult/deposit/deposits_reports/paid_deposits_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="paidDepositsReportsFields"
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
          "partner_id",
          "merchant_id",
          "aggregator_id",
          "operator_id",
          "bank",
          "payer_bank",
          "pix_type",
          "state",
          "city",
          "gender",
          "age_start",
          "value_start",
        ]}
        refetch={refetchPaidTotalRows}
        selectOptions={{
          gender: ["MALE", "FEMALE", "OTHER"],
          pix_type: ["STANDARD", "FASTPIX"],
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
