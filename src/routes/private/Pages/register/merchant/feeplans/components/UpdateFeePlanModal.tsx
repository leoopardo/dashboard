/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import {
  IDepositFeeItem,
  IDepositFeePlansDetails,
} from "@src/services/types/register/merchants/merchantFeePlans.interface";
import {
  Button,
  Drawer,
  Empty,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Pagination,
  Select,
  Space,
  Table,
} from "antd";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useGetFeePlansDetails } from "@src/services/register/merchant/feePlans/getFeePlansDetails";

interface NewuserModalprops {
  open: boolean;
  mutate: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: IDepositFeeItem | null;
  setCurrentUser?: Dispatch<SetStateAction<IDepositFeeItem | null>>;
  setUpdateBody?: Dispatch<SetStateAction<IDepositFeeItem | null>>;
  setBody: Dispatch<SetStateAction<IDepositFeeItem | null>>;
  body: IDepositFeeItem | null;
  setFees: Dispatch<SetStateAction<any>>;
  fees: any;
  loading: boolean;
  action: "create" | "update";
}

interface ICreateDetails extends IDepositFeePlansDetails {
  length?: number;
}
export const UpdateFeePlanModal = ({
  open,
  setOpen,
  currentUser,
  setCurrentUser,
  mutate,
  setUpdateBody,
  fees,
  body,
  setBody,
  setFees,
  loading,
  action,
}: NewuserModalprops) => {
  const { Column } = Table;
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormInstance>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const formFeesRef = useRef<FormInstance>(null);
  const [createFeeDetails, setCreateFeeDetails] = useState<ICreateDetails | []>(
    []
  );
  const [feeToUpdate, setFeeToUpdate] = useState<string>(
    ''
  );
  console.log({feeToUpdate})
  const {
    feePlansDetailsData,
    isFeePlansDetailsDataFetching,
    refetchFeePlansDetailsData,
  } = useGetFeePlansDetails({ fee_plans_id: currentUser?.id });
  const [feePage, setFeePage] = useState(1);
  const test = true
  const handleChangeUserBody = (event: ChangeEvent<HTMLInputElement>) => {
    if (setUpdateBody) {
      setUpdateBody((state) => ({
        ...state,
        [event.target.name]: event.target.value,
      }));
    }
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  const listItems = (items: any, atual: any, limit: number) => {
    const result = [];
    const totalPage = Math.ceil(items?.length / limit);
    let count = atual * limit - limit;
    const delimiter = count + limit;
    if (atual <= totalPage) {
      for (let i = count; i < delimiter; i++) {
        if (items[i]) {
          result.push(items[i]);
        }
        count++;
      }
    }

    return result;
  };

  const handleChangeCreateFee = (
    event: ChangeEvent<HTMLInputElement>,
    field: "range_fee" | "range_value" | "range_limit"
  ) => {
    setCreateFeeDetails((state) => ({
      ...state,
      [field]: event,
    }));
  };
  const handleChangeFee = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
    field: "range_fee" | "range_value" | "range_limit"
  ) => {
    if (fees.some((fee: any) => fee.id === id)) {
      const newFeeValue = {
        ...fees.find((fee: any) => fee.id === id),
        [field]: event,
      };

      const f = [...fees];
      const foundedIndex = f.findIndex((fee) => fee.id === id);

      f[foundedIndex] = newFeeValue;

      setFees(f);
      formFeesRef.current?.setFieldsValue((state: any) => ({
        ...state,
        f,
      }));
    }
  };

  const handleDeleteFee = (id: number) => {
    const updatedFees = fees.filter((fee: any) => fee.id !== id);

    formFeesRef.current?.setFieldsValue((state: any) => ({
      ...state,
      merchant_fee_plans_details: updatedFees,
    }));

    setFees(updatedFees);

    if (fees.length < 4) {
      setFeePage(1);
    }
  };

  function CreateUser() {
    mutate();
    setBody({});
    if (setUpdateBody) setUpdateBody({});
    setOpen(false);
  }

  useEffect(() => {
    setFees(feePlansDetailsData?.items ?? []);
  }, [currentUser, feePlansDetailsData]);

  useEffect(() => {
    if (action === "create") {
      setBody({
        name: "",
        status: true,
      });
    }
  }, [action]);

  useEffect(() => {
    refetchFeePlansDetailsData();
  }, []);

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentUser) setCurrentUser(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      title={t("buttons.new_fee")}
      footer={
        <Button
          loading={loading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {currentUser ? t("buttons.update") : t("buttons.create")}
        </Button>
      }
    >
      <div
        style={{
          maxHeight: "95%",
          overflowY: "auto",
          paddingRight: "15px",
        }}
        ref={divRef}
      >
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={
            currentUser ?? {
              name: "",
              plan_type: null,
              merchant_fee_plans_details: [],
              transaction_type: null,
              range_type: null,
            }
          }
          disabled={loading}
          onFinish={CreateUser}
        >
          <Form.Item
            label={t(`table.name`)}
            name="name"
            style={{ margin: 10 }}
            rules={[
              {
                required: true,
                message: t("input.required", { field: t("input.name") }) || "",
              },
            ]}
          >
            <Input
              size="large"
              name="name"
              value={body?.name || ""}
              onChange={handleChangeUserBody}
            />
          </Form.Item>
          <Form.Item
            label={t(`input.plan_type`)}
            name="plan_type"
            style={{ margin: 10 }}
            rules={[
              {
                required: true,
                message:
                  t("input.required", {
                    field: t(`input.plan_type`),
                  }) || "",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                { label: t("table.monthly"), value: "MONTHLY" },
                { label: t("table.continuos"), value: "CONTINUOS" },
              ]}
              notFoundContent={<Empty />}
              value={currentUser?.plan_type || null}
              onChange={(value) => {
                if (setUpdateBody) {
                  setUpdateBody((state: any) => ({
                    ...state,
                    plan_type: value,
                  }));
                }
                setBody((state: any) => ({
                  ...state,
                  plan_type: value,
                }));
              }}
              style={{ width: "100%", height: 40 }}
              placeholder={t(`input.plan_type`)}
            />
          </Form.Item>

          <Form.Item
            label={t(`input.transaction_type`)}
            name="transaction_type"
            style={{ margin: 10 }}
            rules={[
              {
                required: true,
                message:
                  t("input.required", {
                    field: t(`input.transaction_type`),
                  }) || "",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                { label: t("table.cashin"), value: "CASHIN" },
                { label: t("table.cashout"), value: "CASHOUT" },
              ]}
              notFoundContent={<Empty />}
              value={currentUser?.transaction_type || null}
              onChange={(value) => {
                if (setUpdateBody) {
                  setUpdateBody((state: any) => ({
                    ...state,
                    transaction_type: value,
                  }));
                }
                setBody((state: any) => ({
                  ...state,
                  transaction_type: value,
                }));
              }}
              style={{ width: "100%", height: 40 }}
              placeholder={t(`input.transaction_type`)}
            />
          </Form.Item>

          <Form.Item
            label={t(`input.range_type`)}
            name="range_type"
            style={{ margin: 10 }}
            rules={[
              {
                required: true,
                message:
                  t("input.required", {
                    field: t(`input.range_type`),
                  }) || "",
              },
            ]}
          >
            <Select
              size="large"
              options={[
                { label: t("table.transactions"), value: "TRANSACTIONS" },
                { label: t("table.value"), value: "VALUE" },
              ]}
              notFoundContent={<Empty />}
              value={currentUser?.range_type || null}
              onChange={(value) => {
                if (setUpdateBody) {
                  setUpdateBody((state: any) => ({
                    ...state,
                    range_type: value,
                  }));
                }
                setBody((state: any) => ({
                  ...state,
                  range_type: value,
                }));
              }}
              style={{ width: "100%", height: 40 }}
              placeholder={t(`input.range_type`)}
            />
          </Form.Item>
          {action === "update" && (
            <Grid
              container
              justifyContent={"flex-end"}
              style={{ paddingRight: "10px" }}
            >
              <Button
                type="dashed"
                onClick={() => {
                  setCreateFeeDetails([
                    {
                      range_fee: 0,
                      range_value: 0,
                      range_limit: 0,
                      id: Math.random() * 10000000000000,
                    },
                  ]);
                  divRef.current?.scrollTo({
                    top: 5000,
                    left: 5000,
                    behavior: "smooth",
                  });
                }}
              >
                <PlusOutlined />
                {t("buttons.add_fee")}
              </Button>
            </Grid>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
          </Form.Item>
        </Form>

        {createFeeDetails?.length !== 0 &&
          listItems(createFeeDetails, feePage, 2)?.map((fee: any) => (
            <Grid container style={{ marginTop: "-20px" }}>
              <Form
                layout="vertical"
                initialValues={listItems(createFeeDetails, feePage, 2).find(
                  (f) => f.id === fee.id
                )}
              >
                <Space.Compact size="large">
                  <Grid item xs={2}>
                    <Form.Item label={`${t("table.fee")}:`}>
                      <InputNumber
                        value={fee?.range_fee}
                        onChange={(event) => {
                          handleChangeCreateFee(event, "range_fee");
                        }}
                      />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={5}>
                    <Form.Item label={`${t("input.minimum_value")}:`}>
                      <InputNumber
                        style={{ width: "100%" }}
                        value={fee?.range_value}
                        onChange={(event) =>
                          handleChangeCreateFee(event, "range_value")
                        }
                      />
                    </Form.Item>
                  </Grid>
                  <Grid item xs={3}>
                    <Form.Item label={`${t("table.limit")}:`}>
                      <InputNumber
                        value={fee?.range_limit}
                        onChange={(event) =>
                          handleChangeCreateFee(event, "range_limit")
                        }
                      />
                    </Form.Item>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={1}
                    justifyContent={"center"}
                    style={{ marginLeft: 10 }}
                  >
                    <PlusOutlined
                      onClick={() => setCreateFeeDetails([])}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    xs={1}
                    justifyContent={"center"}
                    style={{ marginLeft: 10 }}
                  >
                    <DeleteOutlined
                      onClick={() => setCreateFeeDetails([])}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  </Grid>
                </Space.Compact>
              </Form>
            </Grid>
          ))}

        {fees?.length !== 0 && (
          <>
            <Table dataSource={fees}>
              {test ? (
                <InputNumber value={"test"}
                />
              ) : (
                <Column
                  title={t("table.fee")}
                  dataIndex="range_fee"
                  key="range_fee"
                />
              )}
              <Column
                title={t("input.minimum_value")}
                dataIndex="range_value"
                key="range_value"
              />
              <Column
                title={t("table.limit")}
                dataIndex="range_limit"
                key="range_limit"
              />
              <Column
                title="Action"
                key="action"
                render={(_: any, record: any) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() => setFeeToUpdate(record.id)}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => setCreateFeeDetails([])}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  </Space>
                )}
              />
            </Table>

            {listItems(fees, feePage, 2)?.map((fee: any) => (
              <Grid container style={{ marginTop: "-20px" }}>
                <Form
                  layout="vertical"
                  initialValues={listItems(fees, feePage, 2).find(
                    (f) => f.id === fee.id
                  )}
                >
                  <Space.Compact size="large">
                    <Grid item xs={2}>
                      <Form.Item label={`${t("table.fee")}:`}>
                        <InputNumber
                          value={fee?.range_fee}
                          onChange={(event) => {
                            handleChangeCreateFee(event, "range_fee");
                          }}
                        />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={5}>
                      <Form.Item label={`${t("input.minimum_value")}:`}>
                        <InputNumber
                          style={{ width: "100%" }}
                          value={fee?.range_value}
                          onChange={(event) =>
                            handleChangeCreateFee(event, "range_value")
                          }
                        />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={3}>
                      <Form.Item label={`${t("table.limit")}:`}>
                        <InputNumber
                          value={fee?.range_limit}
                          onChange={(event) =>
                            handleChangeCreateFee(event, "range_limit")
                          }
                        />
                      </Form.Item>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={1}
                      justifyContent={"center"}
                      style={{ marginLeft: 10 }}
                    >
                      <PlusOutlined
                        onClick={() => setCreateFeeDetails([])}
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          color: "blue",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      xs={1}
                      justifyContent={"center"}
                      style={{ marginLeft: 10 }}
                    >
                      <DeleteOutlined
                        onClick={() => setCreateFeeDetails([])}
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    </Grid>
                  </Space.Compact>
                </Form>
              </Grid>
            ))}
          </>
        )}

        {fees.length > 2 && (
          <Grid
            container
            justifyContent={"flex-end"}
            style={{ paddingRight: "40px" }}
          >
            <Pagination
              size="small"
              total={Number(fees.length)}
              current={feePage}
              pageSize={2}
              onChange={(page) => {
                setFeePage(page);
              }}
            />
          </Grid>
        )}
      </div>
    </Drawer>
  );
};
