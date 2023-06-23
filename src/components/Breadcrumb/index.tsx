import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMenu } from "../../contexts/SidebarContext";

export const BreadcrumbComponent = () => {
  const { t } = useTranslation();
  const { handleChangeSidebar } = useMenu();
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
        return { title: t(`menus.${value}`) };
      })
    );

    document.title = `${l
      .map((value) => t(`menus.${value}`))
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

  return <Breadcrumb items={breadcrumbs} style={{ margin: "16px 0", fontSize: "16px" }} />;
};
