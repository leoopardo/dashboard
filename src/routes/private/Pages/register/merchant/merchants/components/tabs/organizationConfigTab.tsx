/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useOrganizationConfig } from "@src/services/register/merchant/merchant/organizationConfig.tsx/getMerchantConfig";
import { useUpdateOrganizationConfig } from "@src/services/register/merchant/merchant/organizationConfig.tsx/updateMerchantConfig";
import {
  IOrganizationConfigResponse,
  IOrganizationUpdateConfig,
} from "@src/services/types/register/merchants/organizationConfig.interface";
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";

export const OrganizationConfigTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const {
    isOrganizationConfigFetching,
    organizationConfigData,
    refetchOrganizationConfigData,
  } = useOrganizationConfig(props?.id);
  const [body, setBody] = useState<
    IOrganizationConfigResponse | undefined | null
  >(null);
  const [bodyUpdate, setBodyUpdate] = useState<
    IOrganizationUpdateConfig | null | undefined
  >(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [withdrawUnlimited, setWithdrawUnlimited] = useState(false);
  const [payerPjUnlimited, setPayerPjUnlimited] = useState(false);
  const [differentPayerUnlimited, setDifferentPayerUnlimited] = useState(false);

  const { UpdateIsSuccess, UpdateMutate, UpdateError } =
    useUpdateOrganizationConfig({
      merchant_id: Number(props?.id),
      ...bodyUpdate,
    });

  const handleWithdrawUnlimitedChange = (event: CheckboxChangeEvent) => {
    setWithdrawUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({ cash_out_max_value: null });
    setBody((state: any) => ({
      ...state,
      cash_out_max_value: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_out_max_value: null,
    }));
  };

  const handlPayerPjUnlimitedChange = (event: CheckboxChangeEvent) => {
    setPayerPjUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({ cash_in_max_value_receive_by_pj: null });
    setBody((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_pj: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_pj: null,
    }));
  };

  const handleDifferentPayerUnlimitedChange = (event: CheckboxChangeEvent) => {
    setDifferentPayerUnlimited(event.target.checked);
    formRef.current?.setFieldsValue({
      cash_in_max_value_receive_by_different_payer: null,
    });
    setBody((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_different_payer: null,
    }));
    setBodyUpdate((state: any) => ({
      ...state,
      cash_in_max_value_receive_by_different_payer: null,
    }));
  };

  const handleSubmit = () => {
    /*  const stopRequest = array.some((item) => {
      if(item.isUnlimited === false && body && body[item.props as keyof typeof body] === null ) {
        setIsConfirmOpen(false);
          return true
        } else return false
    })
  
    if(stopRequest) return; */

    UpdateMutate();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    refetchOrganizationConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    setBodyUpdate({
      ...organizationConfigData?.merchantConfig,
      status: organizationConfigData?.status,
    });
  }, [organizationConfigData]);

  return (
    <>
      {!isOrganizationConfigFetching && bodyUpdate && (
        <Form
          ref={formRef}
          layout="vertical"
          onSubmitCapture={() => handleSubmit()}
          initialValues={
            organizationConfigData ? organizationConfigData.merchantConfig : {}
          }
        >
          <Row gutter={[8, 8]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("input.check_cpf_permission")}
                name="cpf_api_permission"
                valuePropName="checked"
              >
                <Switch
                  checked={body?.cpf_api_permission}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      cpf_api_permission: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      cpf_api_permission: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={{ span: 17 }} md={{ span: 10 }}>
              <Form.Item
                label={t("input.cash_out_max_value")}
                name="cash_out_max_value"
                rules={[
                  {
                    required: !withdrawUnlimited,
                    message:
                      t("input.required", {
                        field: t("input.cash_out_max_value"),
                      }) || "",
                  },
                ]}
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      cash_out_max_value: +originalValue,
                    }));
                  }}
                  value={bodyUpdate?.cash_out_max_value}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      disabled={withdrawUnlimited}
                      value={bodyUpdate?.cash_out_max_value}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 7 }}
              md={{ span: 4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                height: "100%",
                marginTop: "25px",
              }}
            >
              <Form.Item label={""} name="pix_refund_fee_min">
                <Checkbox
                  checked={withdrawUnlimited}
                  onChange={handleWithdrawUnlimitedChange}
                >
                  {t("input.unlimited")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("input.account_PJ_payment_permission")}
                name="cash_in_receive_by_pj"
                valuePropName="checked"
              >
                <Switch
                  checked={bodyUpdate?.cash_in_receive_by_pj}
                  onChange={(value) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      cash_in_receive_by_pj: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 17 }} md={{ span: 10 }}>
              <Form.Item
                label={t("input.max_value_payer_pj_by_day")}
                name="cash_in_max_value_receive_by_pj"
                rules={[
                  {
                    required: !payerPjUnlimited,
                    message:
                      t("input.required", {
                        field: t("input.max_value_payer_pj_by_day"),
                      }) || "",
                  },
                ]}
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      cash_in_max_value_receive_by_pj: +originalValue,
                    }));
                  }}
                  value={bodyUpdate?.cash_in_max_value_receive_by_pj}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      disabled={payerPjUnlimited}
                      value={bodyUpdate?.cash_in_max_value_receive_by_pj}
                    />
                  }
                />
              </Form.Item>
            </Col>{" "}
            <Col
              xs={{ span: 7 }}
              md={{ span: 4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                height: "100%",
                marginTop: "25px",
              }}
            >
              <Form.Item label={""} name="pix_refund_fee_min">
                <Checkbox
                  checked={payerPjUnlimited}
                  onChange={handlPayerPjUnlimitedChange}
                >
                  {t("input.unlimited")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("input.permission_different_payer_pf")}
                name="cash_in_receive_by_different_payer"
                valuePropName="checked"
              >
                <Switch
                  checked={bodyUpdate?.cash_in_receive_by_different_payer}
                  onChange={(value) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      cash_in_receive_by_different_payer: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>{" "}
            <Col xs={{ span: 17 }} md={{ span: 10 }}>
              <Form.Item
                label={t("input.max_value_different_payer_pf_by_day")}
                name="cash_in_max_value_receive_by_different_payer"
                rules={[
                  {
                    required: !differentPayerUnlimited,
                    message:
                      t("input.required", {
                        field: t("input.max_value_different_payer_pf_by_day"),
                      }) || "",
                  },
                ]}
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      cash_in_max_value_receive_by_different_payer:
                        +originalValue,
                    }));
                  }}
                  value={
                    bodyUpdate?.cash_in_max_value_receive_by_different_payer
                  }
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      disabled={differentPayerUnlimited}
                      value={
                        bodyUpdate?.cash_in_max_value_receive_by_different_payer
                      }
                    />
                  }
                />
              </Form.Item>
            </Col>{" "}
            <Col
              xs={{ span: 7 }}
              md={{ span: 4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                height: "100%",
                marginTop: "25px",
              }}
            >
              <Form.Item label={""} name="pix_refund_fee_min">
                <Checkbox
                  checked={differentPayerUnlimited}
                  onChange={handleDifferentPayerUnlimitedChange}
                >
                  {t("input.unlimited")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("input.operation_type")}
                name="operation_type"
              >
                <Select
                  size="large"
                  options={[
                    { value: 1, label: "EFX" },
                    { value: 2, label: "IP" },
                    { value: 3, label: "Loterj" },
                    { value: 4, label: "Loterias" },
                  ]}
                  value={bodyUpdate?.operation_type}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      operation_type: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      operation_type: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 16 }} md={{ span: 6 }}>
              <Form.Item
                label={t("input.btg_id")}
                name="btg_merchant_customer_id"
              >
                <Input
                  size="large"
                  value={bodyUpdate?.btg_merchant_customer_id}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      btg_merchant_customer_id: e.target.value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      btg_merchant_customer_id: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 4 }} md={{ span: 4 }}>
              <Form.Item
                label={t("table.under_age_verify")}
                name="under_age_verify"
              >
                <Switch
                  checked={bodyUpdate?.under_age_verify}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      under_age_verify: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      under_age_verify: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 4 }} md={{ span: 4 }}>
              <Form.Item label={t("table.status")} name="status">
                <Switch
                  checked={bodyUpdate?.status}
                  onChange={(value) => {
                    setBody((state) => ({
                      ...state,
                      status: value,
                    }));
                    setBodyUpdate((state) => ({
                      ...state,
                      status: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24} />
            <Col span={24}>
              <Divider orientation="left">
                <Typography.Title level={3}>FastPix</Typography.Title>
              </Divider>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 3 }}>
              <Form.Item
                label={t("input.fastpix_in_permission")}
                name="fastpix_in_permission"
                valuePropName="checked"
              >
                <Switch
                  checked={bodyUpdate?.fastpix_in_permission}
                  onChange={(value) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_permission: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 7 }}>
              <Form.Item
                label={t("input.fastpix_in_type")}
                name="fastpix_in_type"
              >
                <Select
                  size="large"
                  options={
                    ["FIXED", "FREE"]?.map((item, index) => ({
                      key: index,
                      value: item,
                      label: `${t(`table.${item}`)}`,
                    })) ?? []
                  }
                  value={bodyUpdate?.fastpix_in_type}
                  onChange={(value) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_type: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 7 }}>
              <Form.Item
                label={t("input.fastpix_in_min_value")}
                name="fastpix_in_min_value"
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_min_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={bodyUpdate?.fastpix_in_min_value}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 7 }}>
              <Form.Item
                label={t("input.fastpix_in_max_value")}
                name="fastpix_in_max_value"
              >
                <CurrencyInput
                  onChangeValue={(_event, originalValue) => {
                    setBodyUpdate((state) => ({
                      ...state,
                      fastpix_in_max_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={bodyUpdate?.fastpix_in_max_value}
                    />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Grid
            item
            container
            xs={12}
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Grid item xs={12} md={3} style={{ marginTop: "50px" }}>
              <button type="submit" ref={submitRef} style={{ display: "none" }}>
                Submit
              </button>
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
                onConfirm={() => submitRef.current?.click()}
                okButtonProps={{ loading: isOrganizationConfigFetching }}
                okText={t("messages.yes_update")}
                cancelText={t("messages.no_cancel")}
                onCancel={() => setIsConfirmOpen(false)}
              >
                <Button
                  size="large"
                  type="primary"
                  style={{ width: "100%" }}
                  loading={isOrganizationConfigFetching}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  {t("buttons.update", { menu: "configs" })}
                </Button>
              </Popconfirm>
            </Grid>
          </Grid>
          <Toast
            actionSuccess={t("messages.updated")}
            actionError={t("messages.update")}
            error={UpdateError}
            success={UpdateIsSuccess}
          />
        </Form>
      )}
    </>
  );
};
