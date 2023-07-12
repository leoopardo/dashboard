/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined } from "@ant-design/icons";
import { Grid, TextField } from "@mui/material";
import { IDepositFeeItem } from "@src/services/types/register/merchants/merchantFeePlans.interface";
import {
  Button,
  Drawer,
  Empty,
  Form,
  FormInstance,
  Input,
  Pagination,
  Select,
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
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormInstance>(null);
  const formFeesRef = useRef<FormInstance>(null);

  const [feePage, setFeePage] = useState(1);

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
  const handleChangeFee = (
    event: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (fees.some((fee: any) => fee.id === id)) {
      const newFeeValue = {
        ...fees.find((fee: any) => fee.id === id),
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
    if (currentUser && currentUser?.merchant_fee_plans_details) {
      const currentFeesDetails = currentUser?.merchant_fee_plans_details.map(
        (item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, merchant_fee_plans_id, ...rest } = item;

          return rest;
        }
      );
      return setFees(currentFeesDetails ?? []);
    }

    return setFees([]);
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

        <Grid
          container
          justifyContent={"flex-end"}
          style={{ paddingRight: "10px" }}
        >
          <Button
            type="default"
            onClick={() => {
              setFees((state: any) => [
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

      {fees.length !== 0 &&
        listItems(fees, feePage, 3)?.map((fee: any) => (
          <Grid
            container
            key={fee.id}
            spacing={1}
            alignItems={"center"}
            style={{ marginLeft: "5px", marginTop: "5px" }}
          >
            <Grid item xs={3}>
              <p style={{ marginBottom: "10px", color: "black" }}>
                {t("table.fee_percent")}
              </p>
              <TextField
                type="number"
                variant="outlined"
                name="range_fee"
                value={fee?.range_fee}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChangeFee(event, fee.id)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "38px",
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <p style={{ marginBottom: "10px", color: "black" }}>
                {t("input.minimum_value")}
              </p>
              <TextField
                type="number"
                variant="outlined"
                name="range_limit"
                value={fee?.range_limit}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChangeFee(event, fee.id)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "38px",
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <p style={{ marginBottom: "10px", color: "black" }}>
                {t("table.limit")}
              </p>
              <TextField
                type="number"
                variant="outlined"
                name="range_value"
                value={fee?.range_value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChangeFee(event, fee.id)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "38px",
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#5BC4BC",
                    },
                }}
              />
            </Grid>
            <Grid item container xs={2} justifyContent={"center"}>
              <DeleteOutlined
                onClick={() => handleDeleteFee(fee.id)}
                style={{ fontSize: "20px", cursor: "pointer", color: "red" }}
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
            style={{ marginTop: "10px" }}
            onChange={(page) => {
              setFeePage(page);
            }}
          />
        </Grid>
      )}
    </Drawer>
  );
};
