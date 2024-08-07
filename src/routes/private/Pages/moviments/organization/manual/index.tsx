/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetOrganizationMoviments } from "@src/services/moviments/organization/manual/GetManualTransactions";
import { useCreateManualTransaction } from "@src/services/moviments/organization/manual/createManualTransaction";
import { queryClient } from "@src/services/queryClient";
import { useGetOrganizationCategories } from "@src/services/register/organization/categories/getCategories";
import { useCreateOrganizationManualReports } from "@src/services/reports/moviments/organization/createManualTransactionsReports";
import { useGetManualOrganizationTransactionReportFields } from "@src/services/reports/moviments/organization/getManualTransactionFields";
import { CreateManualTransaction } from "@src/services/types/moviments/organization/createManualTransaction.interface";
import {
  GetMovimentsItem,
  GetMovimentsQuery,
} from "@src/services/types/moviments/organization/getMoviments";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Divider, Statistic, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateMovimentModal } from "../../components/createMovimentModal";

export const OrgonizationManual = () => {
  const { t } = useTranslation();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const INITIAL_QUERY: GetMovimentsQuery = {
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
  const [query, setQuery] = useState<GetMovimentsQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [, setCurrentItem] = useState<GetMovimentsItem | null>(null);
  const [operationInOpen, setOperationInIOpen] = useState<boolean>(false);
  const [operationOutOpen, setOperationOutOpen] = useState<boolean>(false);
  const [operationInTokenModalOpen, setOperationInTokenModalOpen] =
    useState<boolean>(false);
  const [operationInBody, setOperationInBody] =
    useState<CreateManualTransaction | null>(null);
  const { fields } = useGetManualOrganizationTransactionReportFields();
  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);
  const {
    OrganizationMovimentsData,
    isOrganizationMovimentsDataFetching,
    OrganizationMovimentsDataError,
    refetchOrganizationMovimentsData,
  } = useGetOrganizationMoviments(query);

  const { mutate, error, isSuccess, reset } =
    useCreateManualTransaction(operationInBody);

  const {
    OrganizationManualReportsError,
    OrganizationManualReportsIsLoading,
    OrganizationManualReportsIsSuccess,
    OrganizationManualReportsMutate,
    OrganizationManualReportsData,
  } = useCreateOrganizationManualReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { CategoriesData, refetchCategoriesData } =
    useGetOrganizationCategories({
      limit: 200,
      page: 1,
    });

  const onSubmitIn = () => {
    setOperationInIOpen(false);
    setOperationOutOpen(false);
    setOperationInTokenModalOpen(true);
  };

  useEffect(() => {
    refetchOrganizationMovimentsData();
  }, [query]);

  useEffect(() => {
    refetchCategoriesData();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setOperationInBody(null);
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    setOperationInBody((state) => ({ ...state, validation_token: tokenState }));
  }, [tokenState]);

  return (
    <Grid container style={{ padding: "25px", }}>
      <Grid
        container
        item
        xs={12}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {OrganizationMovimentsData &&
          Object.keys(OrganizationMovimentsData).map((key) => {
            switch (key) {
              case "total_in_processing":
              case "total_in_canceled":
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
                      loading={isOrganizationMovimentsDataFetching}
                      value={moneyFormatter(
                        OrganizationMovimentsData[key] || 0
                      )}
                    />
                  </Grid>
                );
              case "total_out_processing":
              case "total_out_canceled":
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
                      loading={isOrganizationMovimentsDataFetching}
                      value={moneyFormatter(
                        OrganizationMovimentsData[key] || 0
                      )}
                    />
                  </Grid>
                );
              default:
                return;
            }
          })}
        {permissions?.transactions?.paybrokers?.manual_transactions
          ?.paybrokers_manual_transactions_create && (
          <Grid container item xs={12} md={4} lg={2} rowSpacing={1}>
            <Grid item xs={12}>
              {" "}
              <Button
                style={{ width: "100%", minWidth: "200px" }}
                size="large"
                type="default"
                shape="round"
                onClickCapture={() => setOperationInIOpen(true)}
                icon={<ArrowUpOutlined />}
              >
                {t("buttons.register_in")}
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
                icon={<ArrowDownOutlined />}
              >
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
          md={8}
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
              loading={isOrganizationMovimentsDataFetching}
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
              loading={isOrganizationMovimentsDataFetching}
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
                  !OrganizationMovimentsData?.total ||
                  OrganizationMovimentsDataError
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
                  loading={OrganizationManualReportsIsLoading}
                  disabled={
                    !OrganizationMovimentsData?.total ||
                    OrganizationMovimentsDataError
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
            data={OrganizationMovimentsData}
            items={OrganizationMovimentsData?.items}
            error={OrganizationMovimentsDataError}
            refetch={refetchOrganizationMovimentsData}
            disableActions
            actions={[{}]}
            columns={[
              { name: "_id", type: "id", sort: true },
              { name: "category_name", type: "text", sort: true },
              { name: "user_name", type: "text" },
              { name: "type", type: "translate" },
              { name: "value", type: "value", sort: true },
              { name: "createdAt", type: "date", sort: true },
              { name: "status", type: "status" },
            ]}
            loading={isOrganizationMovimentsDataFetching}
            label={[
              "user_name",
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
        filters={["start_date", "end_date", "status", "category_id", "type"]}
        refetch={refetchOrganizationMovimentsData}
        selectOptions={{
          status: ["PROCESSING", "SUCCESS", "CANCELED"],
          category_id:
            CategoriesData?.items?.map((category) => {
              return {
                label: category?.name || " ",
                value: category?.id || " ",
              };
            }) || [],
          type: [
            { label: "in", value: "in" },
            { label: "out", value: "out" },
          ],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      {operationInOpen && (
        <CreateMovimentModal
          open={operationInOpen}
          setOpen={setOperationInIOpen}
          category="organization"
          type="in"
          onSubmit={onSubmitIn}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}
      {operationOutOpen && (
        <CreateMovimentModal
          open={operationOutOpen}
          setOpen={setOperationOutOpen}
          category="organization"
          type="out"
          onSubmit={onSubmitIn}
          body={operationInBody}
          setBody={setOperationInBody}
        />
      )}

      {operationInTokenModalOpen && (
        <ValidateToken
          open={operationInTokenModalOpen}
          setIsOpen={setOperationInTokenModalOpen}
          action="MERCHANT_ENTRY_ACCOUNT_ORGANIZATION_CREATE"
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

      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={
          !OrganizationMovimentsData?.total || OrganizationMovimentsDataError
        }
        mutateReport={() => OrganizationManualReportsMutate()}
        error={OrganizationManualReportsError}
        success={OrganizationManualReportsIsSuccess}
        loading={OrganizationManualReportsIsLoading}
        reportPath="/moviment/organization_moviments/organization_moviments_reports/organization_manual_moviments_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="OrganizationManualTransactions"
        url={OrganizationManualReportsData?.url}
      />
    </Grid>
  );
};
