/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReloadOutlined } from "@ant-design/icons";
import { useGetMerchantBalanceTotal } from "@src/services/consult/merchant/balance/getMerchantBalanceTotal";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Button, Card, Col, Row, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MerchantBalanceInterface {
  customQuery?: any;
}

export const MerchantBalance = ({ customQuery }: MerchantBalanceInterface) => {
  const { t } = useTranslation();
  const [isHoverCurrency, setIsHoverCurrency] = useState<
    "real" | "dolar" | "euro" | "btc"
  >("real");
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
    <Row align="middle" style={{ width: "100%" }} gutter={[8, 8]}>
      {show && (
        <>
          <Col
            xs={{ span: 24 }}
            md={{ span: 5 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card
              bordered={false}
              loading={isMerchantBalanceFetching}
              style={{ minWidth: "100%" }}
            >
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_to_transactions")}
                  value={MerchantBalance?.balance_to_transactions ?? 0}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    color: defaultTheme.colors.info,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    title={t("table.balance_to_transactions")}
                    value={MerchantBalance?.balance_to_transactions ?? 0}
                    precision={2}
                    prefix="R$"
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {isHoverCurrency === "dolar" ? (
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_to_transactions ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_to_transactions ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_to_transactions ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_to_transactions ?? 0)}
                </Typography.Title>
              )}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isMerchantBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_to_payment")}
                  value={MerchantBalance?.balance_to_payment ?? 0}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    color: defaultTheme.colors.error,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    title={t("table.balance_to_payment")}
                    value={MerchantBalance?.balance_to_payment ?? 0}
                    precision={2}
                    prefix="R$"
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_to_payment ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_to_payment ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_to_payment ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_to_payment ?? 0)}
                </Typography.Title>
              )}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isMerchantBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_reserved")}
                  value={MerchantBalance?.balance_reserved ?? 0}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    color: defaultTheme.colors.waiting,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    title={t("table.balance_reserved")}
                    value={MerchantBalance?.balance_reserved ?? 0}
                    precision={2}
                    prefix="R$"
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {isHoverCurrency === "dolar" ? (
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_reserved ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_reserved ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_reserved ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_reserved ?? 0)}
                </Typography.Title>
              )}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 6 }}
            style={{
              minWidth: isMerchantBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isMerchantBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title="Total"
                  value={MerchantBalance?.balance_total}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    color: defaultTheme.colors.secondary,
                    fontSize: "22px",
                  }}
                />
              ) : (
                <>
                  <Statistic
                    title="Total"
                    value={MerchantBalance?.balance_total}
                    precision={2}
                    prefix="R$"
                    valueStyle={{
                      fontSize: "16px",
                    }}
                  />
                </>
              )}

              {isHoverCurrency === "dolar" ? (
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("dolar")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "USD",
                  }).format(MerchantBalance?.usd_balance_total ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("euro")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(MerchantBalance?.eur_balance_total ?? 0)}
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
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_total ?? 0)}
                </Typography.Title>
              ) : (
                <Typography.Title
                  level={5}
                  style={{ margin: 0 }}
                  onMouseEnter={() => setIsHoverCurrency("btc")}
                  onMouseLeave={() => setIsHoverCurrency("real")}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BTC",
                  }).format(MerchantBalance?.btc_balance_total ?? 0)}
                </Typography.Title>
              )}
            </Card>
          </Col>
          <Col
            xs={24}
            md={1}
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "flex-start",
              height: "160px",
            }}
          >
            <Button
              type="link"
              loading={isMerchantBalanceFetching}
              onClick={refetchMerchantBalance}
            >
              {!isMerchantBalanceFetching && <ReloadOutlined />}
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
};
