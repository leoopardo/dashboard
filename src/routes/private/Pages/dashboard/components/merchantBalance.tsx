import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useGetMerchantBalance } from "@src/services/consult/merchant/balance/getMerchantBalance";
import { MerchantBalanceQuery } from "@src/services/types/consult/merchant/balance";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Col, Layout, Row, Statistic, Typography } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export const MerchantBalance = () => {
  const [isHoverCurrency, setIsHoverCurrency] = useState<
    "real" | "dolar" | "euro" | "btc"
  >("real");
  const [show, setShow] = useState<boolean>(true);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const INITIAL_QUERY: MerchantBalanceQuery = {
    page: 1,
    limit: 25,
  };
  const [query, setQuery] = useState<MerchantBalanceQuery>(INITIAL_QUERY);
  const { MerchantBalance, isMerchantBalanceFetching } =
    useGetMerchantBalance(query);

  return (
    <Layout style={{ margin: -28, padding: 28 }}>
      <Row align="middle" style={{ width: "100%", maxWidth: "1600px" }} gutter={[8, 8]}>
        <Col
          xs={{ span: 24 }}
          md={{ span: 4 }}
          style={{ minWidth: isMerchantBalanceFetching ? "222px" : undefined }}
        >
          <Card >
            <Typography.Title
              level={3}
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexDirection: "column",
                color: defaultTheme.colors.secondary,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: !isMobile ? "center" : "space-between",
                }}
              >
                {isMobile && (
                  <>
                    {show ? (
                      <EyeInvisibleOutlined onClick={() => setShow(false)} />
                    ) : (
                      <EyeOutlined onClick={() => setShow(true)} />
                    )}
                  </>
                )}
              </div>
              Saldos Empresa
            </Typography.Title>
          </Card>
        </Col>

        {show && (
          <>
            <Col xs={{ span: 24 }} md={{ span: 5 }} style={{ minWidth: isMerchantBalanceFetching ? "220px" : undefined }}>
              <Card
                bordered={false}
                loading={isMerchantBalanceFetching}
                style={{ minWidth: "100%" }}
              >
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta transacional"
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
                      title="Conta transacional"
                      value={MerchantBalance?.balance_to_transactions ?? 0}
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
                    }).format(1479969.35)}
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
                    }).format(1479969.35)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
                  </Typography.Title>
                )} */}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }} style={{ minWidth: isMerchantBalanceFetching ? "220px" : undefined }}>
              <Card bordered={false} loading={isMerchantBalanceFetching}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta pagamento"
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
                      title="Conta pagamento"
                      value={MerchantBalance?.balance_to_payment ?? 0}
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
                    }).format(1479969.35)}
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
                    }).format(1479969.35)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
                  </Typography.Title>
                )} */}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }} style={{ minWidth: isMerchantBalanceFetching ? "220px" : undefined }}>
              <Card bordered={false} loading={isMerchantBalanceFetching}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta Segurança"
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
                      title="Conta Segurança"
                      value={7325256.32}
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
                      color: defaultTheme.colors.waiting,
                      fontSize: "22px",
                    }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(1479969.35)}
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
                    }).format(1479969.35)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
                  </Typography.Title>
                )} */}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }} style={{ minWidth: isMerchantBalanceFetching ? "220px" : undefined }}>
              <Card bordered={false} loading={isMerchantBalanceFetching}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Total"
                    value={MerchantBalance?.balance_reserved_total ?? 0}
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
                      value={MerchantBalance?.balance_reserved_total ?? 0}
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
                      color: defaultTheme.colors.secondary,
                      fontSize: "22px",
                    }}
                    onMouseEnter={() => setIsHoverCurrency("dolar")}
                    onMouseLeave={() => setIsHoverCurrency("real")}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "USD",
                    }).format(1479969.35)}
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
                    }).format(1479969.35)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
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
                    }).format(1347148.8)}
                  </Typography.Title>
                )} */}
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Layout>
  );
};
