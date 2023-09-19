import {
  Button,
  Col,
  Descriptions,
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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
}

type NotificationType = "success" | "info" | "warning" | "error";

export const ExportCustomReportsModal = ({
  error,
  fields,
  loading,
  mutateReport,
  reportPath,
  success,
  reportPageName,
  setCsvFields,
  open,
  setOpen,
  comma,
  setIsComma,
}: ExportCustomreportsInterface) => {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
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
    localStorage.setItem("depositReportsFields", selectedFields.join("%"));
    localStorage.setItem("coomma", `${comma}`);
    setOpen(false);
  };

  useEffect(() => {
    const storage: string[] | undefined = localStorage
      .getItem("depositReportsFields")
      ?.split("%");

    console.log(storage, fields);

    if (storage) setSelectedFields(storage);
  }, []);

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
    <>
      {" "}
      {contextHolder}
      <Modal
        title={t("messages.export_csv")}
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: selectedFields.length === 0 }}
        onOk={handleCreateReport}
      >
        <Row gutter={[8, 8]} style={{ maxHeight: "450px", overflow: "auto" }}>
          <Col span={24}>
            <Form layout="vertical">
              <Form.Item label={t("input.comma_separator")}>
                <Radio.Group
                  options={[
                    { label: "$ 1234,56", value: true },
                    { label: "$ 1234.56", value: false },
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
                      return { title: field, value: t(`table.${field}`) };
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
            <Col span={24} style={{ maxWidth: "100%", overflow: "auto" }}>
              <Typography>Prévia do CSV</Typography>
              <Descriptions
                column={selectedFields.length}
                bordered
                layout="vertical"
              >
                {selectedFields.map((field) => (
                  <Descriptions.Item label={t(`table.${field}`)}>
                    {t(`table.${field}`)} data
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};
