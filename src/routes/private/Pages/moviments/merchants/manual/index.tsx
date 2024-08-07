/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FileAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { Toast } from "@src/components/Toast";
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetMerchantMoviments } from "@src/services/moviments/merchants/manual/GetManualTransactions";
import { useCreateMerchantManualTransaction } from "@src/services/moviments/merchants/manual/createManualTransaction";
import { queryClient } from "@src/services/queryClient";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";
import { useCreateMerchantManualReports } from "@src/services/reports/moviments/merchant/createManualTransactionsReports";
import { useGetManualTransactionReportFields } from "@src/services/reports/moviments/merchant/getManualTransactionFields";
import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import {
  GetMerchantMovimentsItem,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Divider, Statistic, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateMovimentModal } from "../../components/createMovimentModal";

export const MerchantManual = () => {
  const { t } = useTranslation();
  const { permissions, type } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const INITIAL_QUERY: GetMerchantMovimentsQuery = {
    page: 1,
    limit: 25,
    sort_field: "createdAt",
    sort_order: "DESC",
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
  const [tokenState, setTokenState] = useState<string>("");
  const [query, setQuery] = useState<GetMerchantMovimentsQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [, setCurrentItem] = useState<GetMerchantMovimentsItem | null>(null);
  const [operationInOpen, setOperationInIOpen] = useState<boolean>(false);
  const [operationOutOpen, setOperationOutOpen] = useState<boolean>(false);
  const [operationInTokenModalOpen, setOperationInTokenModalOpen] =
    useState<boolean>(false);
  const [operationInBody, setOperationInBody] =
    useState<CreateMerchantManualTransaction | null>(null);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const {
    MerchantMovimentsData,
    isMerchantMovimentsDataFetching,
    MerchantMovimentsDataError,
    refetchMerchantMovimentsData,
  } = useGetMerchantMoviments(query);

  const { fields } = useGetManualTransactionReportFields();
  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);

  const {
    MerchantManualReportsError,
    MerchantManualReportsIsLoading,
    MerchantManualReportsIsSuccess,
    MerchantManualReportsMutate,
    MerchantManualReportsData,
  } = useCreateMerchantManualReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { categoryData } = useGetRowsMerchantManualEntryCategory({
    limit: 200,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    enabled: true,
  });

  const { mutate, error, isSuccess } =
    useCreateMerchantManualTransaction(operationInBody);

  useEffect(() => {
    refetchMerchantMovimentsData();
  }, [query]);

  useEffect(() => {
    setOperationInBody((state) => ({ ...state, validation_token: tokenState }));
  }, [tokenState]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        item
        xs={12}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {MerchantMovimentsData &&
          Object.keys(MerchantMovimentsData).map((key) => {
            switch (key) {
              case "total_in_canceled":
                return type === 2 || type === 1 ? (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{
                      margin: "10px",
                    }}
                  >
                    <Statistic
                      valueStyle={{ color: "#3f8600", fontSize: "20px" }}
                      prefix={<ArrowUpOutlined />}
                      title={t(`table.${key}`)}
                      loading={isMerchantMovimentsDataFetching}
                      value={moneyFormatter(MerchantMovimentsData[key] || 0)}
                    />
                  </Grid>
                ) : (
                  <></>
                );
              case "total_in_processing":
              case "total_in_success":
                return (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{
                      margin: "10px",
                    }}
                  >
                    <Statistic
                      valueStyle={{ color: "#3f8600", fontSize: "20px" }}
                      prefix={<ArrowUpOutlined />}
                      title={t(`table.${key}`)}
                      loading={isMerchantMovimentsDataFetching}
                      value={moneyFormatter(MerchantMovimentsData[key] || 0)}
                    />
                  </Grid>
                );
              case "total_out_processing":
              case "total_out_success":
                return (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{ margin: "10px" }}
                  >
                    <Statistic
                      valueStyle={{ color: "#cf1322", fontSize: "20px" }}
                      prefix={<ArrowDownOutlined />}
                      title={t(`table.${key}`)}
                      loading={isMerchantMovimentsDataFetching}
                      value={moneyFormatter(MerchantMovimentsData[key] || 0)}
                    />
                  </Grid>
                );

              case "total_out_canceled":
                return type === 2 || type === 1 ? (
                  <Grid
                    key={key}
                    item
                    xs={5}
                    md="auto"
                    style={{ margin: "10px" }}
                  >
                    <Statistic
                      valueStyle={{ color: "#cf1322", fontSize: "20px" }}
                      prefix={<ArrowDownOutlined />}
                      title={t(`table.${key}`)}
                      loading={isMerchantMovimentsDataFetching}
                      value={moneyFormatter(MerchantMovimentsData[key] || 0)}
                    />
                  </Grid>
                ) : (
                  <></>
                );
              default:
                return;
            }
          })}
        {permissions?.transactions?.merchant?.manual_transactions
          ?.merchant_manual_transactions_create && (
          <Grid container item xs={12} md={4} lg={2} rowSpacing={1}>
            <Grid item xs={12}>
              <Button
                style={{ width: "100%", minWidth: "200px" }}
                size="large"
                type="default"
                shape="round"
                onClickCapture={() => setOperationInIOpen(true)}
              >
                <ArrowUpOutlined /> {t("buttons.register_in")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{ width: "100%", minWidth: "200px" }}
                size="large"
                type="default"
                shape="round"
                danger
                onClickCapture={() => setOperationOutOpen(true)}
              >
                <ArrowDownOutlined />
                {t("buttons.register_out")}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid
        container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        spacing={1}
      >
        <Grid
          container
          item
          xs={12}
          md={7}
          spacing={1}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={3} lg={3}>
            <Button
              size="large"
              style={{ width: "100%" }}
              loading={isMerchantMovimentsDataFetching}
              type="primary"
              onClick={() => setIsFiltersOpen(true)}
              icon={<FilterOutlined />}
            >
              {t("table.filters")}
            </Button>
          </Grid>
          <Grid item xs={12} md={9} lg={9}>
            <FilterChips
              initial_query={INITIAL_QUERY}
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              query={query}
              setQuery={setQuery}
              haveInitialDate
            />
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          md={4}
          spacing={1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Grid item xs={12} md={6} lg={6}>
            <Button
              type="dashed"
              loading={isMerchantMovimentsDataFetching}
              danger
              onClick={() => {
                setQuery(INITIAL_QUERY);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={<FilterAltOffOutlinedIcon />}
            >
              {t("table.clear_filters")}
            </Button>
          </Grid>
          {permissions?.transactions?.merchant?.manual_transactions
            ?.merchant_manual_transactions_export_csv && (
            <Grid item xs={12} md="auto">
              <Tooltip
                placement="topRight"
                title={
                  !MerchantMovimentsData?.total || MerchantMovimentsDataError
                    ? t("messages.no_records_to_export")
                    : t("messages.export_csv")
                }
                arrow
              >
                <Button
                  onClick={() => setIsExportReportsOpen(true)}
                  style={{ width: "100%" }}
                  icon={<FileAddOutlined style={{ fontSize: 22 }} />}
                  shape="round"
                  type="dashed"
                  size="large"
                  loading={MerchantManualReportsIsLoading}
                  disabled={
                    !MerchantMovimentsData?.total || MerchantMovimentsDataError
                  }
                >
                  CSV
                </Button>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={MerchantMovimentsData}
            items={MerchantMovimentsData?.items}
            error={MerchantMovimentsDataError}
            columns={[
              { name: "_id", type: "id" },
              { name: "category_name", type: "text", sort: true },
              { name: "user_name", type: "text" },
              { name: "partner_name", type: "text" },
              { name: "merchant_name", type: "text" },
              { name: "type", type: "translate" },
              { name: "value", type: "value" },
              { name: "description", type: "text" },
              { name: "createdAt", type: "date", sort: true },
              { name: "status", type: "status", sort: true },
            ]}
            loading={isMerchantMovimentsDataFetching}
            refetch={() => refetchMerchantMovimentsData()}
            disableActions
            actions={[{}]}
            label={[
              "merchant_name",
              "category_name",
              "value",
              "status",
              "createdAt",
            ]}
          />
        </Grid>
      </Grid>

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
          "partner_id",
          "aggregator_id",
          "merchant_id",
          "operator_id",
          "merchant_category_id",
          "type",
        ]}
        refetch={refetchMerchantMovimentsData}
        selectOptions={{
          status: ["PROCESSING", "SUCCESS", "CANCELED"],
          merchant_category_id:
            categoryData?.items?.map((category) => {
              return { label: category?.name, value: category?.id };
            }) || [],
          type: ["in", "out"],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      {operationInOpen && (
        <CreateMovimentModal
          open={operationInOpen}
          setOpen={setOperationInIOpen}
          category="merchant"
          type="in"
          onSubmit={mutate}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}
      {operationOutOpen && (
        <CreateMovimentModal
          open={operationOutOpen}
          setOpen={setOperationOutOpen}
          category="merchant"
          type="out"
          onSubmit={mutate}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}

      {operationInTokenModalOpen && (
        <ValidateToken
          open={operationInTokenModalOpen}
          setIsOpen={setOperationInTokenModalOpen}
          action="MERCHANT_ENTRY_ACCOUNT_CREATE"
          body={operationInBody}
          setTokenState={setTokenState}
          tokenState={tokenState}
          error={error}
          success={isSuccess}
          submit={() => {
            mutate();
          }}
        />
      )}
      <Toast
        error={error}
        success={isSuccess}
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
      />

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={!MerchantMovimentsData?.total || MerchantMovimentsDataError}
        mutateReport={() => MerchantManualReportsMutate()}
        error={MerchantManualReportsError}
        success={MerchantManualReportsIsSuccess}
        loading={MerchantManualReportsIsLoading}
        reportPath="/moviment/merchant_moviments/merchant_moviments_reports/merchant_manual_moviments_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="asuyguydsguysfeuygsgguy"
        url={MerchantManualReportsData?.url}
      />
    </Grid>
  );
};
