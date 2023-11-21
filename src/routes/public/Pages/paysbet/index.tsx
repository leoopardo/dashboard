import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Carousel, Col, Layout, Menu, Row, theme } from "antd";
import React from "react";
import logo from "@assets/paysbet.png";
import fastpixBanner from "@assets/fastpix-banner.png";

const { Header, Content, Sider } = Layout;

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
        </Layout>
      </Layout>
    </Layout>
  );
};
