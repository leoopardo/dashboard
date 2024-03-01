/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateCustomDepositWebhook } from "@src/services/register/partner/configs/createCustomWebhookDeposit";
import { useDeleteCustomDepositWebhook } from "@src/services/register/partner/configs/deleteCustomWebhookDeposit";
import { useCustomWebhookDeposit } from "@src/services/register/partner/configs/getCustomWebhookDeposit";
import { DepositFields } from "@src/services/types/register/partners/configs/partnerConfigs.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  Row,
  Col,
  Form,
  Switch,
  Space,
  Select,
  Collapse,
  Popconfirm,
  Button,
  CollapseProps,
  FormInstance,
  Alert,
  message,
} from "antd";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";

export const TabDepositWebhook = ({
  currentPartner,
}: {
  currentPartner: number;
}) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const formDepositRef = useRef<FormInstance>(null);

  const [depositWebhookStandard, setDepositWebhookStandard] =
    useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [selectedDepositFields, setSelectedDepositFields] = useState<string[]>(
    []
  );

  const {
    customWebhookDeposit,
    refetchCustomWebhookDeposit,
    isCustomWebhookDepositFetching,
  } = useCustomWebhookDeposit(currentPartner);

  const sanitizedSelectedFields = (fields: any[]) => {
    const selectedFields: { [key: string]: boolean } = {
      id: true,
      pix_id: true,
    };

    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        selectedFields[field] = true;
      });
    } else {
      console.error("Fields is not an array:", fields);
    }

    return selectedFields;
  };

  const {
    CreateCustomDepositWebhookMutate,
    CreateCustomDepositWebhookIsLoading,
    CreateCustomDepositWebhookError,
    CreateCustomDepositWebhookIsSuccess,
  } = useCreateCustomDepositWebhook({
    id: currentPartner,
    body: sanitizedSelectedFields(selectedDepositFields) as DepositFields,
  });

  const {
    mutateDeleteCustomDepositWebhook,
    DeleteCustomDepositWebhookError,
    isDeleteSCustomDepositWebhookuccess,
    isDeleteCustomDepositWebhookLoading,
  } = useDeleteCustomDepositWebhook(currentPartner);

  const depositFields = {
    merchant_id: 1,
    merchant_name: "Merchant Name",
    reference_id: "789",
    endToEndId: "987",
    value: 100.01,
    buyer_name: "Buyer Name",
    buyer_document: "Buyer Document",
    payer_name: "Payer Name",
    payer_document: "Payer Document",
    bank: "Bank Name",
    txid: "TX123",
    payer_account: "1234567890",
    payer_bank: "Payer Bank",
    payer_agency: "Payer Agency",
    buyer_email: "buyer@example.com",
    description: "Description of the deposit",
    status: "completed",
    paid_at: "2023-12-31T23:59:59.999Z",
    paid_value: 100.01,
    buyer_city: "Buyer City",
    buyer_state: "Buyer State",
    createdAt: "2023-12-31T23:59:59.999Z",
  };

  const CollapseDepositItem: CollapseProps["items"] = [
    {
      key: "1",
      label: t("table.webhook_preview"),
      children: (
        <ReactJson
          enableClipboard={false}
          style={{
            width: "100%",
            wordBreak: "break-all",
          }}
          src={renderCustomWebhook(depositFields, selectedDepositFields)}
          theme="ocean"
          collapseStringsAfterLength={90}
        />
      ),
    },
  ];

  function renderCustomWebhook(fields: any, currentFields: string[]) {
    const customWebhook: any = { id: "1", pix_id: "123" };

    currentFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        customWebhook[key] = fields[key];
      }
    });

    return customWebhook;
  }

  const onCollapseChange = (key: string | string[]) => {
    setActive(key);
  };

  const onDepositSubmit = () => {

    if(depositWebhookStandard && customWebhookDeposit?.default){
      setIsConfirmOpen(false);
      return message.error(t("messages.already_use_default_webhook"));
    }

    depositWebhookStandard
      ? mutateDeleteCustomDepositWebhook()
      : CreateCustomDepositWebhookMutate();

    setIsConfirmOpen(false);
    setOpenAlert(false);
  };

  useEffect(() => {
    refetchCustomWebhookDeposit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPartner]);

  useEffect(() => {
    if (customWebhookDeposit) {
      const currentDepositFields = Object.keys(
        customWebhookDeposit?.fields || {}
      );

      const currentDefaultDepositFields = Object.keys(
        customWebhookDeposit?.default_fields || {}
      );
      setSelectedDepositFields(
        (!depositWebhookStandard
          ? currentDepositFields
          : currentDefaultDepositFields) || []
      );
    }
  }, [customWebhookDeposit, depositWebhookStandard]);

  useEffect(() => {
    if (customWebhookDeposit) {
      setDepositWebhookStandard(customWebhookDeposit?.default);
      formDepositRef.current?.setFieldsValue({
        depositStandard: customWebhookDeposit?.default,
      });
    }
  }, [customWebhookDeposit]);

  return (
    <Row>
      {openAlert && (
        <Alert
          style={{ width: "100%", padding: 10, margin: "10px 0" }}
          message={t("messages.need_to_update")}
          type="warning"
          showIcon
          onClose={() => setOpenAlert(false)}
        />
      )}

      <Row style={{ width: "100%" }} gutter={[8, 8]}>
        {permissions.register.partner.partner.partner_customWebhook_update && (
          <Col lg={{ span: 12 }} style={{ paddingRight: 10 }}>
            <Form
              ref={formDepositRef}
              layout="vertical"
              onFinish={() => onDepositSubmit()}
            >
              <Form.Item
                label={t("input.deposit_standard_webhook")}
                name="depositStandard"
              >
                <Switch
                  checked={depositWebhookStandard}
                  onChange={(checked) => {
                    setOpenAlert(true);
                    setDepositWebhookStandard(checked);
                  }}
                />
              </Form.Item>

              <Form.Item label={t("input.deposit_webhook_data")} required>
                <Space.Compact style={{ width: "100%" }} size="large">
                  <Select
                    loading={isCustomWebhookDepositFetching}
                    disabled={depositWebhookStandard}
                    style={{ width: "100%" }}
                    options={Object.keys(depositFields)?.map((field) => {
                      return {
                        title: field,
                        value: t(`table.${field}`),
                      };
                    })}
                    value={
                      selectedDepositFields.length >= 1
                        ? selectedDepositFields.map((field) => {
                            return {
                              title: field,
                              value: t(`table.${field}`),
                            };
                          })
                        : []
                    }
                    mode="multiple"
                    onChange={(_value, option) => {
                      setOpenAlert(true);
                      setSelectedDepositFields(
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
        )}

        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Collapse
            items={CollapseDepositItem as any}
            activeKey={active}
            defaultActiveKey={["1"]}
            onChange={onCollapseChange}
          />
        </Col>
        {permissions.register.partner.partner.partner_customWebhook_update && (
          <Row
            style={{ width: "100%", marginTop: 10, paddingRight: 10 }}
            justify={"end"}
          >
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
              <Popconfirm
                title={t("messages.confirm_action_title", {
                  action: t("messages.update"),
                })}
                description={t("messages.are_you_sure", {
                  action: t("messages.update"),
                  itens: t("menus.general_configs").toLowerCase(),
                })}
                open={isConfirmOpen}
                style={{ maxWidth: "340px" }}
                onConfirm={() => {
                  formDepositRef.current?.submit();
                }}
                okButtonProps={{
                  loading:
                    isDeleteCustomDepositWebhookLoading ||
                    CreateCustomDepositWebhookIsLoading,
                }}
                okText={t("messages.yes_update")}
                cancelText={t("messages.no_cancel")}
                onCancel={() => setIsConfirmOpen(false)}
              >
                <Button
                  data-test-id="submit-button"
                  type="primary"
                  style={{ width: "100%" }}
                  loading={
                    isDeleteCustomDepositWebhookLoading ||
                    CreateCustomDepositWebhookIsLoading
                  }
                  size="large"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  {t("buttons.update")}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
      </Row>

      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={CreateCustomDepositWebhookError}
        success={CreateCustomDepositWebhookIsSuccess}
      />

      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={DeleteCustomDepositWebhookError}
        success={isDeleteSCustomDepositWebhookuccess}
      />
    </Row>
  );
};
