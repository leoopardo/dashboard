/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Empty,
  Pagination,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useCreateMerchantFeePlans } from "@src/services/register/merchant/feePlans/createFeePlans";
import { useUpdateMerchantFeePlan } from "@src/services/register/merchant/feePlans/updateFeePlans";
import { useValidate } from "@services/siginIn/validate";
import { IDepositFeeItem } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import { Grid } from "@mui/material";

interface NewuserModalprops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentUser?: IDepositFeeItem | null;
  setCurrentUser?: Dispatch<SetStateAction<IDepositFeeItem | null>>;
  setUpdateBody?: Dispatch<SetStateAction<IDepositFeeItem | null>>;
  action: "create" | "update";
}
export const UpdateFeePlanModal = ({
  open,
  setOpen,
  currentUser,
  setCurrentUser,
  action,
}: NewuserModalprops) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormInstance>(null);
  const formFeesRef = useRef<FormInstance>(null);

  const [body, setBody] = useState<IDepositFeeItem>({
    name: "",
    plan_type: null,
    merchant_fee_plans_details: [],
    transaction_type: null,
    range_type: null,
  });
  const [fees, setFees] = useState<any[]>([]);
  const [feePage, setFeePage] = useState(1);
  const { mutate, error, isLoading, isSuccess } = useCreateMerchantFeePlans({
    ...body,
    merchant_fee_plans_details: fees,
  });
  const { updateError, updateIsLoading, updateIsSuccess, updateMutate } =
    useUpdateMerchantFeePlan(currentUser?.id, {
      ...body,
      merchant_fee_plans_details: fees,
    });

  function handleChangeUserBody(event: any) {
    setBody((state) => ({ ...state, [event.target.name]: event.target.value }));
  }

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

  const handleChangeFee = (
    event: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (fees.some((fee) => fee.id === id)) {
      const newFeeValue = {
        ...fees.find((fee) => fee.id === id),
        [event.target.name]: event.target.value,
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
    const updatedFees = fees.filter((fee) => fee.id !== id);

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
    if (currentUser && setCurrentUser) {
      updateMutate();
      setCurrentUser(null);
      setOpen(false);
      return;
    }
    mutate();
    setOpen(false);
    setBody({});
  }

  useEffect(() => {
    console.log('current', currentUser?.merchant_fee_plans_details)
    setFees(currentUser?.merchant_fee_plans_details ?? []);
    formFeesRef.current?.setFieldsValue((state: any) => ({
      ...state,
      merchant_fee_plans_details: currentUser?.merchant_fee_plans_details,
    }));
  }, [currentUser]);

  useEffect(() => {
    if (action === "create") {
      setBody({
        name: "",
        status: true,
      });
    }
  }, [action]);
  
  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        formRef.current?.resetFields();
        if (setCurrentUser) setCurrentUser(null);
      }}
      bodyStyle={{ overflowX: "hidden" }}
      width={450}
      title={currentUser ? t("buttons.update_user") : t("buttons.new_user")}
      footer={
        <Button
          loading={currentUser ? updateIsLoading : isLoading}
          type="primary"
          style={{ width: "100%" }}
          size="large"
          onClick={() => submitRef.current?.click()}
        >
          {currentUser ? t("buttons.update") : t("buttons.create")}
        </Button>
      }
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
        disabled={currentUser ? updateIsLoading : isLoading}
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
            value={body.name}
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
              setBody((state: any) => ({
                ...state,
                range_type: value,
              }));
            }}
            style={{ width: "100%", height: 40 }}
            placeholder={t(`input.range_type`)}
          />
        </Form.Item>

        <Grid
          container
          justifyContent={"flex-end"}
          style={{ paddingRight: "10px" }}
        >
          <Button
            type="default"
            onClick={() => {
              formFeesRef.current?.setFieldsValue((state: any) => ({
                ...state,
                merchant_fee_plans_details: [
                  ...state.merchant_fee_plans_details,
                  {
                    range_fee: 0,
                    range_value: 0,
                    range_limit: 0,
                    id: Math.random() * 10000000000000,
                  },
                ],
              }));
              setFees((state) => [
                ...state,
                {
                  range_fee: 0,
                  range_value: 0,
                  range_limit: 0,
                  id: Math.random() * 10000000000000,
                },
              ]);
            }}
          >
            Adicionar Taxa
          </Button>
        </Grid>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>

      <Form
        ref={formFeesRef}
        layout="vertical"
        initialValues={
          currentUser?.merchant_fee_plans_details ?? {
            merchant_fee_plans_id: 0,
            range_fee: 0,
            range_limit: 0,
            range_value: 0,
          }
        }
        disabled={currentUser ? updateIsLoading : isLoading}
      >
        {fees.length !== 0 &&
          listItems(fees, feePage, 3)?.map((fee: any) => (
            <Grid
              container
              spacing={1}
              alignItems={"center"}
              style={{ marginLeft: "5px", marginTop: "5px" }}
            >
              <Grid item xs={3}>
                <Form.Item label={t(`table.fee_percent`)} name="range_fee">
                  <Input
                    type="number"
                    size="large"
                    name="range_fee"
                    value={fee?.range_fee}
                    onChange={(event) => handleChangeFee(event, fee.id)}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={3}>
                <Form.Item label={t(`input.minimum_value`)} name="range_limit">
                  <Input
                    size="large"
                    type="number"
                    name="range_limit"
                    style={{ marginBottom: "20px" }}
                    value={fee?.range_limit}
                    onChange={(event) => handleChangeFee(event, fee.id)}
                  />
                </Form.Item>
              </Grid>
              <Grid item xs={3}>
                <Form.Item label={t(`table.limit`)} name="range_value">
                  <Input
                    size="large"
                    type="number"
                    name="range_value"
                    value={fee?.range_value}
                    onChange={(event) => handleChangeFee(event, fee.id)}
                  />
                </Form.Item>
              </Grid>
              <Grid item container xs={2} justifyContent={"center"}>
                <DeleteOutlined
                  onClick={() => handleDeleteFee(fee.id)}
                  style={{ fontSize: "20px", cursor: "pointer" }}
                />
              </Grid>
            </Grid>
          ))}
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
              pageSize={3}
              style={{ marginTop: fees.length > 2 ? "5px" : 0 }}
              onChange={(page) => {
                setFeePage(page);
              }}
            />
          </Grid>
        )}
      </Form>
    </Drawer>
  );
};
