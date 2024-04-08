/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import CachedIcon from "@mui/icons-material/Cached";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetHourly } from "@src/services/consult/merchant/bankStatement/getHourly";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { useGetHeatMapTotalByCity } from "@src/services/heatMap/getTotalByCity";
import { useGetHeatMapTotalByStates } from "@src/services/heatMap/getTotalByStates";
import { useGetMerchantMoviments } from "@src/services/moviments/merchants/manual/GetManualTransactions";
import { queryClient } from "@src/services/queryClient";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import {
  Button,
  Card,
  Col,
  List,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tooltip,
  theme,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MerchantHourlyLineChart } from "../consult/merchant/bankStatement/components/HourlyChart";
import { BankCard } from "./components/bankCard";
import { ChartIn } from "./components/charts/chartIn";
import { ChartOut } from "./components/charts/chartOut";
import { RootMap } from "./components/map";
import { MerchantBalance } from "./components/merchantBalance";
import { MerchantsBalance } from "./components/merchantsBalance";
import { OrganizationBalance } from "./components/organizationBalance";
import { ValuesTable } from "./components/valuesTable";
import { RefundDepositsCard } from "./components/refundDepositsCard";
import { RefundWithdrawalCard } from "./components/refundWithdrawalsCard";
import { TabsTable } from "./components/TabsTable";

const INITIAL_QUERY = {
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

export const Dashboard = () => {
  const { t } = useTranslation();
  const { error } = useErrorContext();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const totilizersTabs = [];
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const [query, setQuery] =
    useState<MerchantBankStatementTotalsQuery>(INITIAL_QUERY);
  const [mapQuery, setMapQuery] = useState<any>({
    createdat_start: query.start_date,
    createdat_end: query.end_date,
  });
  const { bankListData, isBankListFetching } = useListBanks({
    limit: 200,
    page: 1,
  });
  const { Hourly, refetchHourlyTotal } = useGetHourly(query);
  const { MerchantMovimentsData, isMerchantMovimentsDataFetching } =
    useGetMerchantMoviments(query);
  const [activeKey, setActiveKey] = useState<string>(
    permissions?.report?.paybrokers?.balance?.report_paybrokers_balance_list
      ? "1"
      : permissions?.report?.merchant?.balance?.report_merchant_balance_list
      ? "2"
      : ""
  );
  const {
    heatMapTotalByCity,
    isHeatMapTotalByCityFetching,
    refetcHeatMapTotalByCity,
  } = useGetHeatMapTotalByCity(mapQuery);
  const {
    heatMapTotalByState,
    isHeatMapTotalByStateFetching,
    refetcHeatMapTotalByState,
  } = useGetHeatMapTotalByStates(mapQuery);

  const [fastDateFilter, setFastDateFilter] = useState<
    | "today"
    | "yesterday"
    | "week"
    | "month"
    | "lastMonth"
    | null
    | "custom_date"
  >("today");
  const [fastDateDay, setFastDateDay] = useState<number | null>(null);

  const { refetchMerchantBankStatementTotalsTotal } =
    useGetMerchantBankStatementTotals(query);

  if (
    permissions?.report?.paybrokers?.balance?.report_paybrokers_balance_list
  ) {
    totilizersTabs.push({
      key: "1",
      label: t("table.organization_balance"),
      children: <OrganizationBalance />,
    });
  }
  if (permissions?.report?.merchant?.balance?.report_merchant_balance_list) {
    totilizersTabs.push({
      key: "2",
      label: t("table.merchant_balance"),
      children: (
        <Col span={24}>
          <MerchantBalance />
        </Col>
      ),
    });
  }
  totilizersTabs.push({
    key: "3",
    label: t("table.heat_map"),
    children:
      isHeatMapTotalByCityFetching || isHeatMapTotalByStateFetching ? (
        <div
          style={{
            width: "100%",
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <RootMap
          data={heatMapTotalByCity}
          state={heatMapTotalByState}
          query={{
            createdat_start: query.start_date,
            createdat_end: query.end_date,
            state: (query as any).state,
          }}
          setQuery={setQuery}
        />
      ),
  });

  useEffect(() => {
    refetchHourlyTotal();
    setMapQuery((state: any) => ({
      ...state,
      createdat_start: query.start_date,
      createdat_end: query.end_date,
    }));
  }, [query]);

  useEffect(() => {
    refetcHeatMapTotalByCity();
    refetcHeatMapTotalByState();
  }, [mapQuery.createdat_start, mapQuery.createdat_end]);
  useEffect(() => {
    if (
      moment(new Date(query.start_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query.end_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .add(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setFastDateFilter("today");
    } else if (
      moment(new Date(query.start_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .subtract(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query.end_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setFastDateFilter("yesterday");
    } else if (
      moment(new Date(query.start_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .startOf("M")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query.end_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .endOf("M")
          .add(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setFastDateFilter("month");
    } else if (
      moment(new Date(query.start_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .startOf("week")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query.end_date)).format("YYYY-MM-DDTHH:mm:00.000") ===
        moment(new Date())
          .add(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setFastDateFilter("week");
    } else {
      if (
        moment(query.start_date).get("M") === moment(new Date()).get("M") &&
        moment(query.end_date).get("M") === moment(new Date()).get("M")
      ) {
        setFastDateFilter("month");
        setFastDateDay(moment(query.start_date).get("D"));
      } else if (
        moment(new Date(query.start_date)).get("M") ===
        moment(new Date()).subtract(1, "M").get("M")
      ) {
        setFastDateFilter("lastMonth");
        setFastDateDay(moment(query.start_date).get("D"));
      } else {
        setFastDateFilter("custom_date");
      }
    }
  }, [query]);

  return (
    <Row
      style={{
        backgroundColor: theme.useToken().token.colorBgLayout,
        minHeight: "100vh",
        height: "100%",
        width: "100%",
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{ width: "100%", display: "flex", flexWrap: "wrap-reverse" }}
      >
        <Col
          xs={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 18 }}
          style={{
            backgroundColor: theme.useToken().token.colorBgElevated,
            minHeight: "100vh",
            padding: "8px 25px",
            borderRadius: 8,
          }}
        >
          <Row gutter={[8, 16]}>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: isMobile ? -10 : -60,
                marginTop: 8,
                alignItems: "center",
              }}
            >
              <Row
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                gutter={[8, 8]}
              >
                <Col xs={{ span: 3 }} md={{ span: 1 }}>
                  <Tooltip title={t("table.filters")}>
                    <Button
                      type="primary"
                      style={{
                        zIndex: 999,
                        width: "100%",
                      }}
                      icon={<FilterOutlined style={{ fontSize: 16 }} />}
                      onClick={() => setIsFiltersOpen(true)}
                    />
                  </Tooltip>
                </Col>
                <Col xs={{ span: 3 }} md={{ span: 1 }}>
                  <Tooltip title={t("table.clear_filters")}>
                    <Button
                      type="dashed"
                      danger
                      style={{
                        zIndex: 999,
                        width: "100%",
                      }}
                      icon={
                        <FilterAltOffOutlinedIcon style={{ fontSize: 20 }} />
                      }
                      onClick={() => setQuery(INITIAL_QUERY)}
                    />
                  </Tooltip>
                </Col>
                <Col
                  xs={{ span: 14 }}
                  md={{
                    span:
                      fastDateFilter === "month" ||
                      fastDateFilter === "lastMonth"
                        ? 6
                        : 4,
                  }}
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Select
                      placeholder={t("table.fast_date_filter")}
                      style={{
                        width:
                          fastDateFilter === "month" ||
                          fastDateFilter === "lastMonth"
                            ? "60%"
                            : "100%",
                        zIndex: 999,
                      }}
                      options={[
                        { label: t("table.today"), value: "today" },
                        { label: t("table.yesterday"), value: "yesterday" },
                        { label: t("table.week"), value: "week" },
                        { label: t("table.this_month"), value: "month" },
                        { label: t("table.last_month"), value: "lastMonth" },
                        {
                          label: t("table.c_date"),
                          value: "custom_date",
                          disabled: true,
                        },
                      ]}
                      onChange={(value) => {
                        setFastDateFilter(value);
                        setFastDateDay(null);
                        switch (value) {
                          case "today":
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
                            break;
                          case "yesterday":
                            setQuery((state) => ({
                              ...state,
                              start_date: moment(new Date())
                                .subtract(1, "day")
                                .startOf("day")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                              end_date: moment(new Date())
                                .startOf("day")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            }));
                            break;
                          case "week":
                            setQuery((state) => ({
                              ...state,
                              start_date: moment(new Date())
                                .startOf("week")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                              end_date: moment(new Date())
                                .add(1, "day")
                                .startOf("day")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            }));
                            break;
                          case "month":
                            setQuery((state) => ({
                              ...state,
                              start_date: moment(new Date())
                                .startOf("month")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                              end_date: moment(new Date())
                                .endOf("month")
                                .add(1, "day")
                                .startOf("day")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            }));
                            break;
                          case "lastMonth":
                            setQuery((state) => ({
                              ...state,
                              start_date: moment(new Date())
                                .subtract(1, "month")
                                .startOf("month")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                              end_date: moment(new Date())
                                .startOf("M")
                                .startOf("day")
                                .utc()
                                .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            }));
                        }
                      }}
                      value={fastDateFilter}
                    />
                    {fastDateFilter === "month" && (
                      <Select
                        allowClear
                        value={fastDateDay}
                        onClear={() => {
                          setFastDateDay(null);
                          setQuery((state) => ({
                            ...state,
                            start_date: moment(new Date())
                              .startOf("month")
                              .utc()
                              .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            end_date: moment(new Date())
                              .endOf("month")
                              .add(1, "day")
                              .startOf("day")
                              .utc()
                              .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                          }));
                        }}
                        placeholder={t("table.day")}
                        style={{ width: "40%", zIndex: 999 }}
                        options={Array.from(
                          { length: moment(new Date()).daysInMonth() },
                          (_, i) => i + 1
                        ).map((i) => ({ label: i, value: i }))}
                        onChange={(value) => {
                          if (!value) return;
                          setFastDateDay(value);
                          setQuery((state) => ({
                            ...state,
                            start_date: moment(new Date())
                              .startOf("month")
                              .add(value - 1, "day")
                              .utc()
                              .format(`YYYY-MM-DDTHH:mm:ss.SSS`),
                            end_date: moment(new Date())
                              .startOf("month")
                              .add(value, "day")
                              .utc()
                              .format(`YYYY-MM-DDTHH:mm:ss.SSS`),
                          }));
                        }}
                      />
                    )}
                    {fastDateFilter === "lastMonth" && (
                      <Select
                        allowClear
                        onClear={() => {
                          setFastDateDay(null);
                          setQuery((state) => ({
                            ...state,
                            start_date: moment(new Date())
                              .subtract(1, "month")
                              .startOf("month")
                              .utc()
                              .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                            end_date: moment(new Date())
                              .subtract(1, "month")
                              .endOf("month")
                              .add(1, "day")
                              .startOf("day")
                              .utc()
                              .format("YYYY-MM-DDTHH:mm:ss.SSS"),
                          }));
                        }}
                        placeholder={t("table.day")}
                        style={{ width: "40%", zIndex: 999 }}
                        options={Array.from(
                          {
                            length: moment(new Date())
                              .subtract(1, "M")
                              .daysInMonth(),
                          },
                          (_, i) => i + 1
                        ).map((i) => ({ label: i, value: i }))}
                        onChange={(value) => {
                          if (!value) return;
                          setQuery((state) => ({
                            ...state,
                            start_date: moment(new Date())
                              .subtract(1, "month")
                              .startOf("month")
                              .add(value - 1, "day")
                              .utc()
                              .format(`YYYY-MM-DDTHH:mm:ss.SSS`),
                            end_date: moment(new Date())
                              .subtract(1, "month")
                              .startOf("month")
                              .add(value, "day")
                              .utc()
                              .format(`YYYY-MM-DDTHH:mm:ss.SSS`),
                          }));
                        }}
                      />
                    )}
                  </Space.Compact>
                </Col>
                <Col xs={{ span: 3 }} md={{ span: 1 }}>
                  <Tooltip title={t("table.refetch")}>
                    <Button
                      type="link"
                      style={{
                        zIndex: 999,
                        marginLeft: 8,
                      }}
                      onClick={() => queryClient.invalidateQueries()}
                      loading={isBankListFetching}
                      icon={<CachedIcon />}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              {(permissions?.report?.paybrokers?.balance
                ?.report_paybrokers_balance_list ||
                permissions?.report?.merchant?.balance
                  ?.report_merchant_balance_list) && (
                <Tabs
                  data-test-id="tabs-1"
                  activeKey={activeKey}
                  onChange={(value) => {
                    setActiveKey(value);
                  }}
                  items={totilizersTabs}
                />
              )}
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <FilterChips
                data-test-id="filter-chips-1"
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={query}
                setQuery={setQuery}
                haveInitialDate
              />
            </Col>

            {permissions?.report?.merchant?.extract && (
              <>
                <Col span={24}>
                  <ValuesTable query={query} />
                </Col>
                <Col span={24}>
                  <MerchantHourlyLineChart items={Hourly} />
                </Col>
              </>
            )}
            {!user.merchant_id && permissions?.report?.merchant?.balance && (
              <Col span={24}>
                {" "}
                <MerchantsBalance
                  data-test-id="merchants-balance-1"
                  query={query}
                />
              </Col>
            )}
            <Col span={24}>
              {(!error.rankingFee ||
                !error.rankingOperations ||
                !error.rankingValue) && (
                <TabsTable data-test-id="tabs-table" query={query} />
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
            gutter={[8, 8]}
          >
            {permissions?.transactions?.merchant?.manual_transactions
              ?.merchant_manual_transactions_list && (
              <>
                <Col span={24}>
                  <Card bordered={false}>
                    <Statistic
                      loading={isMerchantMovimentsDataFetching}
                      title="Entrada manual"
                      value={moneyFormatter(
                        MerchantMovimentsData.total_in_success || 0
                      )}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false}>
                    <Statistic
                      loading={isMerchantMovimentsDataFetching}
                      title="Saída manual"
                      value={moneyFormatter(
                        MerchantMovimentsData.total_out_success || 0
                      )}
                      precision={2}
                      valueStyle={{ color: "#cf1322" }}
                      prefix={<ArrowDownOutlined />}
                    />
                  </Card>
                </Col>
              </>
            )}

            {permissions?.report?.paybrokers?.bank_balance?.menu && (
              <Col span={24}>
                <List
                  loading={isBankListFetching}
                  style={{ width: "100%" }}
                  itemLayout="horizontal"
                  dataSource={bankListData?.itens.filter(
                    (b) => b?.status === true
                  )}
                  renderItem={(item: any, index) => (
                    <BankCard
                      bank={item}
                      key={item?.id}
                      data-test-id={`bank-${index}`}
                    />
                  )}
                />
              </Col>
            )}
            {permissions?.report?.deposit?.generated_deposit
              ?.report_deposit_generated_deposit_list_totals && (
              <Col span={24}>
                <ChartIn query={query} data-test-id="chart-in" />
              </Col>
            )}
            {permissions?.report?.deposit?.generated_deposit
              ?.report_deposit_generated_deposit_list_totals && (
              <Col span={24}>
                <ChartOut query={query} data-test-id="chart-in" />
              </Col>
            )}
            {permissions?.report?.chargeback?.deposit_chargeback
              ?.report_chargeback_deposit_chargeback_list_totals && (
              <Col span={24}>
                <RefundDepositsCard query={query} />
              </Col>
            )}

            {permissions?.report?.chargeback?.withdraw_chargeback
              ?.report_chargeback_withdraw_chargeback_list_totals && (
              <Col span={24}>
                <RefundWithdrawalCard query={query} />
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      {/* 
      <Col
        span={24}
        style={{
          marginTop:
            permissions?.report?.merchant?.balance
              ?.report_merchant_balance_list ||
            permissions?.report?.paybrokers?.balance
              ?.report_paybrokers_balance_list
              ? 40
              : 0,

          paddingTop: permissions?.report?.paybrokers?.bank_balance?.menu
            ? 15
            : 0,
          paddingBottom: permissions?.report?.paybrokers?.bank_balance?.menu
            ? 15
            : 0,
        }}
      >
        
        <Row gutter={[8, 4]} align="middle" justify="center">
          <Layout
            style={{
              width: "100%",
            }}
          >
            <Row gutter={[4, 4]} align="middle">
              <Col xs={{ span: 24 }} md={{ span: 4 }}>
                <Button
                  data-test-id="button-4"
                  style={{ width: "100%", height: 40 }}
                  type="primary"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  {t("table.filters")}
                </Button>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 16 }}>
                <FilterChips
                  data-test-id="filter-chips-1"
                  startDateKeyName="start_date"
                  endDateKeyName="end_date"
                  query={query}
                  setQuery={setQuery}
                  haveInitialDate
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 4 }}>
                <Button
                  data-test-id="button-5"
                  type="dashed"
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
              </Col>
              <Col span={24} style={{ marginTop: 0 }}>
                <Divider style={{ marginTop: 0, marginBottom: 16 }}></Divider>
                <ValuesTable
                  data-test-id="values-table-1"
                  query={query}
                  refs={[refType, refOpNum, refOpVal, refTicket, refFee]}
                />
              </Col>
            </Row>
          </Layout>

          {(permissions.report.deposit.generated_deposit
            .report_deposit_generated_deposit_list_totals ||
            permissions.report.withdraw.generated_withdraw
              .report_withdraw_generated_withdraw_list_totals) && (
            <Col
              span={24}
              style={{
                paddingBottom: "60px",
              }}
            >
              <Row gutter={[16, 0]}>
                <Divider orientation="left" data-test-id="divider-2">
                  <Typography.Title
                    level={isMobile ? 5 : 3}
                    ref={refInOut}
                    data-test-id="text-3"
                  >
                    {t("table.in_out_conversion")}
                  </Typography.Title>
                </Divider>
                {permissions.report.deposit.generated_deposit
                  .report_deposit_generated_deposit_list_totals && (
                  <Col xs={{ span: 24 }} md={{ span: 12 }} ref={refIn}>
                    <ChartIn query={query} data-test-id="chart-in" />
                  </Col>
                )}
                {permissions.report.withdraw.generated_withdraw
                  .report_withdraw_generated_withdraw_list_totals && (
                  <Col xs={{ span: 24 }} md={{ span: 12 }} ref={refOut}>
                    <ChartOut query={query} data-test-id="chart-out" />
                  </Col>
                )}
              </Row>
            </Col>
          )}
        </Row>

        {!user.merchant_id && permissions.report.merchant.balance.menu && (
          <Row
            style={{
              marginTop: permissions?.report?.paybrokers?.bank_balance?.menu
                ? 16
                : -65,
            }}
          >
            <Layout
              style={{
                width: "100%",
                marginTop: 25,
                paddingBottom: 20,
                paddingTop: 20,
              }}
            >
              <MerchantsBalance
                data-test-id="merchants-balance-1"
                ref={refMerchantsBalance}
                refs={[
                  refMerchantname,
                  refTransaction,
                  refPayment,
                  refReserved,
                ]}
                query={query}
              />
            </Layout>
          </Row>
        )}

        {(!error.rankingFee ||
          !error.rankingOperations ||
          !error.rankingValue) && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <TabsTable data-test-id="tabs-table" query={query} />
            </Col>
          </Row>
        )}
      </Col>

       */}

      {/* <TuorComponent
        data-test-id="tuor-component"
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        steps={[
          (permissions?.report?.merchant?.balance
            ?.report_merchant_balance_list ||
            permissions?.report?.paybrokers?.balance
              ?.report_paybrokers_balance_list) && {
            title: t("wiki.balance"),
            description: (
              <Typography data-test-id="tuor-balance-description">
                {t("wiki.balance_description")}
                <Typography>
                  <span style={{ color: defaultTheme.colors.info }}>
                    {t("table.balance_to_transactions")}:
                  </span>{" "}
                  {t("wiki.balance_transaction")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.error }}>
                    {t("table.balance_to_payment")}:
                  </span>
                  {t("wiki.balance_payment")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.pending }}>
                    {t("table.balance_reserved")}:
                  </span>{" "}
                  {t("wiki.balance_reserved")}
                </Typography>
              </Typography>
            ),
            target: !isMobile ? () => ref1.current : null,
            nextButtonProps: {
              onClick: () => setActiveKey("2"),
            },
          },
          permissions.report.paybrokers.bank_balance.menu && {
            title: t("menus.organization_bank_balance"),
            description: (
              <Typography data-test-id="organization-bank-balance-description">
                <Typography>
                  <span
                    style={{
                      color: defaultTheme.colors.info,
                      marginRight: "5px",
                    }}
                  >
                    Total:
                  </span>
                  {t("wiki.bank_total_description")}
                </Typography>
                <Typography>
                  <span
                    style={{
                      color: defaultTheme.colors.error,
                      marginRight: "5px",
                    }}
                  >
                    {t("table.blocked_value")}:
                  </span>
                  {t("wiki.bank_blocked_value_description")}
                </Typography>
                <Typography>
                  <span style={{ marginRight: "5px" }}>
                    <Button
                      shape="circle"
                      onClick={() => {
                        setIsBankChart(true);
                        secureLocalStorage.setItem("isBankChart", "true");
                      }}
                    >
                      <BarChartOutlined />
                    </Button>
                    :
                  </span>
                  {t("wiki.bank_chart_description")}
                </Typography>
                <Typography>
                  <span style={{ marginRight: "5px" }}>
                    <Button
                      shape="circle"
                      onClick={() => {
                        setIsBankChart(false);
                        secureLocalStorage.setItem("isBankChart", "false");
                      }}
                    >
                      <DashOutlined />
                    </Button>
                    :
                  </span>
                  {t("wiki.bank_card_description")}
                </Typography>
              </Typography>
            ),
            target: () => ref2.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("table.operations"),
            description: t("wiki.operations_description"),
            target: () => ref4.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("table.type"),
            description: t("wiki.operation_type_description"),
            target: () => refType.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("wiki.operations_number"),
            description: t("wiki.operations_number_description"),
            target: () => refOpNum.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("wiki.operations_value"),
            description: t("wiki.operations_value_description"),
            target: () => refOpVal.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("wiki.ticket"),
            description: t("wiki.ticket_description"),
            target: () => refTicket.current,
          },
          permissions.report.merchant.extract.menu && {
            title: t("wiki.fee"),
            description: t("wiki.fee_description"),
            target: () => refFee.current,
          },
          (permissions.report.deposit.generated_deposit
            .report_deposit_generated_deposit_list_totals ||
            permissions.report.withdraw.generated_withdraw
              .report_withdraw_generated_withdraw_list_totals) && {
            title: t("wiki.in_out_conversions"),
            description: t("wiki.in_out_conversions_description"),
            target: () => refInOut.current,
          },
          permissions.report.deposit.generated_deposit
            .report_deposit_generated_deposit_list_totals && {
            title: t("wiki.in_conversions"),
            description: t("wiki.in_conversions_description"),
            target: () => refIn.current,
          },
          permissions.report.withdraw.generated_withdraw
            .report_withdraw_generated_withdraw_list_totals && {
            title: t("wiki.out_conversions"),
            description: t("wiki.out_conversions_description"),
            target: () => refOut.current,
          },
        ]}
        pageStep={{
          title: t("menus.dashboard"),
          description: t("wiki.dashboard_description"),
        }}
      /> */}
      <FiltersModal
        data-test-id="filters-modal"
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={[
          "start_date",
          "end_date",
          "partner_id",
          "merchant_id",
          "aggregator_id",
          "operator_id",
          "type",
          "payment_type",
        ]}
        refetch={refetchMerchantBankStatementTotalsTotal}
        selectOptions={{
          type: ["deposit", "withdraw"],
          payment_type: ["pix"],
        }}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
        haveInitialDate
        maxRange
      />
    </Row>
  );
};
