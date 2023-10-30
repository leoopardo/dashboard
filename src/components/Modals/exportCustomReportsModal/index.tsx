/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  notification,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCSVDownloader } from "react-papaparse";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

interface ExportCustomreportsInterface {
  mutateReport: () => void;
  reportPath: string;
  reportPageName?: string;
  fields?: string[] | null;
  success: boolean;
  loading: boolean;
  disabled?: boolean;
  error: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setCsvFields: Dispatch<SetStateAction<any>>;
  csvFields: any;
  comma: boolean;
  setIsComma: Dispatch<SetStateAction<boolean>>;
  reportName: string;
}

type NotificationType = "success" | "info" | "warning" | "error";

export const ExportCustomReportsModal = ({
  error,
  fields,
  mutateReport,
  reportPath,
  success,
  reportPageName,
  setCsvFields,
  open,
  setOpen,
  comma,
  setIsComma,
  reportName,
}: ExportCustomreportsInterface) => {
  const { t } = useTranslation();

  const { CSVDownloader } = useCSVDownloader();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [preview, setPreview] = useState<any>();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const f: any = {};
    for (const field in selectedFields) {
      f[selectedFields[field]] = t(`table.${selectedFields[field]}`);
    }
    setCsvFields(f);
  }, [selectedFields]);

  const handleCreateReport = () => {
    mutateReport();
    secureLocalStorage.setItem(reportName, selectedFields.join("%"));
    secureLocalStorage.setItem("comma", `${comma}`);
    setOpen(false);
  };

  useEffect(() => {
    const storage: string[] | undefined = secureLocalStorage?.getItem(
      reportName
    )
      ? `${secureLocalStorage?.getItem(reportName)}`?.split("%")
      : undefined;

    const commaSeparator: string | null = `${secureLocalStorage.getItem(
      "comma"
    )}`;
    if (storage) setSelectedFields(storage);
    if (commaSeparator) setIsComma(commaSeparator == "true");
  }, []);

  useEffect(() => {
    const obj1: any = {};
    const obj2: any = {};
    const obj3: any = {};

    for (const field in selectedFields) {
      obj1[t(`table.${selectedFields[field]}`)] = `${t(
        `table.${selectedFields[field]}`
      )} 1`;
      obj2[t(`table.${selectedFields[field]}`)] = `${t(
        `table.${selectedFields[field]}`
      )} 2`;
      obj3[t(`table.${selectedFields[field]}`)] = `${t(
        `table.${selectedFields[field]}`
      )} 3`;
    }
    setPreview([obj1, obj2, obj3]);
  }, [selectedFields]);

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

    if (error) {
      toast.error(
        t("messages.action_error", {
          action: t("messages.export_csv"),
        })
      );
    }
  }, [error, success]);

  return (
    <>
      {contextHolder}
      <Modal
        title={t("messages.export_csv")}
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: selectedFields.length === 0 }}
        onOk={handleCreateReport}
      >
        <Row style={{ maxHeight: "450px", overflow: "auto" }}>
          <Col span={24}>
            <Form layout="vertical">
              <Form.Item label={t("input.comma_separator")}>
                <Radio.Group
                  options={[
                    { label: "$1000,00", value: true },
                    { label: "$1000.00", value: false },
                  ]}
                  onChange={(e) => setIsComma(e.target.value)}
                  value={comma}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
              <Form.Item label={t("input.csv_columns")} required>
                <Space.Compact style={{ width: "100%" }} size="large">
                  <Select
                    style={{ width: "100%" }}
                    options={fields?.map((field) => {
                      return {
                        title: field,
                        value: t(`table.${field}`),
                      };
                    })}
                    value={selectedFields.map((field) => {
                      return { title: field, value: t(`table.${field}`) };
                    })}
                    mode="multiple"
                    onChange={(_value, option) => {
                      setSelectedFields(
                        (option as { title: string; value: string }[])?.map(
                          (i) => {
                            return i.title;
                          }
                        )
                      );
                    }}
                  />
                </Space.Compact>
              </Form.Item>
            </Form>
          </Col>
          {selectedFields.length >= 1 && (
            <Col span={24}>
              <Typography>{t("messages.preview_csv")}</Typography>
              <CSVDownloader
                filename="preview"
                config={{
                  delimiter: ";",
                }}
                data={preview}
              >
                <a>
                  <DownloadOutlined style={{ fontSize: 18, marginRight: 8 }} />
                  {t("actions.download")} {t("messages.preview_file")}
                </a>
              </CSVDownloader>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};
