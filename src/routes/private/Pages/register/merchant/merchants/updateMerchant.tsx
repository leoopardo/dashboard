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
import { OperatorSelect } from "@src/components/Selects/operatorSelect";
import { PartnerSelect } from "@src/components/Selects/partnerSelect";
import { LicenseSelect } from "@src/components/Selects/licenseSelect";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useDeleteMerchantAttachment } from "@src/services/register/merchant/attachments/deleteAttachment";
import { useGetMerchantAttachments } from "@src/services/register/merchant/attachments/getAttachments";
import {
  CreateMerchantFileInterface,
  useCreateMerchantAttachment,
} from "@src/services/register/merchant/attachments/uploadAttachment";
import { useUpdateMerchant } from "@src/services/register/merchant/merchant/updateMerchant";
import { useCreateMerchantResponsible } from "@src/services/register/merchant/responsibles/createResponsible";
import { useDeleteMerchantResponsible } from "@src/services/register/merchant/responsibles/deleteResponsible";
import { useGetMerchantResponsibles } from "@src/services/register/merchant/responsibles/getResponsibles";
import { useUpdateMerchantResponsible } from "@src/services/register/merchant/responsibles/updateResponsible";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { MerchantsItem } from "@src/services/types/register/merchants/merchantsRegister.interface";
import {
  MerchantResponsiblesBody,
  MerchantResponsiblesItem,
  MerchantResponsiblesQuery,
  MerchantResponsiblesUpdateBody,
} from "@src/services/types/register/merchants/responsibles/responsibles.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { setFirstChildDivId } from "@src/utils/functions";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
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
import { useLocation, useNavigate } from "react-router-dom";
import { useGetMerchantById } from "@src/services/register/merchant/merchant/getMerchant";

export const UpdateMerchant = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [merchantBody, setMerchantBody] = useState<MerchantsItem | undefined>({
    ...location.state,
  });
  const INITIAL_RESPONSIBLE_QUERY: MerchantResponsiblesQuery = {
    merchant_id: location.state.id,
    limit: 25,
    page: 1,
  };

  const submitRef = useRef<HTMLButtonElement>(null);
  const { Countries } = useGetrefetchCountries();
  const formRef = useRef<FormInstance>(null);

  const tabMerchantsData = document.querySelector('[data-node-key="1"]');
  const tabResponsible = document.querySelector('[data-node-key="2"]');
  const tabAttachments = document.querySelector('[data-node-key="3"]');

  const {
    UpdateError,
    UpdateIsLoading,
    UpdateMutate,
    UpdateIsSuccess,
    UpdateReset,
  } = useUpdateMerchant({
    ...merchantBody,
    v3_id: Number(merchantBody?.v3_id) ?? undefined,
    merchant_id: location.state.id,
    aggregator_id: merchantBody?.aggregator_id ?? null,
    operator_id: merchantBody?.operator_id ?? null,
  });

  const [responsibleQuery, setResponsibleQuery] =
    useState<MerchantResponsiblesQuery>(INITIAL_RESPONSIBLE_QUERY);
  const [currentResponsible, setCurrentResponsible] =
    useState<MerchantResponsiblesItem | null>(null);
  const [isResponsibleFiltersOpen, setIsResponsibleFiltersOpen] =
    useState<boolean>(false);
  const [isCreateResponsibleOpen, setIsCreateResponsibleOpen] =
    useState<boolean>(false);
  const [isUpdateResponsibleOpen, setIsUpdateResponsibleOpen] =
    useState<boolean>(false);
  const [isDeleteResponsibleOpen, setIsDeleteResponsibleOpen] =
    useState<boolean>(false);
  const [createResponsibleBody, setCreateResponsibleBody] =
    useState<MerchantResponsiblesBody>({});
  const [updateResponsibleBody, setUpdateResponsibleBody] =
    useState<MerchantResponsiblesUpdateBody>({});
  const [fileBody, setFileBody] = useState<
    CreateMerchantFileInterface | undefined
  >({
    merchant_id: location.state.id,
  });
  const [deleteFileId, setDeleteFileId] = useState<string>("");

  const { MerchantByIdData } = useGetMerchantById(location.state.id);
  const {
    ResponsiblesData,
    ResponsiblesDataError,
    isResponsiblesDataFetching,
    refetchResponsiblesData,
  } = useGetMerchantResponsibles(responsibleQuery);

  const {
    MerchantResponsibleError,
    MerchantResponsibleIsLoading,
    MerchantResponsibleIsSuccess,
    MerchantResponsibleMutate,
  } = useCreateMerchantResponsible({
    ...createResponsibleBody,
    merchant_id: location.state.id,
  });
  const {
    UpdateMerchantResponsibleError,
    UpdateMerchantResponsibleIsLoading,
    UpdateMerchantResponsibleIsSuccess,
    UpdateMerchantResponsibleMutate,
  } = useUpdateMerchantResponsible({
    ...updateResponsibleBody,
    merchant_id: location.state.id,
  });
  const {
    DeleteMerchantResponsibleMutate,
    DeleteMerchantResponsibleIsLoading,
    DeleteMerchantResponsibleError,
    DeleteMerchantResponsibleIsSuccess,
  } = useDeleteMerchantResponsible({
    merchant_responsible_id: currentResponsible?.id,
  });

  const { MerchantAttachmentsData } = useGetMerchantAttachments({
    merchant_id: location.state.id,
  });
  const {
    MerchantAttachmentError,
    MerchantAttachmentIsLoading,
    MerchantAttachmentIsSuccess,
    MerchantAttachmentMutate,
  } = useCreateMerchantAttachment(fileBody);

  const {
    DeleteMerchantAttachmentMutate,
    DeleteMerchantAttachmentError,
    DeleteMerchantAttachmentIsSuccess,
  } = useDeleteMerchantAttachment(deleteFileId);

  const handleChangeMerchant = (event: any) => {
    setMerchantBody((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (fileBody?.base64_file) {
      MerchantAttachmentMutate();
      setFileBody({ base64_file: "", file_name: "" });
    }
  }, [fileBody]);

  useEffect(() => {
    if (deleteFileId) {
      DeleteMerchantAttachmentMutate();
      setDeleteFileId("");
    }
  }, [deleteFileId]);

  useEffect(() => {
    const currentMerchant = MerchantByIdData;
    setMerchantBody({
      merchant_id: currentMerchant?.id,
      name: currentMerchant?.name,
      cnpj: currentMerchant?.cnpj ?? undefined,
      cellphone: currentMerchant?.cellphone ?? undefined,
      email: currentMerchant?.email ?? undefined,
      v3_id:
        currentMerchant?.v3_id !== 0
          ? Number(currentMerchant?.v3_id)
          : undefined,
      partner_id: currentMerchant?.partner?.id,
      aggregator_id: currentMerchant?.aggregator?.id,
      operator_id: currentMerchant?.operator?.id,
      license_id: Array.isArray(currentMerchant?.licenses)
        ? currentMerchant?.licenses[0]?.id
        : undefined,
      country: currentMerchant?.country ?? undefined,
    });

    formRef.current?.setFieldsValue(currentMerchant);
  }, [MerchantByIdData]);

  useEffect(() => {
    setFirstChildDivId(tabMerchantsData, "tab-merchants-data");
    setFirstChildDivId(tabResponsible, "tab-responsibles");
    setFirstChildDivId(tabAttachments, "tab-attachments");
  }, [tabMerchantsData, tabResponsible, tabAttachments]);

  useEffect(() => {
    if (UpdateIsSuccess) {
      navigate("/register/merchant/merchants/update", {
        state: { ...location.state, ...merchantBody },
      });
    }
  }, [UpdateIsSuccess]);

  const items: TabsProps["items"] | any = [
    {
      key: "1",
      label: t("table.merchant_data"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={merchantBody}
          onFinish={() => UpdateMutate()}
        >
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Form.Item
                label={t("table.status")}
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checked={merchantBody?.status}
                  onChange={(checked) => {
                    setMerchantBody((state) => ({
                      ...state,
                      status: checked,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
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
                  value={merchantBody?.name}
                  onChange={handleChangeMerchant}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("table.domain")}
                name="domain"
                rules={[
                  {
                    required: true,
                    message:
                      t("input.required", {
                        field: t(`input.domain`),
                      }) || "",
                  },
                ]}
              >
                <Input
                  name="domain"
                  size="large"
                  value={merchantBody?.domain}
                  onChange={handleChangeMerchant}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("table.cnpj")}
                name="cnpj"
                rules={[
                  {
                    required: false,
                    message:
                      t("input.required", {
                        field: t(`input.cnpj`),
                      }) || "",
                  },
                ]}
              >
                <ReactInputMask
                  value={merchantBody?.cnpj}
                  mask="99.999.999/9999-99"
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d]/g, "");
                    if (!value) {
                      delete merchantBody?.cnpj;
                      return;
                    }
                    setMerchantBody((state: any) => ({
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
              <Form.Item label={t("table.cellphone")} name="cellphone">
                <CellphoneInput body={merchantBody} setBody={setMerchantBody} />
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
                  value={merchantBody?.email || ""}
                  onChange={handleChangeMerchant}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.country")} name="country">
                <AutoComplete
                  options={Countries?.map((country) => {
                    return {
                      label: (
                        <Typography>
                          <Avatar src={country.flags.svg} />
                          {country.name.common}
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
                  value={merchantBody?.country}
                  onChange={(value) =>
                    setMerchantBody((state) => ({ ...state, country: value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.v3_id")} name="v3_id">
                <Input
                  style={{ width: "100%" }}
                  type="number"
                  name="v3_id"
                  size="large"
                  value={merchantBody?.v3_id}
                  onChange={handleChangeMerchant}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.license")} name="license_id">
                <LicenseSelect
                  queryOptions={merchantBody}
                  setQueryFunction={setMerchantBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.partner")} name="partner_id">
                <PartnerSelect
                  queryOptions={merchantBody}
                  setQueryFunction={setMerchantBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.aggregator")} name="aggregator_id">
                <AggregatorSelect
                  aggregatorId={merchantBody?.aggregator_id}
                  setQueryFunction={setMerchantBody}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item label={t("table.operator")} name="operator_id">
                <OperatorSelect
                  queryOptions={merchantBody}
                  setQueryFunction={setMerchantBody}
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
                {t("buttons.update")} {t("table.merchant")}
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
    permissions.register.merchant.merchant.merchant_responsible_list && {
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
                disabled={["merchant_id"]}
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={responsibleQuery}
                setQuery={setResponsibleQuery}
              />
            </Col>
            {permissions.register.merchant.merchant
              .merchant_responsible_create && (
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
              </Col>
            )}
          </Row>

          <Col span={24}>
            <CustomTable
              query={responsibleQuery}
              setCurrentItem={setCurrentResponsible}
              setQuery={setResponsibleQuery}
              actions={[
                permissions.register.merchant.merchant
                  .merchant_responsible_update && {
                  label: "edit",
                  icon: <EditOutlined style={{ fontSize: "20px" }} />,
                  onClick: (item) => {
                    UpdateReset();
                    setUpdateResponsibleBody({
                      merchant_responsible_id: item?.id,
                      cellphone: item?.cellphone,
                      name: item?.name,
                      email: item?.email,
                      position: item?.position,
                    });
                    setIsUpdateResponsibleOpen(true);
                  },
                },
                permissions.register.merchant.merchant
                  .merchant_responsible_delete && {
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
              disabled={["merchant_id"]}
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
              submit={MerchantResponsibleMutate}
              submitLoading={MerchantResponsibleIsLoading}
              error={MerchantResponsibleError}
              success={MerchantResponsibleIsSuccess}
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
              submit={() => DeleteMerchantResponsibleMutate()}
              loading={DeleteMerchantResponsibleIsLoading}
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
              submit={UpdateMerchantResponsibleMutate}
              submitLoading={UpdateMerchantResponsibleIsLoading}
              error={UpdateMerchantResponsibleError}
              success={UpdateMerchantResponsibleIsSuccess}
            />
          )}
        </Row>
      ),
    },
    permissions.register.merchant.merchant.merchant_files_list && {
      key: "3",
      label: t("table.attachments"),
      children: MerchantAttachmentIsLoading ? (
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
              disabled={
                !permissions.register.merchant.merchant.merchant_files_create
              }
              multiple={false}
              onRemove={(file) => {
                setDeleteFileId(file?.uid);
              }}
              defaultFileList={MerchantAttachmentsData?.items.map((file) => {
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
                  merchant_id: location.state.id,
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

          {!MerchantAttachmentsData?.total && !fileBody?.base64_file && (
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
          {t("table.merchant")}: {location.state.name}
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
        error={MerchantResponsibleError}
        success={MerchantResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateMerchantResponsibleError}
        success={UpdateMerchantResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteMerchantResponsibleError}
        success={DeleteMerchantResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.uploaded")}
        actionError={t("messages.upload")}
        error={MerchantAttachmentError}
        success={MerchantAttachmentIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteMerchantAttachmentError}
        success={DeleteMerchantAttachmentIsSuccess}
      />
    </Row>
  );
};
