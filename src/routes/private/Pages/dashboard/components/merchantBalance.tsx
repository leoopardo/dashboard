/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetMerchantBalanceTotal } from "@src/services/consult/merchant/balance/getMerchantBalanceTotal";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

interface MerchantBalanceInterface {
  customQuery?: any;
}

export const MerchantBalance = ({ customQuery }: MerchantBalanceInterface) => {
  const { t } = useTranslation();
  const [isHoverCurrency] = useState<"real" | "dolar" | "euro" | "btc">("real");
  const [show] = useState<boolean>(true);
  const INITIAL_QUERY: MerchantBalanceQuery = {
    page: 1,
    limit: 10,
  };
  const [query] = useState<MerchantBalanceQuery>(INITIAL_QUERY);
  const { MerchantBalance, isMerchantBalanceFetching, refetchMerchantBalance } =
    useGetMerchantBalanceTotal(customQuery || query);

  useEffect(() => {
    refetchMerchantBalance();
  }, [customQuery]);

  return (
    <Row align="top" style={{ width: "100%" }} gutter={[8, 8]}>
      {show && (
        <>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card
              data-test-id="card-1"
              bordered={false}
              loading={isMerchantBalanceFetching}
              style={{ minWidth: "100%" }}
            >
              {isHoverCurrency === "real" ? (
                <Statistic
                  data-test-id="statistic-1"
                  title={t("table.balance_to_transactions")}
                  value={moneyFormatter(
                    MerchantBalance?.balance_to_transactions || 0
                  )}
                  precision={2}
                  valueStyle={{
                    color: defaultTheme.colors.info,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    data-test-id="statistic-2"
                    title={t("table.balance_to_transactions")}
                    value={moneyFormatter(
                      MerchantBalance?.balance_to_transactions || 0
                    )}
                    precision={2}
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {/* {isHoverCurrency === "dolar" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.info,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_to_transactions ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "euro" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.info,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_to_transactions ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "btc" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.info,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_to_transactions ?? 0)}
                </Typography.Title>
              )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card
              data-test-id="card-2"
              bordered={false}
              loading={isMerchantBalanceFetching}
            >
              {isHoverCurrency === "real" ? (
                <Statistic
                  data-test-id="statistic-3"
                  title={t("table.balance_to_payment")}
                  value={moneyFormatter(
                    MerchantBalance?.balance_to_payment || 0
                  )}
                  precision={2}
                  valueStyle={{
                    color: defaultTheme.colors.error,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    data-test-id="statistic-4"
                    title={t("table.balance_to_payment")}
                    value={moneyFormatter(
                      MerchantBalance?.balance_to_payment || 0
                    )}
                    precision={2}
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}
              {/* 
              {isHoverCurrency === "dolar" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.error,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_to_payment ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "euro" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.error,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_to_payment ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "btc" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.error,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_to_payment ?? 0)}
                </Typography.Title>
              )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card
              data-test-id="card-3"
              bordered={false}
              loading={isMerchantBalanceFetching}
            >
              {isHoverCurrency === "real" ? (
                <Statistic
                  data-test-id="statistic-5"
                  title={t("table.balance_reserved")}
                  value={moneyFormatter(MerchantBalance?.balance_reserved || 0)}
                  precision={2}
                  valueStyle={{
                    color: defaultTheme.colors.waiting,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    data-test-id="statistic-6"
                    title={t("table.balance_reserved")}
                    value={moneyFormatter(
                      MerchantBalance?.balance_reserved || 0
                    )}
                    precision={2}
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {/* {isHoverCurrency === "dolar" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.waiting,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_reserved ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "euro" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.waiting,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_reserved ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "btc" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.waiting,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_reserved ?? 0)}
                </Typography.Title>
              )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card
              data-test-id="card-4"
              bordered={false}
              loading={isMerchantBalanceFetching}
            >
              {isHoverCurrency === "real" ? (
                <Statistic
                  data-test-id="statistic-7"
                  title="Total"
                  value={moneyFormatter(MerchantBalance?.balance_total || 0)}
                  precision={2}
                  valueStyle={{
                    color: defaultTheme.colors.secondary,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    data-test-id="statistic-8"
                    title="Total"
                    value={moneyFormatter(MerchantBalance?.balance_total || 0)}
                    precision={2}
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {/* {isHoverCurrency === "dolar" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.secondary,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.usd_balance_total ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "euro" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.secondary,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.eur_balance_total ?? 0)}
                </Typography.Title>
              )}

              {isHoverCurrency === "btc" ? (
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    color: defaultTheme.colors.secondary,
                    fontSize: "22px",
                  }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {moneyFormatter(MerchantBalance?.btc_balance_total ?? 0)}
                </Typography.Title>
              )} */}
            </Card>
          </Col>
        
        </>
      )}
    </Row>
  );
};
