/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChartOutlined,
  DashOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { TuorComponent } from "@src/components/Tuor";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { queryClient } from "@src/services/queryClient";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Button,
  Col,
  Divider,
  Layout,
  Row,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import secureLocalStorage from "react-secure-storage";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { TabsTable } from "./components/TabsTable";
import { BankCard } from "./components/bankCard";
import { BankBalanceChart } from "./components/charts/bankBalanceChart";
import { ChartIn } from "./components/charts/chartIn";
import { ChartOut } from "./components/charts/chartOut";
import { MerchantBalance } from "./components/merchantBalance";
import { MerchantsBalance } from "./components/merchantsBalance";
import { OrganizationBalance } from "./components/organizationBalance";
import { ValuesTable } from "./components/valuesTable";

const INITIAL_QUERY = {
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

export const Dashboard = () => {
  const { t } = useTranslation();
  const { error } = useErrorContext();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isBankChart, setIsBankChart] = useState<boolean>(
    secureLocalStorage.getItem("isBankChart") === "true"
  );

  const [query, setQuery] =
    useState<MerchantBankStatementTotalsQuery>(INITIAL_QUERY);
  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refType = useRef(null);
  const refOpNum = useRef(null);
  const refOpVal = useRef(null);
  const refTicket = useRef(null);
  const refFee = useRef(null);
  const refInOut = useRef(null);
  const refIn = useRef(null);
  const refOut = useRef(null);
  const refMerchantsBalance = useRef(null);
  const refMerchantname = useRef(null);
  const refTransaction = useRef(null);
  const refPayment = useRef(null);
  const refReserved = useRef(null);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });
  const [activeKey, setActiveKey] = useState<string>(
    permissions?.report?.paybrokers?.balance?.report_paybrokers_balance_list
      ? "1"
      : permissions?.report?.merchant?.balance?.report_merchant_balance_list
      ? "2"
      : ""
  );

  const { refetchMerchantBankStatementTotalsTotal } =
    useGetMerchantBankStatementTotals(query);

  const totilizersTabs = [];

  if (
    permissions?.report?.paybrokers?.balance?.report_paybrokers_balance_list
  ) {
    totilizersTabs.push({
      key: "1",
      label: t("table.organization_balance"),
      children: (
        <Col span={24}>
          <OrganizationBalance />
        </Col>
      ),
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

  return (
    <Row
      style={{
        margin: "0 20px",
        transform:
          permissions?.report?.paybrokers?.balance
            ?.report_paybrokers_balance_list ||
          permissions?.report?.merchant?.balance?.report_merchant_balance_list
            ? "translateY(17px)"
            : "translateY(0px)",
      }}
    >
      {permissions?.report?.paybrokers?.balance
        ?.report_paybrokers_balance_list && (
        <Layout
          ref={ref1}
          style={{
            margin: -28,
            paddingTop: 20,
            paddingLeft: 6,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {(permissions?.report?.paybrokers?.balance
            ?.report_paybrokers_balance_list ||
            permissions?.report?.merchant?.balance
              ?.report_merchant_balance_list) && (
            <Tabs
              activeKey={activeKey}
              onChange={(value) => {
                setActiveKey(value);
              }}
              items={totilizersTabs}
            />
          )}
        </Layout>
      )}

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
          padding: 15,
        }}
      >
        {permissions?.report?.paybrokers?.bank_balance?.menu && (
          <div>
            <Col
              span={24}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography.Title level={3} ref={ref2}>
                {t("menus.organization_bank_balance")}
              </Typography.Title>
              <div>
                <Tooltip title={t("buttons.help")}>
                  <Button
                    type="link"
                    onClick={() => setIsTuorOpen((state) => !state)}
                  >
                    <InfoCircleOutlined />
                  </Button>
                </Tooltip>
                <Button
                  type="link"
                  onClick={() => queryClient.invalidateQueries()}
                  style={{ marginRight: 8 }}
                >
                  <ReloadOutlined />
                </Button>
                <Button
                  shape="circle"
                  onClick={() => {
                    if (isBankChart) {
                      setIsBankChart(false);
                      secureLocalStorage.setItem("isBankChart", "false");
                    } else {
                      setIsBankChart(true);
                      secureLocalStorage.setItem("isBankChart", "true");
                    }
                  }}
                >
                  {!isBankChart ? <BarChartOutlined /> : <DashOutlined />}
                </Button>
              </div>
            </Col>
            <Row
              style={{
                width: "100%",
                marginBottom: 16,
                display: "flex",
              }}
              gutter={[16, 16]}
              ref={ref3}
            >
              {isBankChart ? (
                <Col span={24}>
                  <BankBalanceChart />
                </Col>
              ) : (
                <Col span={24}>
                  <Swiper
                    slidesPerView={6}
                    spaceBetween={8}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                    style={{ height: 260, paddingLeft: 32, paddingRight: 32 }}
                    loop={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                      300: {
                        slidesPerView: 1,
                        spaceBetween: 8,
                      },
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 8,
                      },
                      950: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                      },
                      1024: {
                        slidesPerView: 5,
                        spaceBetween: 8,
                      },
                      1400: {
                        slidesPerView: 6,
                        spaceBetween: 8,
                      },
                      1700: {
                        slidesPerView: 7,
                        spaceBetween: 8,
                      },
                      2000: {
                        slidesPerView: 8,
                        spaceBetween: 8,
                      },
                    }}
                  >
                    {bankListData?.itens
                      .filter((b) => b.status === true)
                      .map((bank: any) => (
                        <SwiperSlide key={bank?.id}>
                          <BankCard bank={bank} key={bank.id} />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </Col>
              )}
            </Row>
          </div>
        )}
        <Row gutter={[8, 4]} align="middle" justify="center">
          <Layout
            style={{
              width: "100%",
              marginLeft: "-40px",
              marginRight: "-40px",
              paddingBottom: 20,
              paddingTop: 20,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            <Row gutter={[4, 4]} align="middle">
              <Col xs={{ span: 24 }} md={{ span: 4 }}>
                <Button
                  style={{ width: "100%", height: 40 }}
                  type="primary"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  {t("table.filters")}
                </Button>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 16 }}>
                <FilterChips
                  startDateKeyName="start_date"
                  endDateKeyName="end_date"
                  query={query}
                  setQuery={setQuery}
                  haveInitialDate
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 4 }}>
                <Button
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
              <Col span={24} style={{ marginTop: 16 }}>
                <Divider orientation="left">
                  <Typography.Title level={3} ref={ref4}>
                    {t("table.operations")}
                  </Typography.Title>
                </Divider>
                <ValuesTable
                  query={query}
                  refs={[refType, refOpNum, refOpVal, refTicket, refFee]}
                />
              </Col>
            </Row>
          </Layout>

          <Col
            span={24}
            style={{
              paddingTop: "20px",
              paddingBottom: user.aggregator_id ? "60px" : undefined,
            }}
          >
            <Row gutter={[16, 0]}>
              <Divider orientation="left">
                <Typography.Title level={3} ref={refInOut}>
                  {t("table.in_out_conversion")}
                </Typography.Title>
              </Divider>
              <Col xs={{ span: 24 }} md={{ span: 12 }} ref={refIn}>
                <ChartIn query={query} />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} ref={refOut}>
                <ChartOut query={query} />
              </Col>
            </Row>
          </Col>
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
                marginLeft: -50,
                marginRight: -50,
                marginTop: 25,
                paddingBottom: 20,
                paddingTop: 20,
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              <MerchantsBalance
                ref={refMerchantsBalance}
                refs={[
                  refMerchantname,
                  refTransaction,
                  refPayment,
                  refReserved,
                ]}
              />
            </Layout>
          </Row>
        )}

        {(!error.rankingFee ||
          !error.rankingOperations ||
          !error.rankingValue) && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <TabsTable query={query} />
            </Col>
          </Row>
        )}
      </Col>

      {isFiltersOpen && (
        <FiltersModal
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
      )}
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        steps={[
          (permissions?.report?.merchant?.balance
            ?.report_merchant_balance_list ||
            permissions?.report?.paybrokers?.balance
              ?.report_paybrokers_balance_list) && {
            title: t("wiki.balance"),
            description: (
              <Typography>
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
            target: () => ref1.current,
            nextButtonProps: {
              onClick: () => setActiveKey("2"),
            },
          },
          permissions.report.paybrokers.bank_balance.menu && {
            title: t("menus.organization_bank_balance"),
            description: (
              <Typography>
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
          permissions.report.merchant.balance.menu && {
            title: t("wiki.merchants_balance"),
            description: t("wiki.merchants_balance_description"),
            target: () => refMerchantsBalance.current,
          },
          permissions.report.merchant.balance.menu && {
            title: t("wiki.merchant_name"),
            description: t("wiki.merchant_name_description"),
            target: () => refMerchantsBalance.current,
          },
          permissions.report.merchant.balance.menu && {
            title: t("wiki.balance_to_transaction"),
            description: t("wiki.balance_to_transaction_description"),
            target: () => refMerchantsBalance.current,
          },
          permissions.report.merchant.balance.menu && {
            title: t("wiki.balance_to_payment"),
            description: t("wiki.balance_to_payment_description"),
            target: () => refMerchantsBalance.current,
          },
          permissions.report.merchant.balance.menu && {
            title: t("wiki.balance_reserved"),
            description: t("wiki.balance_reserved_description"),
            target: () => refMerchantsBalance.current,
          },
        ]}
        pageStep={{
          title: t("menus.dashboard"),
          description: t("wiki.dashboard_description"),
        }}
      />
    </Row>
  );
};
