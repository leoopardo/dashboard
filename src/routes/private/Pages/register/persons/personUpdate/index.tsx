import { Grid } from "@mui/material";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import {
  PersonsItem,
  PersonsQuery,
} from "@src/services/types/register/persons/persons.interface";
import {
  AutoComplete,
  Button,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Spin,
  Tabs,
  TabsProps,
  Upload,
  UploadProps,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useGetFiles } from "@src/services/register/persons/persons/files/getFiles";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { useGetStates } from "@src/services/states_cities/getStates";
import { useGetCities } from "@src/services/states_cities/getCities";
import ReactInputMask from "react-input-mask";
import { useGetBlacklistReasons } from "@src/services/register/persons/persons/getPersonBlacklistReasons";
import { useUpdatePerson } from "@src/services/register/persons/persons/updatePerson";
import { Toast } from "@src/components/Toast";
import {
  CreateFileInterface,
  useUploadFile,
} from "@src/services/register/persons/persons/files/uploadFile";
import { useDeleteDeleteFile } from "@src/services/register/persons/persons/files/deleteFile";
import Dragger from "antd/es/upload/Dragger";

export const PersonUpdate = () => {
  const [body, setBody] = useState<PersonsItem | undefined>(undefined);
  const [currState, setCurrState] = useState<string | undefined>("");
  const [fileBody, setFileBody] = useState<CreateFileInterface | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isConfirmFileOpen, setIsConfirmFileOpen] = useState<boolean>(false);
  const [deleteFileId, setDeleteFileId] = useState<string>("");
  const submitRef1 = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const { cpf } = useParams();
  const query: PersonsQuery = {
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: cpf?.split(" ").join("."),
  };
  const { states } = useGetStates();
  const { cities, refetchCities } = useGetCities(currState);
  const { PersonsData, isPersonsDataFetching } = useGetPersons(query);
  const { BlacklistReasons } = useGetBlacklistReasons({ limit: 200, page: 1 });

  const { UpdateMutate, UpdateError, UpdateIsLoading, UpdateIsSuccess } =
    useUpdatePerson(body, cpf?.split(" ").join("."));

  const { FileMutate, FileError, FileIsLoading, FileIsSuccess } = useUploadFile(
    fileBody,
    cpf?.split(" ").join(".")
  );
  const {
    DeleteFileError,
    DeleteFileIsLoading,
    DeleteFileIsSuccess,
    DeleteFileMutate,
  } = useDeleteDeleteFile(cpf?.split(" ").join("."), deleteFileId);

  ///// attachments -------------------------

  const { Files, isFilesFetching, refetchFiles } = useGetFiles(
    PersonsData?.items[0]?.cpf
  );

  useEffect(() => {
    setBody(PersonsData?.items[0]);
    refetchFiles();
    setCurrState(PersonsData?.items[0].state);
  }, [PersonsData]);

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

  const onChangeConfigs = (event: any) => {
    const { value } = event.target;
    setBody((state) => ({ ...state, [event.target.name]: value }));
    console.log(body);
  };

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
          initialValues={{
            ...PersonsData?.items[0],
            birth_date: dayjs(
              `${moment(PersonsData?.items[0]?.birth_date).add(1, "days")}`,
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
                name="birth_date"
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
                  value={dayjs(body?.birth_date, "YYYY-MM-DD HH:mm:ss")}
                  onChange={(e: any) => {
                    setBody((state) => ({
                      ...state,
                      birth_date: moment(e?.$d ?? new Date()).format(
                        "YYYY-MM-DDTHH:mm:ss"
                      ),
                    }));
                    console.log(body);
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
                  onChange={(value, option: any) => {
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
                  disabled={!body?.state}
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
                    option!.value
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
                  name="number"
                  value={body?.number}
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
        <Form layout="vertical" initialValues={PersonsData?.items[0]}>
          <Grid
            container
            columnSpacing={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.black_list")} name="black_list">
                <Select
                  size="large"
                  options={[
                    { label: t("table.true"), value: true },
                    { label: t("table.false"), value: false },
                  ]}
                  value={body?.black_list}
                  onChange={(value, option: any) => {
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
                      console.log(body);
                    }
                  }}
                  onSelect={(value, option: any) => {
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
                  onChange={(value, option: any) => {
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
                  onChange={(value, option: any) => {
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
                  onChange={(value, option: any) => {
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
                label={t("table.cash_in_max_value")}
                name="cash_in_max_value"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  name="cash_in_max_value"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonBefore="R$"
                  value={body?.cash_in_max_value}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      cash_in_max_value: e,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item
                label={t("table.cash_out_max_value")}
                name="cash_out_max_value"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  name="cash_out_max_value"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonBefore="R$"
                  value={body?.cash_out_max_value}
                  onChange={(e) => {
                    console.log(e);

                    setBody((state) => ({
                      ...state,
                      cash_out_max_value: e,
                    }));
                  }}
                />
              </Form.Item>
            </Grid>

            <Grid item xs={12} md={4} lg={2}>
              <Form.Item
                label={t("table.cash_out_transaction_limit")}
                name="cash_out_transaction_limit"
              >
                <Select
                  size="large"
                  options={[
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                    { label: 2, value: 2 },
                    { label: 3, value: 3 },
                    { label: 4, value: 4 },
                    { label: 5, value: 5 },
                  ]}
                  value={body?.cash_out_transaction_limit}
                  onChange={(value, option: any) => {
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
        <Grid container spacing={1}>
          <Grid xs={12} item>
            <Dragger
              listType="picture"
              accept=".png,.pdf,.docx"
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
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t("messages.upload_label")}</p>
              <p className="ant-upload-hint">
                {t("messages.upload_description")}
              </p>
            </Dragger>
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
  ];

  return (
    <Grid
      container
      style={{
        padding: "25px",
        display: "flex",
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