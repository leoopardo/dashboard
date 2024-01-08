/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { CellphoneInput } from "@src/components/Inputs/CellphoneInput";
import { Confirmation } from "@src/components/Modals/confirmation";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { AggregatorSelect } from "@src/components/Selects/aggregatorSelect";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useDeleteOperatorAttachment } from "@src/services/register/operator/attachments/deleteAttachment";
import { useGetOperatorAttachments } from "@src/services/register/operator/attachments/getAttachments";
import {
  CreateOperatorFileInterface,
  useCreateOperatorAttachment,
} from "@src/services/register/operator/attachments/uploadAttachment";
import { useCreateOperatorResponsible } from "@src/services/register/operator/responsibles/createResponsible";
import { useDeleteOperatorResponsible } from "@src/services/register/operator/responsibles/deleteResponsible";
import { useGetOperatorResponsibles } from "@src/services/register/operator/responsibles/getResponsibles";
import { useUpdateOperatorResponsible } from "@src/services/register/operator/responsibles/updateResponsible";
import { useUpdateOperator } from "@src/services/register/operator/updateOperator";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { OperatorItem } from "@src/services/types/register/operators/operators.interface";
import {
  OperatorResponsiblesBody,
  OperatorResponsiblesItem,
  OperatorResponsiblesQuery,
  OperatorResponsiblesUpdateBody,
} from "@src/services/types/register/operators/responsibles/responsibles.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { setFirstChildDivId, validateFormCnpj } from "@src/utils/functions";
import {
  Avatar,
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { FormInstance } from "antd/lib/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useLocation } from "react-router-dom";

export const UpdateOperator = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const location = useLocation();
  const [OperatorBody, setOperatorBody] = useState<OperatorItem>({
    operator_id: location.state.id,
    name: location.state.name,
    cnpj: location.state.cnpj,
    cellphone: location.state.cellphone,
    email: location.state.email,
    country: location.state.country,
  });
  const INITIAL_RESPONSIBLE_QUERY: OperatorResponsiblesQuery = {
    operator_id: location.state.id,
    limit: 25,
    page: 1,
  };

  const submitRef = useRef<HTMLButtonElement>(null);
  const { Countries } = useGetrefetchCountries();
  const formRef = useRef<FormInstance>(null);

  const tabOperatorsData = document.querySelector('[data-node-key="1"]');
  const tabResponsible = document.querySelector('[data-node-key="2"]');
  const tabAttachments = document.querySelector('[data-node-key="3"]');

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdateOperator({ ...OperatorBody, operator_id: location.state.id });

  const [responsibleQuery, setResponsibleQuery] =
    useState<OperatorResponsiblesQuery>(INITIAL_RESPONSIBLE_QUERY);
  const [currentResponsible, setCurrentResponsible] =
    useState<OperatorResponsiblesItem | null>(null);
  const [isResponsibleFiltersOpen, setIsResponsibleFiltersOpen] =
    useState<boolean>(false);
  const [isCreateResponsibleOpen, setIsCreateResponsibleOpen] =
    useState<boolean>(false);
  const [isUpdateResponsibleOpen, setIsUpdateResponsibleOpen] =
    useState<boolean>(false);
  const [isDeleteResponsibleOpen, setIsDeleteResponsibleOpen] =
    useState<boolean>(false);
  const [createResponsibleBody, setCreateResponsibleBody] =
    useState<OperatorResponsiblesBody>({});
  const [updateResponsibleBody, setUpdateResponsibleBody] =
    useState<OperatorResponsiblesUpdateBody>({});
  const [fileBody, setFileBody] = useState<
    CreateOperatorFileInterface | undefined
  >({
    operator_id: location.state.id,
  });
  const [deleteFileId, setDeleteFileId] = useState<string>("");

  const {
    ResponsiblesData,
    ResponsiblesDataError,
    isResponsiblesDataFetching,
    refetchResponsiblesData,
  } = useGetOperatorResponsibles(responsibleQuery);

  const {
    OperatorResponsibleError,
    OperatorResponsibleIsLoading,
    OperatorResponsibleIsSuccess,
    OperatorResponsibleMutate,
  } = useCreateOperatorResponsible({
    ...createResponsibleBody,
    operator_id: location.state.id,
  });
  const {
    UpdateOperatorResponsibleError,
    UpdateOperatorResponsibleIsLoading,
    UpdateOperatorResponsibleIsSuccess,
    UpdateOperatorResponsibleMutate,
  } = useUpdateOperatorResponsible({
    ...updateResponsibleBody,
    operator_id: location.state.id,
  });
  const {
    DeleteOperatorResponsibleMutate,
    DeleteOperatorResponsibleIsLoading,
    DeleteOperatorResponsibleError,
    DeleteOperatorResponsibleIsSuccess,
  } = useDeleteOperatorResponsible({
    operator_responsible_id: currentResponsible?.id,
  });

  const { OperatorAttachmentsData } = useGetOperatorAttachments({
    operator_id: location.state.id,
  });
  const {
    OperatorAttachmentError,
    OperatorAttachmentIsLoading,
    OperatorAttachmentIsSuccess,
    OperatorAttachmentMutate,
  } = useCreateOperatorAttachment(fileBody);

  const {
    DeleteOperatorAttachmentMutate,
    DeleteOperatorAttachmentError,
    DeleteOperatorAttachmentIsSuccess,
  } = useDeleteOperatorAttachment(deleteFileId);

  const handleChangeOperator = (event: any) => {
    setOperatorBody((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (fileBody?.base64_file) {
      OperatorAttachmentMutate();
      setFileBody({ base64_file: "", file_name: "" });
    }
  }, [fileBody]);

  useEffect(() => {
    if (deleteFileId) {
      DeleteOperatorAttachmentMutate();
      setDeleteFileId("");
    }
  }, [deleteFileId]);

  useEffect(() => {
    setFirstChildDivId(tabOperatorsData, "tab-operators-data");
    setFirstChildDivId(tabResponsible, "tab-responsibles");
    setFirstChildDivId(tabAttachments, "tab-attachments");
  }, [tabOperatorsData, tabResponsible, tabAttachments]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.operator_data"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={location.state}
          onFinish={() => UpdateMutate()}
        >
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", {
                        field: t(`input.name`),
                      }) || "",
                  },
                ]}
              >
                <Input
                  name="name"
                  size="large"
                  value={OperatorBody?.name}
                  onChange={handleChangeOperator}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.cnpj")}
                name="cnpj"
                rules={[
                  {
                    validator: validateFormCnpj,
                  },
                  {
                    required: true,
                    message:
                      t("input.required", {
                        field: t(`input.cnpj`),
                      }) || "",
                  },
                ]}
              >
                <ReactInputMask
                  value={OperatorBody?.cnpj}
                  mask="99.999.999/9999-99"
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d]/g, "");
                    if (!value) {
                      delete OperatorBody?.cnpj;
                      return;
                    }
                    setOperatorBody((state: any) => ({
                      ...state,
                      cnpj: value,
                    }));
                  }}
                >
                  <Input size="large" />
                </ReactInputMask>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.cellphone")} name="name">
                <CellphoneInput
                  body={OperatorBody ?? location?.state?.cellphone}
                  setBody={setOperatorBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.email")}
                name="email"
                rules={[
                  {
                    type: "email",
                    message:
                      t("input.invalid", {
                        field: t("input.email"),
                      }) || "",
                  },
                ]}
              >
                <Input
                  name="email"
                  size="large"
                  value={OperatorBody?.email}
                  onChange={handleChangeOperator}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.country")} name="country">
                <Select
                  showSearch
                  options={Countries?.map((country, index) => {
                    return {
                      key: index,
                      label: (
                        <Typography>
                          <Avatar
                            src={country.flags.svg}
                            style={{ marginRight: 10 }}
                          />
                          {country?.name.common}
                        </Typography>
                      ),
                      value: country.name.common,
                    };
                  })}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  size="large"
                  value={OperatorBody?.country}
                  onChange={(value) =>
                    setOperatorBody((state) => ({ ...state, country: value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.aggregator")} name="aggregator_id">
                <AggregatorSelect
                  aggregatorId={
                    OperatorBody.aggregator_id ?? location?.state?.aggregator_id
                  }
                  setQueryFunction={setOperatorBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 2 }}>
              <Form.Item
                label={t("table.status")}
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checked={OperatorBody?.status}
                  onChange={(checked) => {
                    setOperatorBody((state) => ({
                      ...state,
                      status: checked,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              width: "100%",
            }}
          >
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Button
                size="large"
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={() => submitRef.current?.click()}
                loading={UpdateIsLoading}
              >
                {t("buttons.update")} {t("table.operator")}
              </Button>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <button type="submit" ref={submitRef} style={{ display: "none" }}>
              Submit
            </button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: t("table.responsibles"),
      children: (
        <Row gutter={[8, 16]} style={{ width: "100%" }}>
          <Row style={{ width: "100%" }} gutter={[8, 2]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Button
                size="large"
                style={{ width: "100%" }}
                loading={isResponsiblesDataFetching}
                type="primary"
                onClick={() => setIsResponsibleFiltersOpen(true)}
              >
                {t("table.filters")}
              </Button>
            </Col>{" "}
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 15 }}>
              <FilterChips
                disabled={["operator_id"]}
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={responsibleQuery}
                setQuery={setResponsibleQuery}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 5 }}>
              <Button
                size="large"
                style={{ width: "100%" }}
                loading={isResponsiblesDataFetching}
                type="dashed"
                onClick={() => setIsCreateResponsibleOpen(true)}
              >
                <PlusOutlined />
                {`${t("buttons.create")} ${t("buttons.responsible")}`}
              </Button>
            </Col>{" "}
          </Row>

          <Col span={24}>
            <CustomTable
              query={responsibleQuery}
              setCurrentItem={setCurrentResponsible}
              setQuery={setResponsibleQuery}
              actions={[
                permissions.register.operator.operator.operator_update && {
                  label: "edit",
                  icon: <EditOutlined style={{ fontSize: "20px" }} />,
                  onClick: (item) => {
                    setUpdateResponsibleBody({
                      operator_responsible_id: item?.id,
                      cellphone: item?.cellphone,
                      name: item?.name,
                      email: item?.email,
                      position: item?.position,
                    });
                    setIsUpdateResponsibleOpen(true);
                  },
                },
                permissions.register.operator.operator.operator_update && {
                  label: "delete",
                  icon: <DeleteOutlined style={{ fontSize: "20px" }} />,
                  onClick: () => {
                    setIsDeleteResponsibleOpen(true);
                  },
                },
              ]}
              data={ResponsiblesData}
              items={ResponsiblesData?.items}
              error={ResponsiblesDataError}
              columns={[
                { name: "name", type: "text" },
                { name: "email", type: "text" },
                { name: "cellphone", type: "text" },
                { name: "position", type: "text" },
                { name: "created_at", type: "date" },
              ]}
              loading={isResponsiblesDataFetching}
              label={["name", "position"]}
            />
          </Col>

          {isResponsibleFiltersOpen && (
            <FiltersModal
              open={isResponsibleFiltersOpen}
              setOpen={setIsResponsibleFiltersOpen}
              query={responsibleQuery}
              setQuery={setResponsibleQuery}
              filters={["start_date", "end_date"]}
              refetch={refetchResponsiblesData}
              selectOptions={{}}
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              initialQuery={INITIAL_RESPONSIBLE_QUERY}
              disabled={["operator_id"]}
            />
          )}

          {isCreateResponsibleOpen && (
            <MutateModal
              type="create"
              open={isCreateResponsibleOpen}
              setOpen={setIsCreateResponsibleOpen}
              fields={[
                { label: "name", required: true },
                { label: "cellphone", required: false },
                { label: "email", required: false },
                { label: "position", required: true },
              ]}
              body={createResponsibleBody}
              setBody={setCreateResponsibleBody}
              modalName={t("modal.new_responsible")}
              submit={OperatorResponsibleMutate}
              submitLoading={OperatorResponsibleIsLoading}
              error={OperatorResponsibleError}
              success={OperatorResponsibleIsSuccess}
              submitText={`${t("buttons.create")}`}
            />
          )}

          {isDeleteResponsibleOpen && (
            <Confirmation
              open={isDeleteResponsibleOpen}
              setOpen={setIsDeleteResponsibleOpen}
              title={t("messages.confirm_action_title", {
                action: t("messages.delete"),
              })}
              description={`${t("messages.are_you_sure", {
                action: t("messages.delete").toLocaleLowerCase(),
                itens: currentResponsible?.name,
              })}`}
              submit={() => DeleteOperatorResponsibleMutate()}
              loading={DeleteOperatorResponsibleIsLoading}
            />
          )}

          {isUpdateResponsibleOpen && (
            <MutateModal
              type="update"
              open={isUpdateResponsibleOpen}
              setOpen={setIsUpdateResponsibleOpen}
              fields={[
                { label: "name", required: true },
                { label: "cellphone", required: false },
                { label: "email", required: false },
                { label: "position", required: true },
              ]}
              body={updateResponsibleBody}
              setBody={setUpdateResponsibleBody}
              modalName={t("modal.update_responsible")}
              submit={UpdateOperatorResponsibleMutate}
              submitLoading={UpdateOperatorResponsibleIsLoading}
              error={UpdateOperatorResponsibleError}
              success={UpdateOperatorResponsibleIsSuccess}
            />
          )}
        </Row>
      ),
    },
    {
      key: "3",
      label: t("table.attachments"),
      children: OperatorAttachmentIsLoading ? (
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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Dragger
              style={{ maxHeight: "150px" }}
              listType="picture"
              multiple={false}
              onRemove={(file) => {
                setDeleteFileId(file?.uid);
              }}
              defaultFileList={OperatorAttachmentsData?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
              height={1000}
              beforeUpload={(file) => {
                setFileBody({
                  base64_file: "",
                  file_name: "",
                  operator_id: location.state.id,
                });
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
              <Typography className="ant-upload-drag-icon">
                <InboxOutlined />
              </Typography>
              <Typography className="ant-upload-text">
                {t("messages.upload_label")}
              </Typography>
              <Typography className="ant-upload-hint">
                {t("messages.upload_description")}
              </Typography>
            </Dragger>
          </Col>

          {!OperatorAttachmentsData?.total && !fileBody?.base64_file && (
            <Col span={24}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("error.400")}
              />
            </Col>
          )}
        </Row>
      ),
    },
  ];
  return (
    <Row style={{ padding: 25 }}>
      <Col span={24}>
        <Typography.Title level={4}>
          {t("table.operator")}: {location.state.name}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} />
      </Col>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={OperatorResponsibleError}
        success={OperatorResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateOperatorResponsibleError}
        success={UpdateOperatorResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteOperatorResponsibleError}
        success={DeleteOperatorResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.uploaded")}
        actionError={t("messages.upload")}
        error={OperatorAttachmentError}
        success={OperatorAttachmentIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteOperatorAttachmentError}
        success={DeleteOperatorAttachmentIsSuccess}
      />
    </Row>
  );
};
