/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb } from "antd";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import { useMenu } from "../../contexts/SidebarContext";

export const BreadcrumbComponent = () => {
  const { t } = useTranslation();
  const { handleChangeSidebar } = useMenu();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [breadcrumbs, setBreadcrumbs] = useState<
    Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
  >([{ title: "home" }]);

  const location = useLocation();
  const translation = useTranslation().i18n.language;
  useEffect(() => {
    const l = location.pathname.split("/");
    l.shift();
    setBreadcrumbs(
      l.map((value) => {
        return {
          title: value.includes("%20")
            ? value.split("%20").join(".")
            : Number(value)
            ? value
            : t(`menus.${value}`),
        };
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
      .join(" - ")} | Paybrokers`;
  }, [location, translation]);

  useEffect(() => {
    handleChangeSidebar(false);
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
