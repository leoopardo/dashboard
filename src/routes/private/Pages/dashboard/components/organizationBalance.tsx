/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetOrganizationBalance } from "@src/services/consult/organization/balance/getPerBank";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Col, Row, Statistic } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const OrganizationBalance = () => {
  const { t } = useTranslation();
  const {
    OrganizationBalance,

    isOrganizationBalanceFetching,
  } = useGetOrganizationBalance();
  const [
    isHoverCurrency,
    //setIsHoverCurrency
  ] = useState<"real" | "dolar" | "euro" | "btc">("real");
  const [show] = useState<boolean>(true);
  return (
    <Row
      align="middle"
      style={{ width: "100%", maxWidth: "1600px" }}
      gutter={[8, 8]}
    >
      {show && (
        <>
          {" "}
          <Col
            xs={{ span: 24 }}
               md={{ span: 6 }}
            style={{
              minWidth: isOrganizationBalanceFetching ? "222px" : undefined,
            }}
          >
            <Card bordered={false} loading={isOrganizationBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_to_transactions")}
                  value={OrganizationBalance?.balance_to_transactions ?? 0}
                  loading={isOrganizationBalanceFetching}
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
                    value={OrganizationBalance?.balance_to_transactions ?? 0}
                    loading={isOrganizationBalanceFetching}
                    precision={2}
                    prefix="R$"
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
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
                  </Typography.Title>
                ) : (
                  <Typography.Title
                    level={5}
                    style={{ margin: 0 }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
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
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
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
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
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
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
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
                    }).format(
                      OrganizationBalance?.balance_to_transactions ?? 0
                    )}
                  </Typography.Title>
                )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
               md={{ span: 6 }}
            style={{
              minWidth: isOrganizationBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isOrganizationBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_to_payment")}
                  value={OrganizationBalance?.balance_to_payment ?? 0}
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
                    value={OrganizationBalance?.balance_to_payment ?? 0}
                    precision={2}
                    prefix="R$"
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
                      color: defaultTheme.colors.error,
                      fontSize: "22px",
                    }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
                  </Typography.Title>
                ) : (
                  <Typography.Title
                    level={5}
                    style={{ margin: 0 }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
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
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
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
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
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
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
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
                    }).format(OrganizationBalance?.balance_to_payment ?? 0)}
                  </Typography.Title>
                )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
               md={{ span: 6 }}
            style={{
              minWidth: isOrganizationBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isOrganizationBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title={t("table.balance_reserved")}
                  value={OrganizationBalance?.balance_reserved ?? 0}
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
                    value={OrganizationBalance?.balance_reserved ?? 0}
                    precision={2}
                    prefix="R$"
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
                      color: defaultTheme.colors.waiting,
                      fontSize: "22px",
                    }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
                  </Typography.Title>
                ) : (
                  <Typography.Title
                    level={5}
                    style={{ margin: 0 }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
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
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
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
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
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
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
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
                    }).format(OrganizationBalance?.balance_reserved ?? 0)}
                  </Typography.Title>
                )} */}
            </Card>
          </Col>
          <Col
            xs={{ span: 24 }}
               md={{ span: 6 }}
            style={{
              minWidth: isOrganizationBalanceFetching ? "220px" : undefined,
            }}
          >
            <Card bordered={false} loading={isOrganizationBalanceFetching}>
              {isHoverCurrency === "real" ? (
                <Statistic
                  title="Total"
                  value={OrganizationBalance?.balance_total ?? 0}
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
                    value={OrganizationBalance?.balance_total ?? 0}
                    precision={2}
                    prefix="R$"
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
                      color: defaultTheme.colors.secondary,
                      fontSize: "22px",
                    }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_total ?? 0)}
                  </Typography.Title>
                ) : (
                  <Typography.Title
                    level={5}
                    style={{ margin: 0 }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(OrganizationBalance?.balance_total ?? 0)}
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
                    }).format(OrganizationBalance?.balance_total ?? 0)}
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
                    }).format(OrganizationBalance?.balance_total ?? 0)}
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
                    }).format(OrganizationBalance?.balance_total ?? 0)}
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
                    }).format(OrganizationBalance?.balance_total ?? 0)}
                  </Typography.Title>
                )} */}
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
};
