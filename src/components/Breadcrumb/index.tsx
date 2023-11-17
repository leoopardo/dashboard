/* eslint-disable react-hooks/exhaustive-deps */
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Typography } from "antd";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

export const BreadcrumbComponent = () => {
  const { t } = useTranslation();
  // const { handleChangeSidebar } = useMenu();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [breadcrumbs, setBreadcrumbs] = useState<
    Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
  >([{ title: <HomeOutlined style={{ fontSize: 16 }} /> }]);
  const location = useLocation();
  const translation = useTranslation().i18n.language;
  

  const isNotPath: string[] = [
    "register",
    "organization",
    "organization_reports",
    "aggregator",
    "aggregator_blacklist",
    "aggregator_reports",
    "details",
    "partner",
    "partner_reports",
    "operator",
    "operator_reports",
    "merchant",
    "merchant_blacklists",
    "merchant_reports",
    "person",
    "update",
    "person_reports",
    "moviment",
    "organization_moviments",
    "merchant_moviments",
    "consult",
    "consult_organization",
    "consult_merchant",
    "deposit",
    "deposits_reports",
    "withdrawals",
    "withdrawals_reports",
    "refunds",
    "consult_persons",
    "refund_reports",
    "support",
    "blacklists",
    "blacklists_reports",
    "refunded",
    "blacklist",
    "update",
    "api_logs",
    "person_blacklist",
    "aggregator_moviments",
    "aggregator_moviments_reports",
    "merchant_moviments_reports",
    "organization_moviments_reports",
  ];

  useEffect(() => {
    const l = location.pathname.split("/");
    l.shift();
    setBreadcrumbs(
      l.map((value, index) => {
        switch (value) {
          case "dashboard":
            return {
              title: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    <HomeOutlined style={{ fontSize: 18, marginRight: 8 }} />/{" "}
                    {import.meta.env.VITE_APP_COMPANY_NAME}
                  </Typography.Title>
                </div>
              ),
            };

          default:
            return {
              title:
                isNotPath.includes(value) || +value ? (
                  <>
                    {index === 0 && (
                      <>
                        <a href="/dashboard">
                          <HomeOutlined style={{ fontSize: 16 }} />
                        </a>{" "}
                        /{" "}
                      </>
                    )}
                    {value.includes("%20")
                      ? value.split("%20").join(".")
                      : Number(value)
                      ? value
                      : t(`menus.${value}`)}
                  </>
                ) : (
                  <>
                    {index === 0 && <HomeOutlined />}
                    <a href={`/${l.slice(0, l.indexOf(value) + 1).join("/")}`}>
                      {value.includes("%20")
                        ? value.split("%20").join(".")
                        : Number(value)
                        ? value
                        : t(`menus.${value}`)}
                    </a>
                  </>
                ),
            };
        }
      })
    );

    document.title = `${l
      .map((value) =>
        value.includes("%20")
          ? value.split("%20").join(" ")
          : Number(value)
          ? value
          : t(`menus.${value}`)
      )
      .join(" - ")} | ${import.meta.env.VITE_APP_COMPANY_NAME}`;
     
  }, [location, translation]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location]);

  return (
    <Breadcrumb
      items={breadcrumbs}
      style={{ margin: isMobile ? "16px 32px" : "16px 0", fontSize: "16px" }}
    />
  );
};
