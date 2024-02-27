/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateCustomDepositWebhook } from "@src/services/register/partner/configs/createCustomWebhookDeposit";
import { useCreateCustomWithdrawWebhook } from "@src/services/register/partner/configs/createCustomWebhookWithdraw";
import { useDeleteCustomDepositWebhook } from "@src/services/register/partner/configs/deleteCustomWebhookDeposit";
import { useDeleteCustomWithdrawWebhook } from "@src/services/register/partner/configs/deleteCustomWebhookWithdraw";
import { useCustomWebhookDeposit } from "@src/services/register/partner/configs/getCustomWebhookDeposit";
import { useCustomWebhookWithdraw } from "@src/services/register/partner/configs/getCustomWebhookWithdraw";
import { useCreatePartnerUser } from "@src/services/register/partner/users/createUser";
import {
  DepositFields,
  WithdrawFields,
} from "@src/services/types/register/partners/configs/partnerConfigs.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  Button,
  Col,
  Collapse,
  Form,
  FormInstance,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  TabsProps,
} from "antd";
import type { CollapseProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactJson from "react-json-view";
import { useLocation } from "react-router-dom";

export const CustomWebhookPartners = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPartner = location?.state?.id;
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const formDepositRef = useRef<FormInstance>(null);
  const formWithdrawRef = useRef<FormInstance>(null);
  const { isLoading } = useCreatePartnerUser({});
  const [depositWebhookStandard, setDepositWebhookStandard] =
    useState<boolean>(false);
  const [withdrawWebhookStandard, setWithdrawWebhookStandard] =
    useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [selectedDepositFields, setSelectedDepositFields] = useState<string[]>(
    []
  );
  const [selectedWithdrawFields, setSelectedWithdrawFields] = useState<
    string[]
  >([]);

  const {
    customWebhookDeposit,
    refetchCustomWebhookDeposit,
    isCustomWebhookDepositFetching,
  } = useCustomWebhookDeposit(currentPartner);

  const { customWebhookWithdraw, refetchCustomWebhookWithdraw } =
    useCustomWebhookWithdraw(currentPartner);

  const sanitizedSelectedFields = (
    fields: any[],
    type: "cashin" | "cashout"
  ) => {
    const selectedFields: { [key: string]: boolean } =
      type === "cashin"
        ? { id: true, pix_id: true }
        : { id: true, withdraw_id: true };

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
    body: sanitizedSelectedFields(
      selectedDepositFields,
      "cashin"
    ) as DepositFields,
  });

  const {
    CreateCustomWithdrawWebhookMutate,
    CreateCustomWithdrawWebhookIsSuccess,
    CreateCustomWithdrawWebhookError,
  } = useCreateCustomWithdrawWebhook({
    id: currentPartner,
    body: sanitizedSelectedFields(
      selectedWithdrawFields,
      "cashout"
    ) as WithdrawFields,
  });

  const {
    mutateDeleteCustomDepositWebhook,
    DeleteCustomDepositWebhookError,
    isDeleteSCustomDepositWebhookuccess,
  } = useDeleteCustomDepositWebhook(currentPartner);

  const {
    mutateDeleteCustomWithdrawWebhook,
    DeleteCustomWithdrawWebhookError,
    isDeleteSCustomWithdrawWebhookuccess,
  } = useDeleteCustomWithdrawWebhook(currentPartner);

  const withdrawField = {
    merchant_id: 1,
    merchant_name: "Merchant Name",
    description: "Description",
    partner_name: "Partner Name",
    partner_id: 2,
    reference_id: "456",
    value: 100,
    receiver_name: "Receiver Name",
    receiver_document: "Receiver Document",
    pix_key_type: "Pix Key Type",
    pix_key: "Pix Key",
    bank: "Bank",
    status: "Status",
    receiver_bank_account: 123456,
    receiver_bank_agency: 789,
    receiver_bank_client_document: "Receiver Bank Client Document",
    receiver_bank_client_name: "Receiver Bank Client Name",
    receiver_bank_name: "Receiver Bank Name",
    endToEndId: "789",
    receiver_city: "Receiver City",
    receiver_state: "Receiver State",
    error: "Error",
    createdAt: new Date(),
    paid_value: 200,
    receiver_data: {
      name: "Receiver Data Name",
      document: "Receiver Data Document",
      agency: 456,
      bank: "Receiver Data Bank",
      account: 987654,
    },
  };

  const depositFields = {
    merchant_id: 1,
    merchant_name: "Merchant Name",
    reference_id: "789",
    endToEndId: "987",
    value: 1000,
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
    paid_at: new Date(),
    paid_value: 800,
    buyer_city: "Buyer City",
    buyer_state: "Buyer State",
    createdAt: new Date(),
  };

  const CollapseWithdrawItem: CollapseProps["items"] = [
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
          src={renderCustomWebhook(
            withdrawField,
            selectedWithdrawFields,
            "cashout"
          )}
          theme="ocean"
          collapseStringsAfterLength={90}
        />
      ),
    },
  ];

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
          src={renderCustomWebhook(
            depositFields,
            selectedDepositFields,
            "cashin"
          )}
          theme="ocean"
          collapseStringsAfterLength={90}
        />
      ),
    },
  ];

  const onCollapseChange = (key: string | string[]) => {
    setActive(key);
  };

  const DepositTab = () => {
    return (
      <Row>
        <Row style={{ width: "100%" }} gutter={[8, 8]}>
          <Col lg={{ span: 12 }} style={{ paddingRight: 10 }}>
            <Form
              ref={formDepositRef}
              layout="vertical"
              onFinish={() => onDepositSubmit()}
            >
              {permissions.register.partner.partner
                .partner_customWebhook_delete && (
                <Form.Item
                  label={t("input.deposit_standard_webhook")}
                  name="depositStandard"
                >
                  <Switch
                    defaultChecked={depositWebhookStandard}
                    onChange={(checked) => setDepositWebhookStandard(checked)}
                  />
                </Form.Item>
              )}

              {permissions.register.partner.partner
                .partner_customWebhook_update && (
                <Form.Item label={t("input.deposit_webhook_data")} required>
                  <Space.Compact style={{ width: "100%" }} size="large">
                    <Select
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
              )}
            </Form>
          </Col>

          <Col sm={{ span: 24 }} lg={{ span: 12 }}>
            <Collapse
              items={CollapseDepositItem as any}
              activeKey={active}
              defaultActiveKey={["1"]}
              onChange={onCollapseChange}
            />
          </Col>
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
                    isCustomWebhookDepositFetching ||
                    CreateCustomDepositWebhookIsLoading,
                }}
                okText={t("messages.yes_update")}
                cancelText={t("messages.no_cancel")}
                onCancel={() => setIsConfirmOpen(false)}
              >
                <Button
                  data-test-id="submit-button"
                  loading={isLoading}
                  type="primary"
                  style={{ width: "100%" }}
                  size="large"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  {t("buttons.update")}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Row>
      </Row>
    );
  };

  const WithdrawTab = () => {
    return (
      <Row>
        <Row style={{ width: "100%" }} gutter={[8, 8]}>
          <Col lg={{ span: 12 }} style={{ paddingRight: 10 }}>
            <Form
              ref={formWithdrawRef}
              layout="vertical"
              onFinish={() => onWithdrawSubmit()}
            >
              {permissions.register.partner.partner
                .partner_customWebhook_delete && (
                <Form.Item
                  label={t("input.withdraw_standard_webhook")}
                  name="withdrawStandard"
                >
                  <Switch
                    defaultChecked={withdrawWebhookStandard}
                    onChange={(checked) => {
                      setWithdrawWebhookStandard(checked);
                    }}
                  />
                </Form.Item>
              )}

              {permissions.register.partner.partner
                .partner_customWebhook_update && (
                <Form.Item label={t("input.withdraw_webhook_data")} required>
                  <Space.Compact style={{ width: "100%" }} size="large">
                    <Select
                      disabled={withdrawWebhookStandard}
                      style={{ width: "100%" }}
                      options={Object.keys(withdrawField).map((field) => ({
                        title: field,
                        value: t(`table.${field}`),
                      }))}
                      value={
                        selectedWithdrawFields.length >= 1
                          ? selectedWithdrawFields.map((field) => {
                              return {
                                title: field,
                                value: t(`table.${field}`),
                              };
                            })
                          : []
                      }
                      mode="multiple"
                      onChange={(_value, option) => {
                        setSelectedWithdrawFields(
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
              )}
            </Form>
          </Col>

          <Col sm={{ span: 24 }} lg={{ span: 12 }}>
            <Collapse
              items={CollapseWithdrawItem as any}
              activeKey={active}
              defaultActiveKey={["1"]}
              onChange={onCollapseChange}
            />
          </Col>

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
                  formWithdrawRef.current?.submit();
                }}
                okButtonProps={{
                  loading:
                    isCustomWebhookDepositFetching ||
                    CreateCustomDepositWebhookIsLoading,
                }}
                okText={t("messages.yes_update")}
                cancelText={t("messages.no_cancel")}
                onCancel={() => setIsConfirmOpen(false)}
              >
                <Button
                  data-test-id="submit-button"
                  loading={isLoading}
                  type="primary"
                  style={{ width: "100%" }}
                  size="large"
                  onClick={() => {
                    setIsConfirmOpen(true);
                  }}
                >
                  {t("buttons.update")}
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Row>
      </Row>
    );
  };

  const TabComponents: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.deposit_webhook"),
      children: (
        <>
          <DepositTab />
        </>
      ),
    },
    {
      key: "2",
      label: t("table.withdraw_webhook"),
      children: (
        <>
          <WithdrawTab />
        </>
      ),
    },
  ];

  function renderCustomWebhook(
    fields: any,
    currentFields: string[],
    type: "cashin" | "cashout"
  ) {
    const customWebhook: any =
      type === "cashin"
        ? { id: "1", pix_id: "123" }
        : { id: "1", withdraw_id: "123" };

    currentFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        customWebhook[key] = fields[key];
      }
    });

    return customWebhook;
  }

  const onDepositSubmit = () => {
    depositWebhookStandard
      ? mutateDeleteCustomDepositWebhook()
      : CreateCustomDepositWebhookMutate();

    setIsConfirmOpen(false);
  };

  const onWithdrawSubmit = () => {
    withdrawWebhookStandard
      ? mutateDeleteCustomWithdrawWebhook()
      : CreateCustomWithdrawWebhookMutate();

    setIsConfirmOpen(false);
  };

  useEffect(() => {
    refetchCustomWebhookDeposit();
    refetchCustomWebhookWithdraw();
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

    if (customWebhookWithdraw) {
      const currentWithdrawFields = Object.keys(
        customWebhookWithdraw?.fields || {}
      );

      const currentDefaultWithdrawFields = Object.keys(
        customWebhookWithdraw?.default_fields || {}
      );
      setSelectedWithdrawFields(
        (!withdrawWebhookStandard
          ? currentWithdrawFields
          : currentDefaultWithdrawFields) || []
      );
    }
  }, [
    customWebhookDeposit,
    customWebhookWithdraw,
    withdrawWebhookStandard,
    depositWebhookStandard,
  ]);

  useEffect(() => {
    if (customWebhookDeposit) {
      setDepositWebhookStandard(customWebhookDeposit?.default);
      formDepositRef.current?.setFieldsValue({
        depositStandard: customWebhookDeposit?.default,
      });
    }

    if (customWebhookWithdraw) {
      setWithdrawWebhookStandard(customWebhookWithdraw?.default);
      formWithdrawRef.current?.setFieldsValue({
        withdrawStandard: customWebhookWithdraw?.default,
      });
    }
  }, [customWebhookDeposit, customWebhookWithdraw]);

  return (
    <Row style={{ padding: 25 }}>
      <Tabs
        defaultActiveKey="1"
        items={TabComponents}
        style={{ width: "100%" }}
      />

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

      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={DeleteCustomWithdrawWebhookError}
        success={isDeleteSCustomWithdrawWebhookuccess}
      />
      <Toast
        actionError={t("messages.update")}
        actionSuccess={t("messages.updated")}
        error={CreateCustomWithdrawWebhookError}
        success={CreateCustomWithdrawWebhookIsSuccess}
      />
    </Row>
  );
};
