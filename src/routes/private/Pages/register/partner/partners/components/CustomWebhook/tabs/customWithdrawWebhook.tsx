/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateCustomWithdrawWebhook } from "@src/services/register/partner/configs/createCustomWebhookWithdraw";
import { useDeleteCustomWithdrawWebhook } from "@src/services/register/partner/configs/deleteCustomWebhookWithdraw";
import { useCustomWebhookWithdraw } from "@src/services/register/partner/configs/getCustomWebhookWithdraw";
import { WithdrawFields } from "@src/services/types/register/partners/configs/partnerConfigs.interface";
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
} from "antd";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";

export const TabWithdrawWebhook = ({
  currentPartner,
}: {
  currentPartner: number;
}) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const formWithdrawRef = useRef<FormInstance>(null);
  const [withdrawWebhookStandard, setWithdrawWebhookStandard] =
    useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [selectedWithdrawFields, setSelectedWithdrawFields] = useState<
    string[]
  >([]);

  const sanitizedSelectedFields = (fields: any[]) => {
    const selectedFields: { [key: string]: boolean } = {
      id: true,
      withdraw_id: true,
    };

    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        selectedFields[field] = true;
      });
    }

    return selectedFields;
  };

  const {
    CreateCustomWithdrawWebhookMutate,
    CreateCustomWithdrawWebhookIsSuccess,
    CreateCustomWithdrawWebhookError,
    CreateCustomWithdrawWebhookIsLoading,
  } = useCreateCustomWithdrawWebhook({
    id: currentPartner,
    body: sanitizedSelectedFields(selectedWithdrawFields) as WithdrawFields,
  });

  const {
    customWebhookWithdraw,
    refetchCustomWebhookWithdraw,
    isCustomWebhookWithdrawFetching,
  } = useCustomWebhookWithdraw(currentPartner);

  const {
    mutateDeleteCustomWithdrawWebhook,
    DeleteCustomWithdrawWebhookError,
    isDeleteSCustomWithdrawWebhookuccess,
    isDeleteCustomWithdrawWebhookLoading,
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
    paid_at: new Date(),
    receiver_data: {
      name: "Receiver Data Name",
      document: "Receiver Data Document",
      agency: 456,
      bank: "Receiver Data Bank",
      account: 987654,
    },
  };

  function renderCustomWebhook(fields: any, currentFields: string[]) {
    const customWebhook: any = { id: "1", withdraw_id: "123" };

    currentFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        customWebhook[key] = fields[key];
      }
    });

    return customWebhook;
  }

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
          src={renderCustomWebhook(withdrawField, selectedWithdrawFields)}
          theme="ocean"
          collapseStringsAfterLength={90}
        />
      ),
    },
  ];

  const onWithdrawSubmit = () => {
    withdrawWebhookStandard
      ? mutateDeleteCustomWithdrawWebhook()
      : CreateCustomWithdrawWebhookMutate();

    setIsConfirmOpen(false);
  };
  const onCollapseChange = (key: string | string[]) => {
    setActive(key);
  };

  useEffect(() => {
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
  }, [customWebhookWithdraw, withdrawWebhookStandard]);

  useEffect(() => {
    if (customWebhookWithdraw) {
      setWithdrawWebhookStandard(customWebhookWithdraw?.default);
      formWithdrawRef.current?.setFieldsValue({
        withdrawStandard: customWebhookWithdraw?.default,
      });
    }
  }, [customWebhookWithdraw]);

  useEffect(() => {
    refetchCustomWebhookWithdraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPartner]);

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
                  checked={withdrawWebhookStandard}
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
                    loading={isCustomWebhookWithdrawFetching}
                    disabled={withdrawWebhookStandard}
                    style={{ width: "100%" }}
                    options={Object.keys(withdrawField).map((field) => ({
                      title: field,
                      value: t(`table.${field}`),
                    }))}
                    value={
                      selectedWithdrawFields.length >= 1
                        ? selectedWithdrawFields.map((field: any) => {
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
                  isDeleteCustomWithdrawWebhookLoading ||
                  CreateCustomWithdrawWebhookIsLoading,
              }}
              okText={t("messages.yes_update")}
              cancelText={t("messages.no_cancel")}
              onCancel={() => setIsConfirmOpen(false)}
            >
              <Button
                data-test-id="submit-button"
                type="primary"
                loading={
                  isDeleteCustomWithdrawWebhookLoading ||
                  CreateCustomWithdrawWebhookIsLoading
                }
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
