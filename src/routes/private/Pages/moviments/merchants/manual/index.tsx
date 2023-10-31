/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetSelf } from "@src/services/getSelf";
import { useGetMerchantMoviments } from "@src/services/moviments/merchants/manual/GetManualTransactions";
import { useCreateMerchantManualTransaction } from "@src/services/moviments/merchants/manual/createManualTransaction";
import { queryClient } from "@src/services/queryClient";
import { useCreateMerchantManualReports } from "@src/services/reports/moviments/merchant/createManualTransactionsReports";
import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import {
  GetMerchantMovimentsItem,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Divider, Statistic } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateMovimentModal } from "../../components/createMovimentModal";
import { useGetRowsMerchantManualEntryCategory } from "@src/services/register/merchant/manualEntryCategory/getManualEntryCategory";

export const MerchantManual = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const INITIAL_QUERY: GetMerchantMovimentsQuery = {
    page: 1,
    limit: 25,
    sort_field: "createdAt",
    sort_order: "DESC",
    start_date: moment(new Date())
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
      .add(3, "hours")
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

  const { t } = useTranslation();
  const { SelfError } = useGetSelf();

  const {
    MerchantMovimentsData,
    isMerchantMovimentsDataFetching,
    MerchantMovimentsDataError,
    refetchMerchantMovimentsData,
  } = useGetMerchantMoviments(query);

  const {
    MerchantManualReportsError,
    MerchantManualReportsIsLoading,
    MerchantManualReportsIsSuccess,
    MerchantManualReportsMutate,
  } = useCreateMerchantManualReports(query);

  const { categoryData } = useGetRowsMerchantManualEntryCategory({
    limit: 200,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC"
  });

  const { mutate, error, isSuccess } =
    useCreateMerchantManualTransaction(operationInBody);

  useEffect(() => {
    refetchMerchantMovimentsData();
  }, [query]);

  const onSubmitIn = () => {
    setOperationInIOpen(false);
    setOperationOutOpen(false);
    setOperationInTokenModalOpen(true);
  };

  useEffect(() => {
    setOperationInBody((state) => ({ ...state, validation_token: tokenState }));
  }, [tokenState]);

  useEffect(() => {
    console.error(SelfError);
  }, [SelfError]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        item
        xs={12}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {MerchantMovimentsData &&
          Object.keys(MerchantMovimentsData).map((key) => {
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
                      loading={isMerchantMovimentsDataFetching}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(MerchantMovimentsData[key] || 0)}
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
                      loading={isMerchantMovimentsDataFetching}
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(MerchantMovimentsData[key] || 0)}
                    />
                  </Grid>
                );
              default:
                return;
            }
          })}
        {permissions.transactions.merchant.manual_transactions
          .merchant_manual_transactions_create && (
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
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isMerchantMovimentsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={4} lg={7}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.transactions.merchant.manual_transactions
          .merchant_manual_transactions_export_csv && (
          <Grid item xs={12} md={2} lg={1}>
            <ExportReportsModal
              disabled={
                !MerchantMovimentsData?.total || MerchantMovimentsDataError
              }
              mutateReport={() => MerchantManualReportsMutate()}
              error={MerchantManualReportsError}
              success={MerchantManualReportsIsSuccess}
              loading={MerchantManualReportsIsLoading}
              reportPath="/moviment/merchant_moviments/merchant_moviments_reports"
            />
          </Grid>
        )}
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
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
              { name: "type", type: "translate" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date", sort: true },
              { name: "status", type: "status", sort: true },
            ]}
            loading={isMerchantMovimentsDataFetching}
            actions={[]}
            removeTotal
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </Grid>
      </Grid>
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={["start_date", "end_date", "status", "category_id", "type"]}
          refetch={refetchMerchantMovimentsData}
          selectOptions={{
            status: ["PROCESSING", "SUCCESS", "CANCELED"],
            category_id:
            categoryData?.items?.map((category) => {
                return { label: category?.name, value: category?.id };
              }) || [],
            type: ["in", "out"],
          }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {operationInOpen && (
        <CreateMovimentModal
          open={operationInOpen}
          setOpen={setOperationInIOpen}
          category="merchant"
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
          category="merchant"
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
    </Grid>
  );
};
