import moment from "moment";
import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Button, Divider, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { CreateMovimentModal } from "../../components/createMovimentModal";
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetSelf } from "@src/services/getSelf";
import { useGetMerchantMoviments } from "@src/services/moviments/merchants/manual/GetManualTransactions";
import { CreateMerchantManualTransaction } from "@src/services/types/moviments/merchant/createManualTransaction.interface";
import {
  GetMerchantMovimentsItem,
  GetMerchantMovimentsQuery,
} from "@src/services/types/moviments/merchant/getMoviments";
import { useCreateMerchantManualTransaction } from "@src/services/moviments/merchants/manual/createManualTransaction";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useCreateMerchantManualReports } from "@src/services/reports/moviments/merchant/createManualTransactionsReports";

export const MerchantManual = () => {
  const INITIAL_QUERY: GetMerchantMovimentsQuery = {
    page: 1,
    limit: 25,
    sort_field: "createdAt",
    sort_order: "DESC",
    start_date: moment(new Date())
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
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
  const { Self } = useGetSelf();

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

  const { mutate, isLoading, error, isSuccess } =
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
        <Grid container item xs={12} md={4} lg={2} rowSpacing={1}>
          <Grid item xs={12}>
            {" "}
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
        <Grid item xs={12} md={5} lg={6}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
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
        <Grid item xs={12} md={2} lg={2}>
          <ExportReportsModal
            mutateReport={() => MerchantManualReportsMutate()}
            error={MerchantManualReportsError}
            success={MerchantManualReportsIsSuccess}
            loading={MerchantManualReportsIsLoading}
            reportPath="/moviment/merchant_moviments/merchant_moviments_reports"
          />
        </Grid>
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
              { name: "category_name", type: "text" },
              { name: "user_name", type: "text" },
              { name: "type", type: "text" },
              { name: "value", type: "value" },
              { name: "createdAt", type: "date" },
              { name: "status", type: "status" },
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
          filters={["start_date", "end_date"]}
          refetch={refetchMerchantMovimentsData}
          selectOptions={{
            status: [],
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
    </Grid>
  );
};
