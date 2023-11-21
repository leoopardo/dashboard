import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import fastpixBanner from "@assets/fastpix-banner.png";
import logo from "@assets/paysbet.png";
import type { MenuProps } from "antd";
import { Carousel, Col, Layout, Menu, Row, Space, Typography, theme, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";

const { Header, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "40dvh",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export const Paysbet = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: 30,
          backgroundColor: "#fff",
        }}
      >
        <Row style={{ width: "100%" }}>
          <Col span={4}>
            {" "}
            <img src={logo} />
          </Col>
        </Row>
        <Col span={4}>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items1}
            style={{ width: "100%" }}
          />
        </Col>
      </Header>
      <Layout style={{ height: "93dvh" }}>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: "0 16px 16px" }}>
          <Row style={{ padding: 20, margin: 0, minHeight: "80dvh" }}>
            <Col span={24}>
              <Carousel style={{borderRadius: 16}}>
                <div>
                  <img src={fastpixBanner} style={{ width: "100%", height: "65dvh", borderRadius: 8 }} />
                </div>
                <div>
                  <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                  <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                  <h3 style={contentStyle}>4</h3>
                </div>
              </Carousel>
            </Col>
          </Row>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Typography
              style={{
                fontSize: "16px",
                margin: "28px 0 28px 32px",
              }}
            >
              Último Jogos
            </Typography>

            <Space direction="vertical" style={{ background: "white" }}>
              <Image
                width={310}
                height={121}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />

              <Space
                style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "17px",
                }}
              >
                <Space
                  direction="vertical"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "white",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    borderRadius: "11px",
                    width: "93px",
                    minHeight: "43px",
                    padding: '5px',
                    gap: 0,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#3FBCBC",
                      lineHeight: "22px",
                    }}
                  >
                    3.45
                  </Typography>

                  <Typography style={{ lineHeight: "22px", fontSize: "16px" }}>
                    Brasil
                  </Typography>
                </Space>

                <Space
                  direction="vertical"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "white",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    borderRadius: "11px",
                    width: "93px",
                    minHeight: "43px",
                    padding: '5px',
                    gap: 0,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#3FBCBC",
                      lineHeight: "22px",
                    }}
                  >
                    2.32
                  </Typography>

                  <Typography style={{ lineHeight: "22px", fontSize: "16px" }}>
                    Empate
                  </Typography>
                </Space>

                <Space
                  direction="vertical"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "white",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    borderRadius: "11px",
                    width: "93px",
                    minHeight: "43px",
                    padding: '5px',
                    gap: 0,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#3FBCBC",
                      lineHeight: "22px",
                    }}
                  >
                    1.47
                  </Typography>

                  <Typography style={{ lineHeight: "22px", fontSize: "16px" }}>
                    Argentina
                  </Typography>
                </Space>
              </Space>
            </Space>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
