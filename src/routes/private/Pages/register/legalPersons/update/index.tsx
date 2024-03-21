/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InboxOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { CreateFileInterface } from "@src/services/register/aggregator/attachments/uploadAttachment";
import { useDeleteLegalPersonFile } from "@src/services/register/legalPersons/files/deleteFile";
import { useGetLegalPersonFiles } from "@src/services/register/legalPersons/files/getFiles";
import { useUploadLegalPersonFile } from "@src/services/register/legalPersons/files/uploadFile";
import { useGetLegalPersonsByCnpj } from "@src/services/register/legalPersons/getPersonsByCnpj";
import { useUpdateLegalPerson } from "@src/services/register/legalPersons/updatePerson";
import { useGetBlacklistReasons } from "@src/services/register/persons/persons/getPersonBlacklistReasons";
import { useGetPersons } from "@src/services/register/persons/persons/getPersons";
import { useGetCities } from "@src/services/states_cities/getCities";
import { useGetStates } from "@src/services/states_cities/getStates";
import { LegalPersonsItem } from "@src/services/types/register/legalPersons/persons.interface";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { setFirstChildDivId } from "@src/utils/functions";
import {
  AutoComplete,
  Button,
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
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useParams } from "react-router-dom";

// const INITIAL_QUERY: PersonsQuery = {
//   limit: 25,
//   page: 1,
//   sort_field: "created_at",
//   sort_order: "DESC",
// };

export const LegalPersonUpdate = () => {
  const { t } = useTranslation();
  const { cnpj } = useParams();
  // const currentData = useLocation()?.state;
  const [body, setBody] = useState<LegalPersonsItem | null | undefined>(
    undefined
  );
  //  const [currentObj, setCurrentObj] = useState<any | undefined>(undefined);
  const [currState, setCurrState] = useState<string | undefined>("");
  const [fileBody, setFileBody] = useState<CreateFileInterface | undefined>(
    undefined
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  // const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  // const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

  const [query] = useState<PersonsQuery>({
    limit: 25,
    page: 1,
    sort_field: "created_at",
    sort_order: "DESC",
    cpf: cnpj,
  });
  const { states } = useGetStates();
  const { cities, refetchCities } = useGetCities(currState);
  const { PersonsData, isPersonsDataFetching } = useGetPersons(query);
  const { BlacklistReasons } = useGetBlacklistReasons({ limit: 200, page: 1 });

  const { LegalPersonsByCnpjData, isLegalPersonsByCnpjDataFetching } =
    useGetLegalPersonsByCnpj(cnpj);

  // const {
  //   PersonsHistoryData,
  //   PersonsHistoryDataError,
  //   isPersonsHistoryDataFetching,
  //   refetchHistoryPersonsData,
  // } = useGetPersonHistory({ ...query, cpf: undefined }, cnpj);

  // const { refetchHistoryPersonsDetailsData } = useGetPersonHistoryDetails(
  //   { ...query, cpf: undefined },
  //   cnpj,
  //   currentObj?._id
  // );

  const { UpdateMutate, UpdateError, UpdateIsLoading, UpdateIsSuccess } =
    useUpdateLegalPerson(
      {
        ...body,
      },
      cnpj
    );

  const { Files, isFilesFetching, refetchFiles } = useGetLegalPersonFiles(cnpj);
  const { DeleteFileError, DeleteFileIsSuccess, DeleteFileMutate } =
    useDeleteLegalPersonFile(cnpj, deleteFileId);

  const { FileError, FileIsSuccess, FileMutate } = useUploadLegalPersonFile(
    fileBody,
    cnpj
  );

  // const columns: ColumnInterface[] = [
  //   { name: "_id", type: "id" },
  //   { name: "cpf", type: "document" },
  //   { name: "user_name", type: "text" },
  //   { name: "step", type: "translate" },
  //   { name: "createdAt", type: "date" },
  // ];

  const onChangeConfigs = (event: any) => {
    const { value } = event.target;
    setBody((state) => ({ ...state, [event.target.name]: value }));
  };

  useEffect(() => {
    refetchFiles();
    setCurrState(LegalPersonsByCnpjData?.address_state);
  }, [PersonsData]);

  // useEffect(() => {
  //   refetchHistoryPersonsData();
  // }, [query]);

  // useEffect(() => {
  //   if (currentObj && isViewOpen) {
  //     refetchHistoryPersonsDetailsData();
  //   }
  // }, [isViewOpen]);

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
    setBody(LegalPersonsByCnpjData);
  }, [PersonsData]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.general_data"),
      children: isLegalPersonsByCnpjDataFetching ? (
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
          initialValues={LegalPersonsByCnpjData || {}}
          onFinish={() => {
            UpdateMutate();
            setIsConfirmOpen(false);
          }}
        >
          <Grid container columnSpacing={1}>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.trade_name")} name="trade_name">
                <Input
                  size="large"
                  name="trade_name"
                  value={body?.trade_name}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>

            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.state")} name="address_state">
                <AutoComplete
                  size="large"
                  style={{ width: "100%", height: "40px" }}
                  placeholder={t(`table.state`)}
                  value={body?.address_state}
                  onSelect={(value) => {
                    delete body?.address_city;
                    setBody((state: any) => ({
                      ...state,
                      address_state: value,
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
              <Form.Item label={t("table.city")} name="address_city">
                <AutoComplete
                  size="large"
                  disabled={!body?.address_state}
                  style={{ width: "100%", height: "40px" }}
                  placeholder={t(`table.city`)}
                  value={body?.address_city}
                  onSelect={(value) => {
                    setBody((state: any) => ({
                      ...state,
                      address_city: value,
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
              <Form.Item
                label={t("table.neighborhood")}
                name="address_neighborhood"
              >
                <Input
                  size="large"
                  name="address_neighborhood"
                  value={body?.address_neighborhood}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Form.Item label={t("table.street")} name="address_street">
                <Input
                  size="large"
                  name="address_street"
                  value={body?.address_city}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.number")} name="address_number">
                <Input
                  size="large"
                  name="address_number"
                  value={body?.address_number}
                  onChange={onChangeConfigs}
                />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={2}>
              <Form.Item label={t("table.zip_code")} name="address_postal_code">
                <ReactInputMask
                  mask="99999-999"
                  value={body?.address_postal_code}
                  onChange={(e) => {
                    setBody((state) => ({
                      ...state,
                      address_postal_code: e.target.value,
                    }));
                  }}
                >
                  <Input size="large" />
                </ReactInputMask>
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
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
              <Form.Item label={t("table.cellphone")} name="phone">
                <Input
                  size="large"
                  name="phone"
                  value={body?.phone}
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
                    itens: body?.business_name,
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
      children: isLegalPersonsByCnpjDataFetching ? (
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
          initialValues={LegalPersonsByCnpjData || {}}
          ref={formRefBlock}
          onFinish={() => {
            UpdateMutate();
            setIsConfirmOpen(false);
          }}
        >
          <Grid container columnSpacing={1}>
            <button
              type="submit"
              ref={submitRefBlock}
              style={{ display: "none" }}
            >
              Submit
            </button>
            <Grid item xs={12} md={4} lg={1}>
              <Form.Item label={t("table.black_list")}>
                <Select
                  size="large"

                  options={[
                    { label: t("table.true"), value: "true" },
                    { label: t("table.false"), value: "false" },
                  ]}
                  value={body?.black_list}
                  onChange={(_value, option: any) => {
                    if (!option.value) {
                      setBody((state) => ({
                        ...state,
                        black_list_reason: null,
                        black_list_description: "",
                      }));
                    }
                    setBody((state) => ({
                      ...state,
                      black_list: `${option.value}`,
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
                    required: body?.black_list == true,
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
                <Select
                  size="large"
                  allowClear
                  showSearch
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
                    { label: t("table.true"), value: "true" },
                    { label: t("table.false"), value: "false" },
                  ]}
                  value={body?.flag_pep}
                  onChange={(_value, option: any) => {
                    setBody((state) => ({ ...state, flag_pep: option.value }));
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
                    itens: body?.business_name,
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
      children: isLegalPersonsByCnpjDataFetching ? (
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
        <Form layout="vertical" initialValues={LegalPersonsByCnpjData || {}}>
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
                    itens: body?.business_name,
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
        <Grid container spacing={1}>
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
    // {
    //   key: "5",
    //   label: t("table.historic"),
    //   children: isFilesFetching ? (
    //     <div
    //       style={{
    //         height: "100%",
    //         width: "100%",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <Spin size="large" />
    //     </div>
    //   ) : (
    //     <Grid container spacing={1}>
    //       <Grid
    //         container
    //         style={{ display: "flex", alignItems: "center" }}
    //         spacing={1}
    //       >
    //         <Grid item xs={12} md={4} lg={2}>
    //           <Button
    //             size="large"
    //             style={{ width: "100%" }}
    //             loading={isPersonsDataFetching}
    //             type="primary"
    //             onClick={() => setIsFiltersOpen(true)}
    //           >
    //             {t("table.filters")}
    //           </Button>
    //         </Grid>
    //         <Grid item xs={12} md={8} lg={10}>
    //           <FilterChips initial_query={INITIAL_QUERY}
    //             startDateKeyName="initial_date"
    //             endDateKeyName="final_date"
    //             query={query}
    //             setQuery={setQuery}
    //           />
    //         </Grid>
    //       </Grid>
    //       <Grid xs={12} item>
    //         <CustomTable
    //           query={query}
    //           setCurrentItem={setCurrentObj}
    //           setQuery={setQuery}
    //           actions={[
    //             {
    //               label: "details",
    //               icon: <EyeFilled style={{ fontSize: "20px" }} />,
    //               onClick: () => setIsViewOpen(true),
    //             },
    //           ]}
    //           data={PersonsHistoryData}
    //           items={PersonsHistoryData?.items}
    //           error={PersonsHistoryDataError}
    //           columns={columns}
    //           loading={isPersonsHistoryDataFetching}
    //           label={["user_name", "step"]}
    //         />
    //       </Grid>
    //       <FiltersModal
    //         open={isFiltersOpen}
    //         setOpen={setIsFiltersOpen}
    //         query={query}
    //         setQuery={setQuery}
    //         filters={["initial_date", "final_date", "step"]}
    //         refetch={refetchHistoryPersonsData}
    //         selectOptions={{
    //           step: [
    //             "UPDATE_CPF",
    //             "CREATE_CPF",
    //             "UPDATE_FILE",
    //             "CREATE_FILE",
    //             "DELETE_FILE",
    //           ],
    //         }}
    //         startDateKeyName="initial_date"
    //         endDateKeyName="final_date"
    //         initialQuery={INITIAL_QUERY}
    //       />
    //     </Grid>
    //   ),
    // },
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
