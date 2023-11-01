/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EyeFilled,
  FileAddOutlined,
  SettingFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Tooltip } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { useCreateSendWebhook } from "@src/services/consult/deposits/generatedDeposits/resendWebhook";
import { useGetDepositReportFields } from "@src/services/consult/deposits/reportCsvFields/getReportFields";
import { queryClient } from "@src/services/queryClient";
import { useCreateGeneratedDepositsReports } from "@src/services/reports/consult/deposits/createGeneratedDepositsReports";
import { ResendWebhookBody } from "@src/services/types/consult/deposits/createResendWebhook.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Col, Row, Select, Space } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
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
import { TotalizersCards } from "./components/TotalizersCards";
import { useCheckPayment } from "@src/services/consult/deposits/generatedDeposits/checkPayment";

const INITIAL_QUERY: generatedDepositTotalQuery = {
  page: 1,
  limit: 25,
  status: "PAID",
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

export const GeneratedDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { t } = useTranslation();
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const { depositsTotal, isDepositsTotalFetching, refetchDepositsTotal } =
    useGetTotalGeneratedDeposits(query);

  const {
    depositsRows,
    depositsRowsError,
    isDepositsRowsFetching,
    refetchDepositsTotalRows,
  } = useGetRowsGeneratedDeposits(query);



  useEffect(() => {
    refetchDepositsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState<boolean>(false);
  const [isResendWebhookModalOpen, setIsResendWebhookModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  console.log({currentItem})
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const {
    GeneratedDepositsReportsError,
    GeneratedDepositsReportsIsLoading,
    GeneratedDepositsReportsIsSuccess,
    GeneratedDepositsReportsMutate,
  } = useCreateGeneratedDepositsReports({
    ...query,
    fields: { ...csvFields },
    comma_separate_value: isComma,
  });

  const {
    checkPaymentError,
    checkPaymentSuccess,
    isCheckPaymentFetching,
    refetchCheckPayment,
  } = useCheckPayment({txid: currentItem?.txid});
  const { fields } = useGetDepositReportFields();

  const [webhookBody, setWebhookBody] = useState<ResendWebhookBody>({
    start_date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    merchant_id: undefined,
    partner_id: undefined,
    webhook_url_type: "both",
  });

  const { ResendWebMutate, ResendWebError, ResendWebIsSuccess } =
    useCreateSendWebhook(webhookBody);

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
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      {permissions.report.deposit.generated_deposit
        .report_deposit_generated_deposit_list_totals && (
        <TotalizersCards
          data={depositsTotal}
          fetchData={() => {
            refetchDepositsTotal();
          }}
          loading={isDepositsTotalFetching}
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
            loading={isDepositsRowsFetching || isDepositsTotalFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
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
                    ["pix_id", "endToEndId", "txid", "reference_id"].includes(
                      value
                    )
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
            loading={isDepositsRowsFetching}
            danger
            size="large"
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
        </Col>
        {permissions.report.deposit.generated_deposit
          .report_deposit_generated_deposit_resend_notification && (
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
            <Button
              type="primary"
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
            >
              {t("modal.resend_webhook")}
            </Button>
          </Col>
        )}

        {permissions.report.deposit.generated_deposit
          .report_deposit_generated_deposit_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
            <Tooltip
              placement="top-end"
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
                shape="round"
                type="dashed"
                size="large"
                loading={GeneratedDepositsReportsIsLoading}
                disabled={!depositsRows?.items.length || depositsRowsError}
              >
                <FileAddOutlined style={{ fontSize: 22 }} /> CSV
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
            data={depositsRows}
            items={depositsRows?.items}
            error={depositsRowsError}
            columns={columns}
            loading={isDepositsRowsFetching}
            refetch={() => {
              refetchDepositsTotalRows();
              refetchDepositsTotal();
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
              {
                label: "check_payments",
                disabled: (item) =>
                  !["WAITING", "EXPIRED"].includes(item?.status),
                icon: <CheckCircleOutlined style={{ fontSize: "18px" }} />,
                onClick: () => refetchCheckPayment(),
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
        </Col>
      </Row>
      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          id={currentItem?._id}
        />
      )}
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
      />

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
      {isResendWebhookModalOpen && (
        <ResendWebhookModal
          open={isResendWebhookModalOpen}
          setOpen={setIsResendWebhookModalOpen}
          body={webhookBody}
          setBody={setWebhookBody}
          submit={ResendWebMutate}
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
