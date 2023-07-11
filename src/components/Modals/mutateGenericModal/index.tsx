/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  SetStateAction,
  useRef,
  ChangeEvent,
} from "react";
import {
  AutoComplete,
  Avatar,
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Switch,
  Empty,
} from "antd";
import { useTranslation } from "react-i18next";
import { MerchantSelect } from "../../Selects/merchantSelect";
import { PartnerSelect } from "../../Selects/partnerSelect";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import ReactInputMask from "react-input-mask";
import { Country, State, City } from "country-state-city";
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { useListClientClientBanks } from "@src/services/bank/listClientBanks";
import { ReasonSelect } from "@src/components/Selects/reasonSelect";
import { Grid } from "@mui/material";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

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
}: mutateProps) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
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
          {type == "create" ? t("buttons.create") : t("buttons.update")}
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
              if (permissions.register.partner.partner.partner_list) {
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
                    <PartnerSelect
                      setQueryFunction={setBody}
                      queryOptions={body}
                    />
                  </Form.Item>
                );
              } else return;

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

            case "operator_id":
              if (permissions.register.operator.operator.operator_list) {
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
              } else return;

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
                        return console.log(body);
                      }
                      setBody((state: any) => ({
                        ...state,
                        [field.label]: value,
                      }));
                      console.log(body);
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
                    onChange={(value, option: any) => {
                      setBody({
                        bank_name: option.value,
                        ispb: option.key,
                      });

                      console.log(option);
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
