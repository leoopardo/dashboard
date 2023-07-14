/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ValidateToken } from "@src/components/ValidateToken";
import { useGetSelf } from "@src/services/getSelf";
import { useGetOrganizationMoviments } from "@src/services/moviments/organization/manual/GetManualTransactions";
import { useCreateManualTransaction } from "@src/services/moviments/organization/manual/createManualTransaction";
import { queryClient } from "@src/services/queryClient";
import { useCreateOrganizationManualReports } from "@src/services/reports/moviments/organization/createManualTransactionsReports";
import { CreateManualTransaction } from "@src/services/types/moviments/organization/createManualTransaction.interface";
import {
  GetMovimentsItem,
  GetMovimentsQuery,
} from "@src/services/types/moviments/organization/getMoviments";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Divider, Statistic } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateMovimentModal } from "../../components/createMovimentModal";

export const OrgonizationManual = () => {
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
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .add(1, "day")
      .startOf("day")
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

  const { t } = useTranslation();

  const {
    OrganizationMovimentsData,
    isOrganizationMovimentsDataFetching,
    OrganizationMovimentsDataError,
    refetchOrganizationMovimentsData,
  } = useGetOrganizationMoviments(query);

  const { mutate, error, isSuccess } =
    useCreateManualTransaction(operationInBody);

  const {
    OrganizationManualReportsError,
    OrganizationManualReportsIsLoading,
    OrganizationManualReportsIsSuccess,
    OrganizationManualReportsMutate,
  } = useCreateOrganizationManualReports(query);

  useEffect(() => {
    refetchOrganizationMovimentsData();
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
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(OrganizationMovimentsData[key] || 0)}
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
                      value={new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(OrganizationMovimentsData[key] || 0)}
                    />
                  </Grid>
                );
              default:
                return;
            }
          })}
        {permissions.transactions.paybrokers.manual_transactions
          .paybrokers_manual_transactions_create && (
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
            loading={isOrganizationMovimentsDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.transactions.paybrokers.manual_transactions
          .paybrokers_manual_transactions_export_csv && (
          <Grid item xs={12} md="auto" lg={1}>
            <ExportReportsModal
              mutateReport={() => OrganizationManualReportsMutate()}
              error={OrganizationManualReportsError}
              success={OrganizationManualReportsIsSuccess}
              loading={OrganizationManualReportsIsLoading}
              reportPath="/moviment/organization_moviments/organization_moviments_reports"
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
            data={OrganizationMovimentsData}
            items={OrganizationMovimentsData?.items}
            error={OrganizationMovimentsDataError}
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
            actions={[]}
            removeTotal
            label={["bank", "user_name", "status", "createdAt", "delivered_at"]}
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
          refetch={refetchOrganizationMovimentsData}
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
    </Grid>
  );
};
