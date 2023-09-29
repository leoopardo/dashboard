/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { ReasonSelect } from "@src/components/Selects/reasonSelect";
import { useListClientClientBanks } from "@src/services/bank/listClientBanks";
import { queryClient } from "@src/services/queryClient";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { ValidateInterface } from "@src/services/types/validate.interface";
import {
  AutoComplete,
  Avatar,
  Button,
  ConfigProvider,
  DatePicker,
  Drawer,
  Empty,
  Form,
  FormInstance,
  Input,
  Select,
  Switch,
} from "antd";
import locale from "antd/locale/pt_BR";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { MerchantSelect } from "../../Selects/merchantSelect";
import { PartnerSelect } from "../../Selects/partnerSelect";
import { StyleWrapperDatePicker } from "@src/components/FiltersModal/styles";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

interface mutateProps {
  type: "create" | "update";
  fields: {
    label: string;
    required: boolean;
    selectOption?: boolean;
    feesDetails?: boolean;
  }[];
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
}: mutateProps) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { Countries } = useGetrefetchCountries();
  const { clientbankListData, isClientBankListFetching } =
    useListClientClientBanks({
      page: 1,
      limit: 200,
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
          submit();
          setOpen(false);
        }}
      >
        {fields.map((field) => {
          switch (field.label) {
            case "date":
              return (
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
                        body?.start_date ? dayjs(body?.start_date) : null,
                        body?.end_date ? dayjs(body?.end_date) : null,
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
                            ? startDate.format("YYYY-MM-DDTHH:mm:00.000")
                            : null,
                          end_date: endDate
                            ? endDate.format("YYYY-MM-DDTHH:mm:59.999")
                            : null,
                        }));
                        formRef?.current?.validateFields();
                      }}
                    />
                  </ConfigProvider>
                </Form.Item>
              );
            case "merchant_id":
              if (permissions.register.merchant.merchant.merchant_list) {
                return (
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
                    <MerchantSelect
                      setQueryFunction={setBody}
                      queryOptions={body}
                    />
                  </Form.Item>
                );
              } else return;

            case "partner_id":
              if (
                permissions.register.partner.partner.partner_list &&
                !user.partner_id
              ) {
                return (
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
                );
              }
              return;

            case "aggregator_id":
              if (
                permissions.register.aggregator.aggregator.aggregator_list &&
                !user?.aggregator_id
              ) {
                return (
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
                      aggregatorId={body?.aggregator?.id ?? undefined}
                    />
                  </Form.Item>
                );
              }
              return;

            case "reason":
              return (
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
                  <ReasonSelect
                    setQueryFunction={setBody}
                    queryOptions={body}
                  />
                </Form.Item>
              );
            case "new_reason":
              return (
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
              );

            case "operator_id":
              if (
                permissions.register.operator.operator.operator_list &&
                !user?.operator_id
              ) {
                return (
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
                );
              }
              return;

            case "status":
            case "cash_in":
            case "cash_out":
              return (
                <Form.Item
                  label={t(`table.${field.label}`)}
                  name={field.label}
                  style={{ margin: 10 }}
                  valuePropName="checked"
                >
                  <Switch
                    checked={body[field.label]}
                    onChange={(e) =>
                      setBody((state: any) => ({ ...state, [field.label]: e }))
                    }
                  />
                </Form.Item>
              );
            case "cnpj":
              return (
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
                      const value = event.target.value.replace(/[^\d]/g, "");
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
              );

            case "cellphone":
              return (
                <Form.Item
                  label={t(`table.${field.label}`)}
                  name={field.label}
                  style={{ margin: 10 }}
                  help=""
                >
                  <ReactInputMask
                    value={body[field.label]}
                    mask="+9999999999999"
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^\d]/g, "");
                      if (!value) {
                        delete body[field.label];
                      }
                      setBody((state: any) => ({
                        ...state,
                        [field.label]: `+${value}`,
                      }));
                    }}
                  >
                    <Input size="large" />
                  </ReactInputMask>
                </Form.Item>
              );
            case "bank_name":
              return (
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
              );
            case "ispb":
              return;

            case "type":
              return (
                <Form.Item
                  label={t("table.type")}
                  name="type"
                  style={{ margin: 10 }}
                >
                  <Select
                    size="large"
                    options={
                      ["production"]?.map((item, index) => ({
                        key: index,
                        value: item,
                        label: `${t(`table.${item.toLocaleLowerCase()}`)}`,
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
                </Form.Item>
              );

            case "icon_url":
              return (
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
                    suffix={<Avatar src={body[field.label]} shape="square" />}
                  />
                </Form.Item>
              );

            case "country":
              return (
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
              );

            case "person_reason":
              return (
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
              );

            default:
              if (field.selectOption) {
                return (
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
                      options={selectOptions ? selectOptions[field.label] : []}
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
                );
              }
              return (
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
                  />
                </Form.Item>
              );
          }
        })}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
