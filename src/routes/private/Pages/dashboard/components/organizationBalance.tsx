import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import PaidIcon from "@mui/icons-material/Paid";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Col, Divider, Layout, Row, Statistic, Typography } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export const OrganizationBalance = () => {
  const [isHoverCurrency, setIsHoverCurrency] = useState<
    "real" | "dolar" | "euro" | "btc"
  >("real");
  const [show, setShow] = useState<boolean>(true);
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  return (
    <Layout style={{ margin: -28, padding: 20 }}>
      <Row align="middle" style={{ width: "100%" }} gutter={[8, 8]}>
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Card>
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
              {" "}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: !isMobile ? "center" : "space-between",
                }}
              >
                <PaidIcon style={{ marginRight: 8 }} />
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
              Saldos organização
            </Typography.Title>
          </Card>
        </Col>
        {show && (
          <>
            {" "}
            <Col xs={{ span: 24 }} md={{ span: 5 }}>
              <Card bordered={false}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta transacional"
                    value={7325256.32}
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
                      value={7325256.32}
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
                )}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }}>
              <Card bordered={false}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta pagamento"
                    value={7325256.32}
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
                      value={7325256.32}
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
                )}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }}>
              <Card bordered={false}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Conta Segurança"
                    value={7325256.32}
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
                )}
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 5 }}>
              <Card bordered={false}>
                {isHoverCurrency === "real" ? (
                  <Statistic
                    title="Total"
                    value={7325256.32}
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
                      value={7325256.32}
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
                )}
              </Card>
            </Col>
            
          </>
        )}<Col span={24}>
        <Divider
          style={{ width: "100%", margin: 20, marginTop: 5 }}
          orientation="left"
        />
      </Col>
      </Row>
    </Layout>
  );
};
