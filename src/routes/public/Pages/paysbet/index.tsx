import { Layout, Menu, Typography, Space, Image } from "antd";
import type { MenuProps } from "antd";
import { HomeOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Início", "sub1", <HomeOutlined />),

  getItem("Apostas ao vivo", "sub2", <ClockCircleOutlined />, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),

  getItem("Jogos", "sub4", <ClockCircleOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),

  getItem("Jogos ao vivo", "sub5", <ClockCircleOutlined />, [
    getItem("Aviãozinho", "9"),
    getItem("Cassino", "sub3", null, [
      getItem("Roleta", "7"),
      getItem("Cartas", "8"),
    ]),
    getItem("Carrinhos", "11"),
  ]),

  getItem("Futebol", "sub6", <ClockCircleOutlined />),

  getItem("Jogos eletrônicos", "sub7", <ClockCircleOutlined />, [
    getItem("Aviãozinho", "9"),
    getItem("Cassino", "sub3", null, [
      getItem("Roleta", "7"),
      getItem("Cartas", "8"),
    ]),
    getItem("Carrinhos", "11"),
  ]),
];

export const Paysbet = () => {
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Typography
          style={{ fontSize: "32px", fontWeight: 700, color: "#3FBCBC" }}
        >
          Pays Bet
        </Typography>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]} />
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100vh", borderRight: 0, width: "242px" }}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px", marginLeft: "23px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Space
              style={{ height: "452px", background: "white", width: "100%" }}
            >
              test
            </Space>

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
