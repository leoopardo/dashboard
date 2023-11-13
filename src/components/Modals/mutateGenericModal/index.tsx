/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleWrapperDatePicker } from "@src/components/FiltersModal/styles";
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { ValidateToken } from "@src/components/ValidateToken";
import { useListClientClientBanks } from "@src/services/bank/listClientBanks";
import { queryClient } from "@src/services/queryClient";
import { useGetRowsMerchantBlacklistReasons } from "@src/services/register/merchant/blacklist/getMerchantBlacklistReason";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Drawer,
  Empty,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import locale from "antd/locale/pt_BR";
import dayjs from "dayjs";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { MerchantSelect } from "../../Selects/merchantSelect";
import { PartnerSelect } from "../../Selects/partnerSelect";
const { RangePicker } = DatePicker;

interface mutateProps {
  type: "create" | "update";
  fields:
    | (
        | {
            label: string;
            required: boolean;
            selectOption?: boolean;
            noTranslate?: boolean;
            feesDetails?: boolean;
            asyncOption?: {
              options?: any[];
              optionLabel?: string;
              optionValue?: string;
              bodyProp?: string;
            };
          }
        | undefined
      )[];
  modalName: string;
  selectOptions?: any;
  setBody: Dispatch<SetStateAction<any>>;
  body: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  submit: () => void;
  submitLoading: boolean;
  success: boolean;
  error: any;
  clear?: any;
  submitText?: string;
  validateToken?: boolean;
  validateTokenAction?: string;
}

export const MutateModal = ({
  type,
  body,
  fields,
  open,
  setBody,
  setOpen,
  submit,
  selectOptions,
  modalName,
  submitLoading,
  clear,
  submitText,
  validateToken,
  validateTokenAction,
  success,
}: mutateProps) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { Countries } = useGetrefetchCountries();
  const [tokenState, setTokenState] = useState<string>("");
  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const { clientbankListData, isClientBankListFetching } =
    useListClientClientBanks({
      page: 1,
      limit: 200,
    });
  const { merchantBlacklistData } = useGetRowsMerchantBlacklistReasons({
    limit: 200,
    page: 1,
  });

  const handleChange = (event: any) => {
    setBody((state: any) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (clear) clear();
  }, []);

  useEffect(() => {
    if (body?.partner) {
      setBody((state: any) => ({ ...state, partner_id: state?.partner?.id }));
    }
    if (body?.operator) {
      setBody((state: any) => ({ ...state, operator_id: state?.operator?.id }));
    }
    if (body?.aggregator) {
      setBody((state: any) => ({
        ...state,
        aggregator_id: state?.aggregator?.id,
      }));
    }
    if (body?.merchant) {
      setBody((state: any) => ({ ...state, merchant_id: state?.merchant?.id }));
    }
  }, []);

  const panelRender = (panelNode: any) => (
    <StyleWrapperDatePicker>{panelNode}</StyleWrapperDatePicker>
  );

  useEffect(() => {
    if (type === "create") {
      setBody({});
    }
  }, [open]);

  useEffect(() => {
    if (validateToken) {
      setBody((state: any) => ({ ...state, validation_token: tokenState }));
    }
  }, [tokenState]);

  useEffect(() => {
    if (tokenState && success) {
      setOpen(false);
    }
  }, [success]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (type === "create") setBody({});
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={modalName}
      footer={
        <Button
          loading={submitLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {submitText
            ? submitText
            : type == "create"
            ? t("buttons.create")
            : t("buttons.update")}
        </Button>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={type === "update" ? body : {}}
        disabled={submitLoading}
        onFinish={() => {
          if (validateToken) {
            setIsValidateTokenOpen(true);
            return;
          }
          submit();
          setOpen(false);
        }}
      >
        <Row>
          {fields?.map((field) => {
            switch (field?.label) {
              case "date":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t("table.date")}
                      style={{ margin: 10 }}
                      name="date"
                      rules={[{ required: field.required }]}
                    >
                      <ConfigProvider locale={locale}>
                        <RangePicker
                          size="large"
                          panelRender={panelRender}
                          format={
                            navigator.language === "pt-BR"
                              ? "DD/MM/YYYY HH:mm"
                              : "YYYY/MM/DD HH:mm"
                          }
                          popupStyle={{ marginLeft: "40px" }}
                          showTime
                          value={[
                            body?.start_date
                              ? dayjs(body?.start_date).subtract(3, "hours")
                              : null,
                            body?.end_date
                              ? dayjs(body?.end_date).subtract(3, "hours")
                              : null,
                          ]}
                          clearIcon={<></>}
                          placeholder={[
                            t("table.initial_date"),
                            t("table.final_date"),
                          ]}
                          onChange={(value: any) => {
                            const [startDate, endDate] = value;
                            setBody((state: any) => ({
                              ...state,
                              start_date: startDate
                                ? moment(startDate)
                                    .add(3, "hours")
                                    .format("YYYY-MM-DDTHH:mm:00.000")
                                : null,
                              end_date: endDate
                                ? endDate
                                    .add(3, "hours")
                                    .format("YYYY-MM-DDTHH:mm:59.999")
                                : null,
                            }));
                            formRef?.current?.validateFields();
                          }}
                        />
                      </ConfigProvider>
                    </Form.Item>
                  </Col>
                );
              case "merchant_id":
                if (permissions.register.merchant.merchant.merchant_list) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`table.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required && !body.merchant_id,
                            message:
                              t("input.required", {
                                field: t(`input.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <MerchantSelect
                          setQueryFunction={setBody}
                          queryOptions={body}
                        />
                      </Form.Item>
                    </Col>
                  );
                } else return;

              case "partner_id":
                if (
                  permissions.register.partner.partner.partner_list &&
                  !user.partner_id
                ) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`table.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required && !body?.partner_id,
                            message:
                              t("input.required", {
                                field: t(`table.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <PartnerSelect
                          setQueryFunction={setBody}
                          queryOptions={body}
                        />
                      </Form.Item>
                    </Col>
                  );
                }
                return;

              case "aggregator_id":
                if (
                  permissions.register.aggregator.aggregator.aggregator_list &&
                  !user?.aggregator_id
                ) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`table.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required && !body?.aggregator_id,
                            message:
                              t("input.required", {
                                field: t(`input.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <AggregatorSelect
                          setQueryFunction={setBody}
                          aggregatorId={
                            (body?.aggregator?.id || body?.aggregator_id) ??
                            undefined
                          }
                        />
                      </Form.Item>
                    </Col>
                  );
                }
                return;

              case "reason":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.black_list_reason`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        options={merchantBlacklistData?.items.map((reason) => {
                          return {
                            label: reason.reason_name,
                            value: reason._id,
                          };
                        })}
                        value={body[field.label]}
                        onChange={(value) =>
                          setBody((state: any) => ({
                            ...state,
                            reason_id: value,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                );

              case "value":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required && !body.value,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <CurrencyInput
                        value={body[field.label]}
                        onChangeValue={(_event, originalValue) => {
                          setBody((state: any) => ({
                            ...state,
                            [field.label]: +originalValue,
                          }));
                        }}
                        InputElement={
                          <Input size="large" style={{ width: "100%" }} />
                        }
                      />
                    </Form.Item>
                  </Col>
                );

              case "new_reason":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.black_list_reason`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        name="reason"
                        value={body.reason}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                );

              case "operator_id":
                if (
                  permissions.register.operator.operator.operator_list &&
                  !user?.operator_id
                ) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`table.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required,
                            message:
                              t("input.required", {
                                field: t(`input.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <OperatorSelect
                          setQueryFunction={setBody}
                          queryOptions={body}
                        />
                      </Form.Item>
                    </Col>
                  );
                }
                return;

              case "status":
              case "cash_in":
              case "cash_out":
              case "fastpix_in":
                return (
                  <Col
                    span={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      valuePropName="checked"
                    >
                      <Switch
                        checked={body[field.label]}
                        onChange={(e) =>
                          setBody((state: any) => ({
                            ...state,
                            [field.label]: e,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                );

              case "can_be_deleted_only_by_organization":
                return (
                  <Col
                    span={24}
                    style={{ display: "flex", justifyContent: "start" }}
                  >
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      valuePropName="checked"
                    >
                      <Typography
                        style={{ display: "inline", marginRight: 10 }}
                      >
                        {t("table.false")}
                      </Typography>
                      <Switch
                        checked={body[field.label]}
                        onChange={(e) => {
                          setBody((state: any) => ({
                            ...state,
                            [field.label]: e,
                          }));
                        }}
                      />
                      <Typography style={{ display: "inline", marginLeft: 10 }}>
                        {t("table.true")}
                      </Typography>
                    </Form.Item>
                  </Col>
                );
              case "cnpj":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <ReactInputMask
                        value={body[field.label]}
                        mask="99.999.999/9999-99"
                        onChange={(event) => {
                          const value = event.target.value.replace(
                            /[^\d]/g,
                            ""
                          );
                          if (!value) {
                            delete body[field.label];
                            return;
                          }
                          setBody((state: any) => ({
                            ...state,
                            [field.label]: value,
                          }));
                        }}
                      >
                        <Input size="large" />
                      </ReactInputMask>
                    </Form.Item>
                  </Col>
                );
              case "cpf":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <ReactInputMask
                        value={body[field.label]}
                        mask="999.999.999-99"
                        onChange={(event) => {
                          const value = event.target.value.replace(
                            /[^\d]/g,
                            ""
                          );
                          if (!value) {
                            delete body[field.label];
                            return;
                          }
                          setBody((state: any) => ({
                            ...state,
                            [field.label]: value,
                          }));
                        }}
                      >
                        <Input size="large" />
                      </ReactInputMask>
                    </Form.Item>
                  </Col>
                );

              case "cellphone":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      help=""
                    >
                      <CellphoneInput body={body} setBody={setBody} />
                    </Form.Item>
                  </Col>
                );
              case "bank_name":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`table.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        options={clientbankListData?.items.map((bank: any) => {
                          return {
                            label: bank.bank_name,
                            value: bank.bank_name,
                            key: bank.ispb,
                          };
                        })}
                        loading={isClientBankListFetching}
                        onChange={(_value, option: any) => {
                          setBody({
                            bank_name: option.value,
                            ispb: option.key,
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                );
              case "ispb":
                return;

              case "type":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t("table.type")}
                      name="type"
                      style={{ margin: 10 }}
                    >
                      {field.selectOption ? (
                        <Select
                          size="large"
                          options={
                            selectOptions
                              ? selectOptions[field.label]?.map(
                                  (option: any) => {
                                    return {
                                      value: option?.value,
                                      label: t(
                                        field?.noTranslate
                                          ? option?.label?.toLowerCase()
                                          : `table.${option?.label?.toLowerCase()}`
                                      ),
                                    };
                                  }
                                )
                              : []
                          }
                          notFoundContent={<Empty />}
                          value={body[field.label] || null}
                          onChange={(value) => {
                            setBody((state: any) => ({
                              ...state,
                              [field.label]: value,
                            }));
                          }}
                          style={{ width: "100%", height: 40 }}
                          placeholder={t(`table.${field.label}`)}
                        />
                      ) : (
                        <Select
                          size="large"
                          options={
                            ["production"]?.map((item, index) => ({
                              key: index,
                              value: item,
                              label: `${t(
                                `table.${item?.toLocaleLowerCase()}`
                              )}`,
                            })) ?? []
                          }
                          value={body?.cashin_pix_fee_type || null}
                          onChange={(value) => {
                            setBody((state: any) => ({
                              ...state,
                              [field.label]: value,
                            }));
                          }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                );

              case "icon_url":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        name={field.label}
                        value={body[field.label]}
                        onChange={handleChange}
                        suffix={
                          <Avatar src={body[field.label]} shape="square" />
                        }
                      />
                    </Form.Item>
                  </Col>
                );

              case "country":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <AutoComplete
                        size="large"
                        options={
                          Countries?.map((item, index) => {
                            return {
                              key: index,
                              value: item?.name.common,
                              label: (
                                <>
                                  <Avatar
                                    src={item.flags.svg}
                                    style={{ margin: 5 }}
                                  />
                                  {item?.name.common}
                                </>
                              ),
                            };
                          }) ?? []
                        }
                        filterOption={(inputValue, option) =>
                          option?.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onSelect={(option) => {
                          setBody((state: any) => ({
                            ...state,
                            country: option,
                          }));
                        }}
                      />
                    </Form.Item>
                  </Col>
                );

              case "person_reason":
                return (
                  <Col span={24}>
                    {" "}
                    <Form.Item
                      label={t(`table.reason`)}
                      name="reason"
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field.required,
                          message:
                            t("input.required", {
                              field: t(`table.reason`),
                            }) || "",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        name="reason"
                        value={body?.reason}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                );

              case "description":
                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field.label}`)}
                      name={field.label}
                      style={{ margin: 10 }}
                      help=""
                    >
                      <Input.TextArea
                        size="large"
                        name="description"
                        value={body?.description}
                        rows={3}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                );
              case undefined:
                return;

              default:
                if (field?.selectOption) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`input.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required,
                            message:
                              t("input.required", {
                                field: t(`input.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          options={
                            selectOptions
                              ? selectOptions[field.label]?.map(
                                  (option: any) => {
                                    return {
                                      value: option?.value,
                                      label: t(
                                        field?.noTranslate
                                          ? option?.label?.toLowerCase()
                                          : `table.${option?.label?.toLowerCase()}`
                                      ),
                                    };
                                  }
                                )
                              : []
                          }
                          notFoundContent={<Empty />}
                          value={body[field.label] || null}
                          onChange={(value) => {
                            setBody((state: any) => ({
                              ...state,
                              [field.label]: value,
                            }));
                          }}
                          style={{ width: "100%", height: 40 }}
                          placeholder={t(`table.${field.label}`)}
                        />
                      </Form.Item>
                    </Col>
                  );
                }

                if (field?.asyncOption) {
                  return (
                    <Col span={24}>
                      <Form.Item
                        label={t(`input.${field.label}`)}
                        name={field.label}
                        style={{ margin: 10 }}
                        rules={[
                          {
                            required: field.required,
                            message:
                              t("input.required", {
                                field: t(`input.${field.label}`),
                              }) || "",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          options={
                            field?.asyncOption
                              ? field?.asyncOption?.options?.map(
                                  (option: any) => {
                                    return {
                                      value:
                                        option[
                                          field?.asyncOption?.optionValue || ""
                                        ],
                                      label:
                                        option[
                                          field?.asyncOption?.optionLabel || ""
                                        ],
                                    };
                                  }
                                )
                              : []
                          }
                          notFoundContent={<Empty />}
                          value={
                            body[field?.asyncOption?.optionValue || ""] || null
                          }
                          onChange={(value) => {
                            setBody((state: any) => ({
                              ...state,
                              [field?.asyncOption?.bodyProp || ""]: value,
                            }));
                          }}
                          style={{ width: "100%", height: 40 }}
                          placeholder={t(`table.${field.label}`)}
                        />
                      </Form.Item>
                    </Col>
                  );
                }

                return (
                  <Col span={24}>
                    <Form.Item
                      label={t(`table.${field?.label}`)}
                      name={field?.label}
                      style={{ margin: 10 }}
                      rules={[
                        {
                          required: field?.required,
                          message:
                            t("input.required", {
                              field: t(`input.${field?.label}`),
                            }) || "",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        name={field?.label}
                        value={body[field?.label as any] ?? null}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                );
            }
          })}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
          </Form.Item>
        </Row>
      </Form>

      {isValidateTokenOpen && (
        <ValidateToken
          action={`${validateTokenAction}`}
          open={isValidateTokenOpen}
          setIsOpen={setIsValidateTokenOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          submit={submit}
          body={body}
          error={false}
          success={false}
        />
      )}
    </Drawer>
  );
};
