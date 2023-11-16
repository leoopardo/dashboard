/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ExportReportsInterface {
  mutateReport: () => void;
  reportPath: string;
  reportPageName?: string;
  success: boolean;
  loading: boolean;
  disabled?: boolean;
  error: any;
}

type NotificationType = "success" | "info" | "warning" | "error";

export const ExportReportsModal = ({
  mutateReport,
  reportPath,
  reportPageName,
  error,
  success,
  loading,
  disabled,
}: ExportReportsInterface) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const openNotificationWithIcon = (type: NotificationType) => {
    const BtnNavigate = (
      <Button onClick={() => navigate(reportPath)}>
        {reportPageName ?? t("menus.reports")}
      </Button>
    );
    api[type]({
      message: t("messages.creating_csv"),
      description: t("messages.creating_csv_message"),
      duration: 0,
      btn: BtnNavigate,
    });
  };

  useEffect(() => {
    if (success) {
      openNotificationWithIcon("info");
    }
  }, [error, success]);

  return (
    <Popconfirm
      title={t("messages.export_csv")}
      description={t("messages.csv_confirm")}
      onConfirm={() => {
        mutateReport();
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      open={open}
      okText={t("messages.yes_create")}
      cancelText={t("messages.no_cancel")}
      placement="bottom"
    >
      {contextHolder}
      <Tooltip
        placement="topRight"
        title={
          disabled
            ? t("messages.no_records_to_export")
            : t("messages.export_csv")
        }
        arrow
        
      >
        <Button
          disabled={disabled}
          style={{ width: "100%" }}
          size="large"
          type="default"
          shape="round"
          onClick={() => setOpen(true)}
          loading={loading}
          icon={<FileAddOutlined style={{ fontSize: 22 }} />}
        >
          CSV
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};
