import { useMediaQuery } from "react-responsive";
import { Grid } from "@mui/material";
import { BreadcrumbComponent } from "../Breadcrumb";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import brazil from "../../assets/brazil-.png";
import eua from "../../assets/united-states.png";
import { defaultTheme } from "../../styles/defaultTheme";

export const PageHeader = () => {
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const translation = useTranslation().i18n.language;

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const items: MenuProps["items"] = [
    {
      key: "pt-BR",
      label: t("menus.portuguese"),
      icon: <Avatar src={brazil} />,
      onClick: () => changeLanguage("ptbr"),
    },
    {
      key: "en",
      label: t("menus.english"),
      icon: <Avatar src={eua} />,
      onClick: () => changeLanguage("en"),
    },
  ];
  return !isMobile ? (
    <Grid
      container
      style={{
        width: "100%",
      }}
    >
      <Grid item xs={12} md={9} lg={9} style={{ paddingLeft: "25px" }}>
        <BreadcrumbComponent />
      </Grid>

      <Grid
        item
        xs={12}
        md={3}
        lg={3}
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        paddingRight: "20px"
        }}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {" "}
              {translation === "ptbr" ? (
                <Avatar
                  style={{ height: "25px", width: "25px" }}
                  src={brazil}
                />
              ) : (
                <Avatar style={{ height: "25px", width: "25px" }} src={eua} />
              )}
              {t("menus.language")}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

        <Avatar
          style={{
            backgroundColor: defaultTheme.colors.secondary,
            minHeight: "40px",
            minWidth: "40px",
            display: "flex",
            alignItems: "center",
            marginLeft: "20px"
          }}
        >
          {user?.name.toLocaleUpperCase()[0]}
        </Avatar>
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      style={{
        width: "100%",
        display: isMobile ? "inherit" : "none",
      }}
    >
      <Grid
        item
        xs={12}
        md={2}
        lg={2}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingLeft: "50%",
          paddingTop: "15px",
          paddingBottom: "15px",
        }}
      >
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {translation === "ptbr" ? (
                <Avatar
                  style={{ height: "25px", width: "25px" }}
                  src={brazil}
                />
              ) : (
                <Avatar style={{ height: "25px", width: "25px" }} src={eua} />
              )}
              {t("menus.language")}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Avatar
          style={{
            backgroundColor: defaultTheme.colors.secondary,
            minHeight: "40px",
            minWidth: "40px",
            display: "flex",
            alignItems: "center",
            marginLeft: "20px"
          }}
        >
          {user?.name.toLocaleUpperCase()[0]}
        </Avatar>
      </Grid>

      <Grid
        item
        xs={12}
        md={10}
        lg={10}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BreadcrumbComponent />
      </Grid>
    </Grid>
  );
};
