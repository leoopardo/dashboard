/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EyeFilled, InboxOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { ColumnInterface, CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Toast } from "@src/components/Toast";
import { useDeleteDeleteFile } from "@src/services/register/persons/persons/files/deleteFile";
import { useGetFiles } from "@src/services/register/persons/persons/files/getFiles";
import {
  CreateFileInterface,
  useUploadFile,
} from "@src/services/register/persons/persons/files/uploadFile";
import { useGetBlacklistReasons } from "@src/services/register/persons/persons/getPersonBlacklistReasons";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { useGetPersonHistory, useGetPersonHistoryDetails } from "@src/services/register/persons/persons/getPersonsHistory";
import { useUpdatePerson } from "@src/services/register/persons/persons/updatePerson";
import { useGetCities } from "@src/services/states_cities/getCities";
import { useGetStates } from "@src/services/states_cities/getStates";
import {
  PersonsItem,
  PersonsQuery,
} from "@src/services/types/register/persons/persons.interface";
import { setFirstChildDivId } from "@src/utils/functions";
import {
  AutoComplete,
  Button,
  DatePicker,
  Empty,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Select,
  Spin,
  Tabs,
  TabsProps,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useLocation, useParams } from "react-router-dom";
import { ViewModal } from "./components/ViewModal";

const INITIAL_QUERY: PersonsQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const PersonUpdate = () => {
  const { t } = useTranslation();
  const { cpf } = useParams();
  const currentData = useLocation()?.state;
  const [body, setBody] = useState<PersonsItem | undefined>(undefined);
  const [currentObj, setCurrentObj] = useState<any | undefined>(undefined);
  const [currState, setCurrState] = useState<string | undefined>("");
  const [fileBody, setFileBody] = useState<CreateFileInterface | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string>("");
  const formRef = useRef<FormInstance>(null);
  const formRefBlock = useRef<FormInstance>(null);
  const submitRef1 = useRef<HTMLButtonElement>(null);
  const submitRefBlock = useRef<HTMLButtonElement>(null);

  const tabGeneralData = document.querySelector('[data-node-key="1"]');
  const tabBlocks = document.querySelector('[data-node-key="2"]');
  const tabLimits = document.querySelector('[data-node-key="3"]');
  const tabAttachments = document.querySelector('[data-node-key="4"]');
  const tabHistoric = document.querySelector('[data-node-key="5"]');

  const [query, setQuery] = useState<PersonsQuery>({
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: cpf?.split(" ").join("."),
  });
  const { states } = useGetStates();
  const { cities, refetchCities } = useGetCities(currState);
  const { PersonsData, isPersonsDataFetching } = useGetPersons(query);
  const { BlacklistReasons } = useGetBlacklistReasons({ limit: 200, page: 1 });
  const {
    PersonsHistoryData,
    PersonsHistoryDataError,
    isPersonsHistoryDataFetching,
    refetchHistoryPersonsData,
  } = useGetPersonHistory(
    { ...query, cpf: undefined },
    cpf?.split(" ").join(".") || ""
  );

  const { refetchHistoryPersonsDetailsData } = useGetPersonHistoryDetails(
    { ...query, cpf: undefined },
    cpf?.split(" ").join(".") || "",
    currentObj?._id
  );
  const { UpdateMutate, UpdateError, UpdateIsLoading, UpdateIsSuccess } =
    useUpdatePerson(body, cpf?.split(" ").join("."));

  const { FileMutate, FileError, FileIsSuccess } = useUploadFile(
    fileBody,
    cpf?.split(" ").join(".")
  );
  const { DeleteFileError, DeleteFileIsSuccess, DeleteFileMutate } =
    useDeleteDeleteFile(cpf?.split(" ").join("."), deleteFileId);

  const { Files, isFilesFetching, refetchFiles } = useGetFiles(
    currentData?.cpf
  );

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "cpf", type: "document" },
    { name: "user_name", type: "text" },
    { name: "step", type: "translate" },
    { name: "createdAt", type: "date" },
  ];

  const onChangeConfigs = (event: any) => {
    const { value } = event.target;
    setBody((state) => ({ ...state, [event.target.name]: value }));
  };

  useEffect(() => {
    refetchFiles();
    setCurrState(currentData?.state);
  }, [PersonsData]);

  useEffect(() => {
    refetchHistoryPersonsData();
  }, [query]);

  useEffect(() => {
    if (currentObj && isViewOpen) {
      refetchHistoryPersonsDetailsData();
    }
  }, [isViewOpen]);

  useEffect(() => {
    refetchCities();
  }, [currState]);

  useEffect(() => {
    if (deleteFileId) DeleteFileMutate();
  }, [deleteFileId]);

  useEffect(() => {
    if (fileBody?.base64_file) {
      FileMutate();
      setFileBody({ base64_file: "", file_name: "" });
    }
  }, [fileBody]);

  useEffect(() => {
    setFirstChildDivId(tabGeneralData, "tab-general-data");
    setFirstChildDivId(tabBlocks, "tab-blocks");
    setFirstChildDivId(tabLimits, "tab-limit");
    setFirstChildDivId(tabAttachments, "tab-attachments");
    setFirstChildDivId(tabHistoric, "tab-historic");
  }, [tabGeneralData, tabBlocks, tabLimits, tabAttachments, tabHistoric]);

  useEffect(() => {
    formRef.current?.setFieldsValue(PersonsData);
  }, [PersonsData]);

  useEffect(() => {
    setBody({
      ...PersonsData?.items[0],
      birth_date: PersonsData?.items[0].birth_date
        ? moment(new Date(`${PersonsData?.items[0].birth_date}`))
            .add(1, "day")
            .toISOString()
        : undefined,
    });
  }, [PersonsData]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.general_data"),
      children: isPersonsDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Form
          layout="vertical"
          ref={formRef}
          initialValues={{
            ...PersonsData?.items[0],
            birth_date: dayjs(
              `${moment(PersonsData?.items[0]?.birth_date)}`,
              "YYYY-MM-DD HH:mm:ss"
            ),
          }}
          onFinish={() => {
            UpdateMutate();
            setIsConfirmOpen(false);
          }}
        >
          <Grid container columnSpacing={1}>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", { field: t("input.name") }) || "",
                  },
                ]}
              >
                <Input
                  size="large"
                  name="name"
                  value={body?.name}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.birth_date")}
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required(a)", {
                        field: t("table.birth_date"),
                      }) || "",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  name="birth_date"
                  format={"DD/MM/YYYY"}
                  value={
                    formRef.current?.getFieldValue("birth_date")
                      ? dayjs(body?.birth_date, "YYYY-MM-DD HH:mm:ss")
                      : null
                  }
                  onChange={(e: any) => {
                    setBody((state) => ({
                      ...state,
                      birth_date: moment(e?.$d ?? new Date()).format(
                        "YYYY-MM-DDTHH:mm:ss"
                      ),
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.mother_name")} name="mother_name">
                <Input
                  size="large"
                  name="mother_name"
                  value={body?.mother_name}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.gender")} name="gender">
                <Select
                  size="large"
                  options={[
                    { label: t("table.male"), value: "masculino" },
                    { label: t("table.female"), value: "feminino" },
                  ]}
                  value={body?.gender}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({ ...state, gender: option.value }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.state")} name="state">
                <AutoComplete
                  size="large"
                  style={{ width: "100%", height: "40px" }}
                  placeholder={t(`table.state`)}
                  value={body?.state}
                  onSelect={(value) => {
                    delete body?.city;
                    setBody((state: any) => ({
                      ...state,
                      state: value,
                    }));
                    setCurrState(value);
                  }}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  options={states?.map((state) => {
                    return {
                      value: state.sigla,
                      label: state.sigla,
                    };
                  })}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item label={t("table.city")} name="city">
                <AutoComplete
                  size="large"
                  disabled={!formRef.current?.getFieldValue("state")}
                  style={{ width: "100%", height: "40px" }}
                  placeholder={t(`table.city`)}
                  value={body?.city}
                  onSelect={(value) => {
                    setBody((state: any) => ({
                      ...state,
                      city: value,
                    }));
                  }}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  options={cities?.map((state) => {
                    return {
                      value: state.nome,
                      label: state.nome,
                    };
                  })}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.neighborhood")} name="neighborhood">
                <Input
                  size="large"
                  name="neighborhood"
                  value={body?.neighborhood}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.street")} name="street">
                <Input
                  size="large"
                  name="street"
                  value={body?.street}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.number")} name="number">
                <Input
                  size="large"
                  name="number"
                  value={body?.number}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item label={t("table.zip_code")} name="zip_code">
                <ReactInputMask
                  mask="99999-999"
                  value={body?.zip_code}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      zip_code: e.target.value,
                    }));
                  }}
                >
                  <Input size="large" />
                </ReactInputMask>
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Form.Item
                label={t("table.email")}
                name="email"
                rules={[
                  {
                    type: "email",
                    message:
                      t("input.invalid", { field: t("input.email") }) ?? "",
                  },
                ]}
              >
                <Input
                  size="large"
                  name="email"
                  value={body?.email}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.cellphone")} name="cellphone">
                <Input
                  size="large"
                  name="cellphone"
                  value={body?.cellphone}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
          </Grid>
          <Grid
            container
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item>
                <button
                  type="submit"
                  ref={submitRef1}
                  style={{ display: "none" }}
                >
                  Submit
                </button>
                <Popconfirm
                  title={t("messages.confirm_action_title", {
                    action: t("messages.update"),
                  })}
                  description={t("messages.are_you_sure", {
                    action: t("messages.update"),
                    itens: body?.name,
                  })}
                  open={isConfirmOpen}
                  style={{ maxWidth: "340px" }}
                  onConfirm={() => {
                    submitRef1.current?.click();
                  }}
                  okButtonProps={{ loading: UpdateIsLoading }}
                  okText={t("messages.yes_update")}
                  cancelText={t("messages.no_cancel")}
                  onCancel={() => setIsConfirmOpen(false)}
                >
                  <Button
                    size="large"
                    type="primary"
                    style={{ width: "100%" }}
                    loading={isPersonsDataFetching || UpdateIsLoading}
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    {t("buttons.update_person")}
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    },
    {
      key: "2",
      label: t("table.locks"),
      children: isPersonsDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Form
          layout="vertical"
          initialValues={PersonsData?.items[0]}
          ref={formRefBlock}
          onFinish={() => {
            UpdateMutate();
            setIsConfirmOpen(false);
          }}
        >
          <Grid
            container
            columnSpacing={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <button
              type="submit"
              ref={submitRefBlock}
              style={{ display: "none" }}
            >
              Submit
            </button>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.black_list")} name="black_list">
                <Select
                  size="large"
                  options={[
                    { label: t("table.true"), value: true },
                    { label: t("table.false"), value: false },
                  ]}
                  value={body?.black_list}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({
                      ...state,
                      black_list: option.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item
                label={t("table.black_list_reason")}
                name="black_list_reason"
                rules={[
                  {
                    required: body?.black_list,
                    validator: (_, value) => {
                      if (
                        body?.black_list &&
                        !body?.black_list_reason &&
                        !value
                      ) {
                        return Promise.reject(
                          t("input.required", {
                            field: t("table.black_list_reason"),
                          }) || ""
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <AutoComplete
                  size="large"
                  options={BlacklistReasons?.items.map((reason) => {
                    return { label: reason.reason, value: reason.reason };
                  })}
                  value={body?.black_list_reason}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onChange={(e) => {
                    if (!e) {
                      delete body?.black_list_reason;
                    }
                  }}
                  onSelect={(_value, option: any) => {
                    setBody((state) => ({
                      ...state,
                      black_list_reason: option.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.black_list_description")}
                name="black_list_description"
              >
                <Input
                  size="large"
                  name="black_list_description"
                  value={body?.black_list_description}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.flag_pep")} name="flag_pep">
                <Select
                  size="large"
                  options={[
                    { label: t("table.true"), value: true },
                    { label: t("table.false"), value: false },
                  ]}
                  value={body?.flag_pep}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({ ...state, flag_pep: option.value }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item label={t("table.flag_aux_gov")} name="flag_aux_gov">
                <Select
                  size="large"
                  options={[
                    { label: t("table.true"), value: true },
                    { label: t("table.false"), value: false },
                  ]}
                  value={body?.flag_aux_gov}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({
                      ...state,
                      flag_aux_gov: option.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item label={t("table.flag_alert")} name="flag_alert">
                <Select
                  size="large"
                  options={[
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                    { label: 2, value: 2 },
                    { label: 3, value: 3 },
                  ]}
                  value={body?.flag_alert}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({
                      ...state,
                      flag_alert: option.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
          </Grid>
          <Grid
            container
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item>
                <Popconfirm
                  title={t("messages.confirm_action_title", {
                    action: t("messages.update"),
                  })}
                  description={t("messages.are_you_sure", {
                    action: t("messages.update"),
                    itens: body?.name,
                  })}
                  open={isConfirmOpen}
                  style={{ maxWidth: "340px" }}
                  onConfirm={() => {
                    submitRefBlock.current?.click();
                  }}
                  okButtonProps={{ loading: UpdateIsLoading }}
                  okText={t("messages.yes_update")}
                  cancelText={t("messages.no_cancel")}
                  onCancel={() => setIsConfirmOpen(false)}
                >
                  <Button
                    size="large"
                    type="primary"
                    style={{ width: "100%" }}
                    loading={isPersonsDataFetching || UpdateIsLoading}
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    {t("buttons.update_person")}
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    },
    {
      key: "3",
      label: t("table.limits"),
      children: isPersonsDataFetching ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Form layout="vertical" initialValues={PersonsData?.items[0]}>
          <Grid
            container
            columnSpacing={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.cash_in_max_value_per_day")}
                name="cash_in_max_value"
              >
                <CurrencyInput
                  data-test-id="cash_in_max_value"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_in_max_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.cash_out_max_value_per_day")}
                name="cash_out_max_value"
              >
                <CurrencyInput
                  data-test-id="cash_out_max_value"
                  onChangeValue={(_event, originalValue) => {
                    setBody((state) => ({
                      ...state,
                      cash_out_max_value: +originalValue,
                    }));
                  }}
                  InputElement={
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      value={body?.cash_out_max_value}
                    />
                  }
                />
              </Form.Item>
            </Grid>

            <Grid item xs={12} md={4} lg={2}>
              <Form.Item
                label={t("table.cash_out_transaction_limit_per_day")}
                name="cash_out_transaction_limit"
              >
                <Select
                  size="large"
                  options={[
                    { label: t("input.unlimited")?.slice(0, -1), value: 0 },
                    { label: 1, value: 1 },
                    { label: 2, value: 2 },
                    { label: 3, value: 3 },
                    { label: 4, value: 4 },
                    { label: 5, value: 5 },
                  ]}
                  value={body?.cash_out_transaction_limit}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({
                      ...state,
                      cash_out_transaction_limit: option.value,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
          </Grid>
          <Grid
            container
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item>
                <Popconfirm
                  title={t("messages.confirm_action_title", {
                    action: t("messages.update"),
                  })}
                  description={t("messages.are_you_sure", {
                    action: t("messages.update"),
                    itens: body?.name,
                  })}
                  open={isConfirmOpen}
                  style={{ maxWidth: "340px" }}
                  onConfirm={() => {
                    submitRef1.current?.click();
                  }}
                  okButtonProps={{ loading: UpdateIsLoading }}
                  okText={t("messages.yes_update")}
                  cancelText={t("messages.no_cancel")}
                  onCancel={() => setIsConfirmOpen(false)}
                >
                  <Button
                    size="large"
                    type="primary"
                    style={{ width: "100%" }}
                    loading={isPersonsDataFetching || UpdateIsLoading}
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    {t("buttons.update_person")}
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      ),
    },
    {
      key: "4",
      label: t("table.attachments"),
      children: isFilesFetching ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Grid container spacing={1} >
          <Grid xs={12} item>
            <Upload
              listType="picture"
              multiple={false}
              onRemove={(file) => {
                setDeleteFileId(file?.uid);
              }}
              defaultFileList={Files?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
              beforeUpload={(file) => {
                setFileBody({ base64_file: "", file_name: "" });
                setFileBody((state: any) => ({
                  ...state,
                  file_name: file.name,
                }));
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setFileBody((state: any) => ({
                    ...state,
                    base64_file: reader.result,
                  }));
                };
                return false;
              }}
            >
              <motion.div
                style={{
                  width: "calc(100vw - 28%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "2px dashed #acacac53",
                  padding: 24,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: 10,
                }}
                whileHover={{ backgroundColor: "#c5c5c522" }}
                transition={{ duration: 0.5 }}
              >
                <Typography>
                  <InboxOutlined style={{ fontSize: 32 }} />
                </Typography>
                <Typography.Title level={3}>
                  {t("messages.upload_label")}
                </Typography.Title>
                <Typography>{t("messages.upload_description")}</Typography>
              </motion.div>
            </Upload>
          </Grid>

          {!Files?.total && !fileBody?.base64_file && (
            <Grid item xs={12}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("error.400")}
              />
            </Grid>
          )}
        </Grid>
      ),
    },
    {
      key: "5",
      label: t("table.historic"),
      children: isFilesFetching ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid
            container
            style={{ display: "flex", alignItems: "center" }}
            spacing={1}
          >
            <Grid item xs={12} md={4} lg={2}>
              <Button
                size="large"
                style={{ width: "100%" }}
                loading={isPersonsDataFetching}
                type="primary"
                onClick={() => setIsFiltersOpen(true)}
              >
                {t("table.filters")}
              </Button>
            </Grid>
            <Grid item xs={12} md={8} lg={10}>
              <FilterChips initial_query={INITIAL_QUERY}
                startDateKeyName="initial_date"
                endDateKeyName="final_date"
                query={query}
                setQuery={setQuery}
              />
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <CustomTable
              query={query}
              setCurrentItem={setCurrentObj}
              setQuery={setQuery}
              actions={[
                {
                  label: "details",
                  icon: <EyeFilled style={{ fontSize: "20px" }} />,
                  onClick: () => setIsViewOpen(true),
                },
              ]}
              data={PersonsHistoryData}
              items={PersonsHistoryData?.items}
              error={PersonsHistoryDataError}
              columns={columns}
              loading={isPersonsHistoryDataFetching}
              label={["user_name", "step"]}
            />
          </Grid>

          {isViewOpen && (
            <ViewModal
              cpf={currentObj?.cpf}
              id={currentObj?._id}
              open={isViewOpen}
              setOpen={setIsViewOpen}
              query={query}
            />
          )}

          <FiltersModal
            open={isFiltersOpen}
            setOpen={setIsFiltersOpen}
            query={query}
            setQuery={setQuery}
            filters={["initial_date", "final_date", "step"]}
            refetch={refetchHistoryPersonsData}
            selectOptions={{
              step: [
                "UPDATE_CPF",
                "CREATE_CPF",
                "UPDATE_FILE",
                "CREATE_FILE",
                "DELETE_FILE",
              ],
            }}
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            initialQuery={INITIAL_QUERY}
          />
        </Grid>
      ),
    },
  ];

  return (
    <Grid
      container
      style={{
        padding: "25px",
        display: "flex",
        minHeight: "1000px",
      }}
    >
      <Grid item xs={12}>
        <Tabs defaultActiveKey="1" items={items} />
      </Grid>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.uploaded")}
        actionError={t("messages.upload")}
        error={FileError}
        success={FileIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteFileError}
        success={DeleteFileIsSuccess}
      />
    </Grid>
  );
};
