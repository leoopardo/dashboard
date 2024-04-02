/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  ReloadOutlined,
  ShopOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Search } from "@src/components/Inputs/search";
import { Confirmation } from "@src/components/Modals/confirmation";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { useCreatePayToEndUserRefund } from "@src/services/consult/refund/refundDepositsManual/createPayToEndUser";
import { useCreatePayToMerchantRefund } from "@src/services/consult/refund/refundDepositsManual/createPayToMerchant";
import { useCreatePixManualRefund } from "@src/services/consult/refund/refundDepositsManual/createRefund";
import { useDeletePixManualRefund } from "@src/services/consult/refund/refundDepositsManual/deleteRefund";
import { useGetRefundStatusManual } from "@src/services/consult/refund/refundDepositsManual/getRefreshStatus";
import { useGetRefundManualReportFields } from "@src/services/consult/refund/refundDepositsManual/getReportFields";
import { useGetRefundDepositsManual } from "@src/services/consult/refund/refundDepositsManual/getRows";
import { useGetTotalRefundDepositManual } from "@src/services/consult/refund/refundDepositsManual/getTotal";
import { useUpdateMerchantRefund } from "@src/services/consult/refund/refundDepositsManual/updateMerchant";
import { queryClient } from "@src/services/queryClient";
import { useCreateRefundManualDepositsReports } from "@src/services/reports/consult/refund/manualDeposits/createRefundManualDepositReports";
import {
  UpdateMerchantRefundBody,
  refundManualDepositsQuery,
} from "@src/services/types/consult/refunds/refundmanualDeposits.interface";
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

const INITIAL_QUERY: refundManualDepositsQuery = {
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

export const RefundDepositsManual = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundManualDepositsQuery>(INITIAL_QUERY);
  const {
    isRefundDepositManualTotalFetching,
    refetchRefundDepositManualTotal,
    refundDepositManualTotal,
    refundDepositManualTotalError,
  } = useGetTotalRefundDepositManual(query);

  const {
    isRefundDepositsManualFetching,
    refetchRefundDepositsManual,
    refundDepositsManual,
    refundDepositsManualError,
  } = useGetRefundDepositsManual(query);

  const [csvFields, setCsvFields] = useState<any>();
  const [isComma, setIsComma] = useState<boolean>(true);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const { fields } = useGetRefundManualReportFields();
  const {
    RefundManualDepositsReportsError,
    RefundManualDepositsReportsIsLoading,
    RefundManualDepositsReportsIsSuccess,
    RefundManualDepositsReportsMutate,
    RefundManualDepositsReportsData,
  } = useCreateRefundManualDepositsReports({
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
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isPayMerchantModalOpen, setIsPayMerchantModalOpen] =
    useState<boolean>(false);
  const [isPayEndUserModalOpen, setIsPayEndUserModalOpen] =
    useState<boolean>(false);
  const [isUpdateMerchantModalOpen, setIsUpdateMerchantModalOpen] =
    useState<boolean>(false);
  const [updateBody, setUpdateBody] = useState<UpdateMerchantRefundBody>({
    merchant_name: currentItem?.merchant_id,
  });
  const { mutate, isLoading } = useCreatePixManualRefund(currentItem?._id);
  const { isPayToMerchantLoading, mutatePayToMerchant } =
    useCreatePayToMerchantRefund(currentItem?.endToEndId);
  const { isPayToEndUserLoading, mutatePayToEndUser } =
    useCreatePayToEndUserRefund(currentItem?.endToEndId);
  const { isDeleteLoading, mutateDelete } = useDeletePixManualRefund(
    currentItem?._id
  );
  const { refetchRefundStatusManual, isRefundStatusManualFetching } =
    useGetRefundStatusManual(currentItem?.endToEndId);

  const {
    mutateUpdateMerchant,
    UpdateMerchantError,
    isUpdateMerchantLoading,
    isUpdateMerchantSuccess,
  } = useUpdateMerchantRefund({
    ...updateBody,
    endToEndId: currentItem?.endToEndId,
  });

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "endToEndId", type: "id" },
    { name: "rtrId", head: "refund_id", type: "id" },
    { name: "bank", type: "bankNameToIcon" },
    { name: "merchant_name", type: "text" },
    { name: "createdAt", type: "small_date" },
    { name: "status", type: "transaction_status" },
    { name: "value", type: "value" },
    { name: "pix_type", type: "pix_type" },
    { name: "reason", type: "text" },
    { name: "payer", type: "transaction_person" },
  ];

  useEffect(() => {
    refetchRefundDepositManualTotal();
    refetchRefundDepositsManual();
  }, [query]);

  return (
    <Row
      gutter={[8, 8]}
      align="middle"
      justify="center"
      style={{ padding: "25px" }}
    >
      <TotalizersCards
        data={refundDepositManualTotal}
        fetchData={() => {
          refetchRefundDepositManualTotal();
          refetchRefundDepositsManual();
        }}
        loading={isRefundDepositManualTotalFetching}
        query={query}
      />

      {permissions?.report?.deposit?.generated_deposit
        ?.report_deposit_generated_deposit_list_totals &&
        !isRefundDepositManualTotalFetching &&
        refundDepositManualTotalError && (
          <Col span={24}>
            {refundDepositManualTotalError?.response?.data?.status == 500 ? (
              <Alert
                message={`${t("table.error")}:`}
                description={t(`error.500`)}
                type="error"
                closable
                onClose={() => {
                  refetchRefundDepositManualTotal();
                }}
              />
            ) : (
              <Alert
                message={`${t("table.error")}:`}
                description={t(
                  `error.${
                    (ErrorList as any)[
                      refundDepositManualTotalError?.response?.data?.message
                    ]
                  }`
                )}
                type="error"
                closable
                onClose={() => {
                  refetchRefundDepositManualTotal();
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
              isRefundDepositsManualFetching ||
              isRefundDepositManualTotalFetching
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
            haveInitialDate
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
              {" "}
              <Select
                allowClear
                onClear={() => {
                  delete query.rtrid;
                  delete query.endToEndId;
                  delete query.payer_document;
                  delete query.payer_name;
                }}
                style={{ width: "100%", height: "35px" }}
                size="large"
                onChange={(value) => {
                  delete query.rtrid;
                  delete query.endToEndId;
                  delete query.payer_document;
                  delete query.payer_name;
                  if (
                    ["rtrid", "endToEndId", "payer_document"].includes(value)
                  ) {
                    delete query?.start_date;
                    delete query?.end_date;
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
                  { value: "rtrid", label: t("table.refund_id") },
                  { value: "endToEndId", label: t("table.endToEndId") },
                  { value: "payer_document", label: t("table.payer_document") },
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
                delete query.rtrid;
                delete query.endToEndId;
                delete query.payer_document;
                delete query.payer_name;
              }}
              style={{ width: "100%", height: "35px" }}
              size="large"
              onChange={(value) => {
                delete query.rtrid;
                delete query.endToEndId;
                delete query.payer_document;
                delete query.payer_name;
                if (["rtrid", "endToEndId", "payer_document"].includes(value)) {
                  delete query?.start_date;
                  delete query?.end_date;
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
                { value: "rtrid", label: t("table.refund_id") },
                { value: "endToEndId", label: t("table.endToEndId") },
                { value: "payer_document", label: t("table.payer_document") },
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
            type="dashed"
            loading={isRefundDepositsManualFetching}
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
                refundDepositsManual?.items.length === 0 ||
                refundDepositsManualError
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
                loading={isRefundDepositsManualFetching}
                disabled={
                  !refundDepositsManual?.items.length ||
                  refundDepositsManualError
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
            data={refundDepositsManual}
            items={refundDepositsManual?.items}
            columns={columns}
            loading={
              isRefundDepositsManualFetching || isRefundStatusManualFetching
            }
            error={refundDepositsManualError}
            refetch={() => {
              refetchRefundDepositsManual();
              refetchRefundDepositManualTotal();
            }}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
              },
              permissions?.report?.chargeback?.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_validate_status && {
                label: "refresh",
                icon: <ReloadOutlined style={{ fontSize: "18px" }} />,
                onClick: () => refetchRefundStatusManual(),
                disabled: (item) => item.status !== "PROCESSING",
              },
              permissions?.report?.chargeback?.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_refund && {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsRefundModalOpen(true),
                disabled: (item) =>
                  !item?.merchant_id ||
                  !["WAITING", "ERROR"].includes(item?.status),
              },
              permissions?.report?.chargeback?.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_paid_to_merchant && {
                label: "pay_to_merchant",
                icon: <ShopOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayMerchantModalOpen(true),
                disabled: (item) =>
                  !item?.merchant_id ||
                  !["WAITING", "ERROR"].includes(item?.status),
              },
              (user.type === 1 ||
                permissions?.report?.chargeback?.manual_deposit_chargeback
                  ?.report_chargeback_manual_deposit_chargeback_paid_to_enduser) && {
                label: "pay_to_enduser",
                icon: <UserSwitchOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsPayEndUserModalOpen(true),
                disabled: (item) => !["ERROR"].includes(item?.status),
              },
              permissions?.report?.chargeback?.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_update_merchant && {
                label: "edit_merchant",
                icon: <EditOutlined style={{ fontSize: "18px" }} />,
                onClick: (item) => {
                  setUpdateBody((state) => ({
                    ...state,
                    endToEndId: item.endToEndId,
                  }));
                  setIsUpdateMerchantModalOpen(true);
                },
              },
              permissions?.report?.chargeback?.manual_deposit_chargeback
                ?.report_chargeback_manual_deposit_chargeback_delete && {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setIsDeleteOpen(true),
                disabled: (item) =>
                  !["WAITING", "ERROR"].includes(item?.status),
              },
            ]}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "reason",
              "createdAt",
              "value",
            ]}
          />
        </Col>
      </Row>

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={
          !refundDepositsManual?.items.length || refundDepositsManualError
        }
        mutateReport={() => RefundManualDepositsReportsMutate()}
        error={RefundManualDepositsReportsError}
        success={RefundManualDepositsReportsIsSuccess}
        loading={RefundManualDepositsReportsIsLoading}
        reportPath="/consult/refunds/refund_reports/refund_manual_reports"
        fields={fields}
        csvFields={csvFields}
        setCsvFields={setCsvFields}
        comma={isComma}
        setIsComma={setIsComma}
        reportName="RefundManulReportsFields"
        url={RefundManualDepositsReportsData?.url}
      />

      <ViewModal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        item={currentItem}
        type="manual"
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
      {isPayEndUserModalOpen && (
        <Confirmation
          open={isPayEndUserModalOpen}
          setOpen={setIsPayEndUserModalOpen}
          submit={mutatePayToEndUser}
          title={t("actions.pay_to_enduser")}
          description={`${t("messages.are_you_sure", {
            action: t("actions.pay_to_enduser").toLocaleLowerCase(),
            itens: currentItem?._id,
          })}`}
          loading={isPayToEndUserLoading}
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

      <MutateModal
        type="update"
        open={isUpdateMerchantModalOpen}
        setOpen={setIsUpdateMerchantModalOpen}
        fields={[{ label: "merchant_name", required: true }]}
        body={updateBody}
        setBody={setUpdateBody}
        modalName={t("modal.update_merchant")}
        submit={mutateUpdateMerchant}
        submitLoading={isUpdateMerchantLoading}
        error={UpdateMerchantError}
        success={isUpdateMerchantSuccess}
      />

      <FiltersModal
        maxRange
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
          "pix_type",
        ]}
        refetch={refetchRefundDepositManualTotal}
        selectOptions={{
          status: [
            "REFUNDED",
            "PAID_TO_MERCHANT",
            "PAID_TO_ENDUSER",
            "ERROR",
            "PROCESSIGN",
            "WAITING",
          ],
          pix_type: ["STANDARD", "FASTPIX"],
          gender: ["MALE", "FEMALE", "OTHER"],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />
    </Row>
  );
};
