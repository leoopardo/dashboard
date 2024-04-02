/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, FileAddOutlined, FilterOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Search } from "@src/components/Inputs/search";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { useCreateWithdrawrefund } from "@src/services/consult/refund/refundWithdrawals/createRefund";
import { useGetRefundWithdrawalsReportFields } from "@src/services/consult/refund/refundWithdrawals/getReportFields";
import { useGetRowsRefundWithdrawals } from "@src/services/consult/refund/refundWithdrawals/getRows";
import { useGetTotalRefundWithdrawals } from "@src/services/consult/refund/refundWithdrawals/getTotal";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundWithdrawalsReports } from "@src/services/reports/consult/refund/withdrawals/createRefundWithdrawalsReports";
import { refundWithdrawalsQuery } from "@src/services/types/consult/refunds/refundWithdrawals.interface";
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
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";
import { ErrorList } from "@src/utils/errors";

const INITIAL_QUERY: refundWithdrawalsQuery = {
  page: 1,
  limit: 25,
  start_date: moment(new Date())
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const RefundWithdrawals = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
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

  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const { fields } = useGetRefundWithdrawalsReportFields();

  const {
    RefundWithdrawalsReportsError,
    RefundWithdrawalsReportsIsLoading,
    RefundWithdrawalsReportsIsSuccess,
    RefundWithdrawalsReportsMutate,
    RefundWithdrawalsReportsData,
  } = useCreateRefundWithdrawalsReports({
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
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);

  const { mutate, isLoading } = useCreateWithdrawrefund(currentItem?._id);

  const columns: ColumnInterface[] = [
    { name: "endToEndId", type: "id" },
    { name: "rtrId", head: "refund_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "createdAt", type: "small_date" },
    { name: "status", type: "transaction_status" },
    { name: "value", type: "value" },
    { name: "receiver", type: "transaction_person" },
  ];

  useEffect(() => {
    refetchRefundWithdrawalsTotal();
    refetchRefundWithdrawals();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      <TotalizersCards
        data={refundWithdrawalsTotal}
        fetchData={() => {
          refetchRefundWithdrawalsTotal();
          refetchRefundWithdrawals();
        }}
        loading={isRefundWithdrawalsTotalFetching}
        query={query}
      />

      {permissions?.report?.deposit?.generated_deposit
        ?.report_deposit_generated_deposit_list_totals &&
        !isRefundWithdrawalsTotalFetching &&
        refundWithdrawalsTotalError && (
          <Col span={24}>
            {refundWithdrawalsTotalError?.response?.data?.status == 500 ? (
              <Alert
                message={`${t("table.error")}:`}
                description={t(`error.500`)}
                type="error"
                closable
                onClose={() => {
                  refetchRefundWithdrawalsTotal();
                }}
              />
            ) : (
              <Alert
                message={`${t("table.error")}:`}
                description={t(
                  `error.${
                    (ErrorList as any)[
                      refundWithdrawalsTotalError?.response?.data?.message
                    ]
                  }`
                )}
                type="error"
                closable
                onClose={() => {
                  refetchRefundWithdrawalsTotal();
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
              isRefundWithdrawalsFetching || isRefundWithdrawalsTotalFetching
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
            initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate={
              !["pix_id", "endToEndId", "reference_id", "rtrid"].includes(
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
          {!isMobile ? (
            <Space.Compact style={{ width: "100%" }} size="large">
              <Select
                allowClear
                onClear={() => {
                  delete query.pix_id;
                  delete query.endToEndId;
                  delete query.rtrid;
                  delete query.reference_id;
                  delete query.receiver_document;
                  delete query.receiver_name;
                }}
                style={{ width: "100%", height: "35px" }}
                size="large"
                onChange={(value) => {
                  delete query.pix_id;
                  delete query.endToEndId;
                  delete query.rtrid;
                  delete query.reference_id;
                  delete query.receiver_document;
                  delete query.receiver_name;
                  if (
                    [
                      "pix_id",
                      "endToEndId",
                      "reference_id",
                      "rtrid",
                      "receiver_document",
                    ].includes(value)
                  ) {
                    delete query.start_date;
                    delete query.end_date;
                  } else if (!query.start_date && !query.end_date) {
                    setQuery((state) => ({
                      ...state,
                      start_date: moment(new Date())
                        .startOf("day")
                        .utc()
                        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                      end_date: moment(new Date())
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
                  { value: "rtrid", label: t("table.refund_id") },
                  { value: "reference_id", label: t("table.reference_id") },
                  {
                    value: "receiver_document",
                    label: t("table.receiver_document"),
                  },
                  { value: "receiver_name", label: t("table.receiver_name") },
                ]}
              />{" "}
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
                delete query.rtrid;
                delete query.reference_id;
                delete query.receiver_document;
                delete query.receiver_name;
              }}
              style={{ width: "100%", height: "35px" }}
              size="large"
              onChange={(value) => {
                delete query.pix_id;
                delete query.endToEndId;
                delete query.rtrid;
                delete query.reference_id;
                delete query.receiver_document;
                delete query.receiver_name;
                if (
                  [
                    "pix_id",
                    "endToEndId",
                    "reference_id",
                    "rtrid",
                    "receiver_document",
                  ].includes(value)
                ) {
                  delete query.start_date;
                  delete query.end_date;
                } else if (!query.start_date && !query.end_date) {
                  setQuery((state) => ({
                    ...state,
                    start_date: moment(new Date())
                      .startOf("day")
                      .utc()
                      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                    end_date: moment(new Date())
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
                { value: "rtrid", label: t("table.refund_id") },
                { value: "reference_id", label: t("table.reference_id") },
                {
                  value: "receiver_document",
                  label: t("table.receiver_document"),
                },
                { value: "receiver_name", label: t("table.receiver_name") },
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
            loading={isRefundWithdrawalsFetching}
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

        {permissions?.report?.chargeback?.deposit_chargeback
          ?.report_chargeback_deposit_chargeback_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
            <Tooltip
              placement="topLeft"
              title={
                refundWithdrawals?.items.length === 0 || refundWithdrawalsError
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
                loading={isRefundWithdrawalsFetching}
                disabled={
                  !refundWithdrawals?.items.length || refundWithdrawalsError
                }
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
            data={refundWithdrawals}
            items={refundWithdrawals?.items}
            columns={columns}
            loading={isRefundWithdrawalsFetching}
            error={refundWithdrawalsError}
            refetch={() => {
              refetchRefundWithdrawals();
              refetchRefundWithdrawalsTotal();
            }}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsRefundModalOpen(true),
                disabled: (item) =>
                  !permissions?.report?.chargeback?.withdraw_chargeback
                    ?.report_chargeback_withdraw_chargeback_paid_to_merchant &&
                  !["WAITING", "ERROR"].includes(item?.status),
              },
            ]}
            removeTotal
            label={["bank", "merchant_name", "status", "createdAt", "value"]}
          />
        </Col>
      </Row>

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!refundWithdrawals?.items.length || refundWithdrawalsError}
        mutateReport={() => RefundWithdrawalsReportsMutate()}
        error={RefundWithdrawalsReportsError}
        success={RefundWithdrawalsReportsIsSuccess}
        loading={RefundWithdrawalsReportsIsLoading}
        reportPath="/consult/refunds/refund_reports/refund_withdrawals_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="RefundWithdrawalsReportsFields"
        url={RefundWithdrawalsReportsData?.url}
      />

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        item={currentItem}
        type="withdraw"
      />

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

      <FiltersModal
        maxRange
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        haveInitialDate={
          !["pix_id", "endToEndId", "reference_id", "rtrid"].includes(
            searchOption as any
          )
        }
        filters={[
          "start_date",
          "end_date",
          "status",
          "merchant_id",
          "aggregator_id",
          "aggregator_id",
          "operator_id",
          "refund_reason",
        ]}
        refetch={refetchRefundWithdrawalsTotal}
        selectOptions={{
          status: ["REFUND_TO_MERCHANT", "ERROR", "PROCESSING", "WAITING"],
          gender: ["MALE", "FEMALE", "OTHER"],
          refund_reason: [
            "DIVERGENT VALUE",
            "PAYMENT FROM QR CODE EXPIRED",
            "PAYMENT REFUND: THIRD PARTY PAYMENT UNAVAILABLE",
            "PAYMENT REFUND: CNPJ NOT ACCEPTED",
            "DAILY TRANSACTION LIMIT EXCEEDED FOR THIS CLIENT",
            "MONTH TRANSACTION LIMIT EXCEEDED FOR THIS CLIENT",
            "DAILY TRANSACTION TO THIRD LIMIT EXCEEDED FOR THIS CLIENT",
            "DAILY TRANSACTION LIMIT EXCEEDED FOR THIS CNPJ",
            "PAYER IRREGULAR DOCUMENT, PLEASE CONTACT SUPPORT TO REGULARIZE DOCUMENT",
            "PAYER UNDERAGE",
            "PAYER BLOCKED BY MERCHANT",
            "PAYMENT REPEATED TO SAME QRCODE",
          ],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />
    </Row>
  );
};
