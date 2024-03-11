/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  ShopOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Search } from "@src/components/Inputs/search";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { useCreateDepositrefund } from "@src/services/consult/refund/refundDeposits/createRefund";
import { useGetRefundDepositsReportFields } from "@src/services/consult/refund/refundDeposits/getReportFields";
import { useUpatePayToMerchant } from "@src/services/consult/refund/refundDeposits/updateRefundToMerchant";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundDepositsReports } from "@src/services/reports/consult/refund/deposit/createRefundDepositReports";
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
import { useGetRowsRefundDeposits } from "../../../../../../services/consult/refund/refundDeposits/getRows";
import { useGetTotalRefundDeposits } from "../../../../../../services/consult/refund/refundDeposits/getTotal";
import {
  refundDepositRowsItems,
  refundDepositsQuery,
} from "../../../../../../services/types/consult/refunds/refundsDeposits.interface";
import { ViewModal } from "../components/ViewModal";
import { TotalizersCards } from "./components/TotalizersCards";
import { ErrorList } from "@src/utils/errors";
import { usePayRefundToEndUser } from "@src/services/consult/refund/refundDeposits/payToEndUserRefund";

const INITIAL_QUERY: refundDepositsQuery = {
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

export const RefundDeposits = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundDepositsQuery>(INITIAL_QUERY);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const {
    refundDepositsTotal,
    isRefundDepositsTotalFetching,
    refetchRefundDepositsTotal,
    refundDepositsTotalError,
  } = useGetTotalRefundDeposits(query);

  const {
    refundDepositsRows,
    isRefundDepositsRowsFetching,
    refetchRefundDepositsTotalRows,
    refundDepositsRowsError,
  } = useGetRowsRefundDeposits(query);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isPayToMerchantModalOpen, setIsPayToMerchantModalOpen] =
    useState<boolean>(false);
  const [isPayToEndUserModalOpen, setIsPayToEndUserModalOpen] =
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
    PayRefundToEndUserIsLoading,
    PayRefundToEndUserMutate,
    PayRefundToEndUserSuccess,
    PayRefundToEndUsererror,
  } = usePayRefundToEndUser(currentItem?._id);

  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const { fields } = useGetRefundDepositsReportFields();

  const {
    RefundDepositsReportsError,
    RefundDepositsReportsIsLoading,
    RefundDepositsReportsIsSuccess,
    RefundDepositsReportsMutate,
  } = useCreateRefundDepositsReports({
    ...query,
    fields: { ...csvFields },
    comma_separate_value: isComma,
  });

  const columns: ColumnInterface[] = [
    { name: "pix_id", type: "id" },
    { name: "endToEndId", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "small_date" },
    { name: "pix_type", head: "payment_type", type: "pix_type" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "payer_document", type: "document" },
    { name: "reason", type: "text" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    refetchRefundDepositsTotal();
    refetchRefundDepositsTotalRows();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      <TotalizersCards
        data={refundDepositsTotal}
        fetchData={() => {
          refetchRefundDepositsTotal();
          refetchRefundDepositsTotalRows();
        }}
        loading={isRefundDepositsTotalFetching}
        query={query}
      />
      {permissions.report.deposit.generated_deposit
        .report_deposit_generated_deposit_list_totals &&
        !isRefundDepositsTotalFetching &&
        refundDepositsTotalError && (
          <Col span={24}>
            {refundDepositsTotalError?.response?.data?.status == 500 ? (
              <Alert
                message={`${t("table.error")}:`}
                description={t(`error.500`)}
                type="error"
                closable
                onClose={() => {
                  refetchRefundDepositsTotal();
                }}
              />
            ) : (
              <Alert
                message={`${t("table.error")}:`}
                description={t(
                  `error.${
                    (ErrorList as any)[
                      refundDepositsTotalError?.response?.data?.message
                    ]
                  }`
                )}
                type="error"
                closable
                onClose={() => {
                  refetchRefundDepositsTotal();
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
              isRefundDepositsRowsFetching || isRefundDepositsTotalFetching
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
                  delete query.txid;
                  delete query.rtrid;
                  delete query.buyer_document;
                  delete query.buyer_name;
                }}
                style={{ width: "60%" }}
                size="large"
                onChange={(value) => {
                  delete query.pix_id;
                  delete query.endToEndId;
                  delete query.txid;
                  delete query.rtrid;
                  delete query.buyer_document;
                  delete query.buyer_name;
                  if (
                    [
                      "pix_id",
                      "endToEndId",
                      "txid",
                      "rtrid",
                      "buyer_document",
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
                  { value: "txid", label: t("table.txid") },
                  { value: "rtrid", label: t("table.refund_id") },
                  { value: "payer_document", label: t("table.payer_document") },
                  { value: "buyer_document", label: t("table.buyer_document") },
                  { value: "buyer_name", label: t("table.buyer_name") },
                  { value: "payer_name", label: t("table.payer_name") },
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
                delete query.txid;
                delete query.rtrid;
                delete query.buyer_document;
                delete query.buyer_name;
              }}
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => {
                delete query.pix_id;
                delete query.endToEndId;
                delete query.txid;
                delete query.rtrid;
                delete query.buyer_document;
                delete query.buyer_name;
                if (
                  [
                    "pix_id",
                    "endToEndId",
                    "txid",
                    "rtrid",
                    "buyer_document",
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
                { value: "txid", label: t("table.txid") },
                { value: "rtrid", label: t("table.refund_id") },
                { value: "payer_document", label: t("table.payer_document") },
                { value: "buyer_document", label: t("table.buyer_document") },
                { value: "buyer_name", label: t("table.buyer_name") },
                { value: "payer_name", label: t("table.payer_name") },
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
            loading={isRefundDepositsRowsFetching}
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

        {permissions?.report?.chargeback?.deposit_chargeback
          ?.report_chargeback_deposit_chargeback_export_csv && (
          <Col xs={{ span: 24 }} md={{ span: 6 }} lg={{ span: 3 }}>
            <Tooltip
              placement="topLeft"
              title={
                refundDepositsRows?.items.length === 0 ||
                refundDepositsRowsError
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
                loading={isRefundDepositsRowsFetching}
                disabled={
                  !refundDepositsRows?.items.length || refundDepositsRowsError
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
            error={refundDepositsRowsError}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={refundDepositsRows}
            items={refundDepositsRows?.items}
            columns={columns}
            loading={isRefundDepositsRowsFetching}
            refetch={() => {
              refetchRefundDepositsTotalRows();
              refetchRefundDepositsTotal();
            }}
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
              permissions?.report?.chargeback?.deposit_chargeback
                ?.report_chargeback_deposit_chargeback_paid_to_merchant && {
                label: "pay_to_enduser",
                icon: <UserSwitchOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayToEndUserModalOpen(true),
                disabled: (item) =>
                  !["WAITING", "ERROR"].includes(item?.status),
              },
            ]}
            removeTotal
            label={["merchant_name", "status", "reason", "createdAt", "value"]}
          />
        </Col>
      </Row>

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!refundDepositsRows?.items.length || refundDepositsRowsError}
        mutateReport={() => RefundDepositsReportsMutate()}
        error={RefundDepositsReportsError}
        success={RefundDepositsReportsIsSuccess}
        loading={RefundDepositsReportsIsLoading}
        reportPath="/consult/refunds/refund_reports/refund_deposits_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="RefundDepositsReportsFields"
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
      {isPayToEndUserModalOpen && (
        <Confirmation
          open={isPayToEndUserModalOpen}
          setOpen={setIsPayToEndUserModalOpen}
          submit={PayRefundToEndUserMutate}
          title={t("actions.pay_to_enduser")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.pay_to_enduser").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={PayRefundToEndUserIsLoading}
        />
      )}

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        item={currentItem}
        type="Refund"
      />

      <FiltersModal
        maxRange
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
          "pix_type",
          "refund_reason",
          "state",
          "city",
          "gender",
          "age_start",
          "value_start",
        ]}
        refetch={refetchRefundDepositsTotalRows}
        selectOptions={{
          status: [
            "REFUNDED",
            "PAID_TO_MERCHANT",
            "ERROR",
            "PROCESSING",
            "WAITING",
          ],
          pix_type: ["STANDARD", "FASTPIX"],
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
      <Toast
        actionError={t("messages.refund")}
        actionSuccess={t("messages.refunded")}
        error={PayRefundToEndUsererror}
        success={PayRefundToEndUserSuccess}
      />
    </Row>
  );
};
