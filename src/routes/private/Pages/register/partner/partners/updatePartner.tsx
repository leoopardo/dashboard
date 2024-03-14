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
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useDeletePartnerAttachment } from "@src/services/register/partner/attachments/deleteAttachment";
import { useGetPartnerAttachments } from "@src/services/register/partner/attachments/getAttachments";
import {
  CreatePartnerFileInterface,
  useCreatePartnerAttachment,
} from "@src/services/register/partner/attachments/uploadAttachment";
import { useCreatePartnerResponsible } from "@src/services/register/partner/responsibles/createResponsible";
import { useDeletePartnerResponsible } from "@src/services/register/partner/responsibles/deleteResponsible";
import { useGetPartnerResponsibles } from "@src/services/register/partner/responsibles/getResponsibles";
import { useUpdatePartnerResponsible } from "@src/services/register/partner/responsibles/updateResponsible";
import { useUpdatePartner } from "@src/services/register/partner/updatePartner";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { PartnerItem } from "@src/services/types/register/partners/partners.interface";
import {
  PartnerResponsiblesBody,
  PartnerResponsiblesItem,
  PartnerResponsiblesQuery,
  PartnerResponsiblesUpdateBody,
} from "@src/services/types/register/partners/responsibles/responsibles.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
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
  Upload,
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useLocation, useNavigate } from "react-router-dom";
import { setFirstChildDivId, validateFormCnpj } from "@src/utils/functions";
import { motion } from "framer-motion";

export const UpdatePartner = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const location = useLocation();
  const tabindex0 = document.querySelector('[data-node-key="1"]');
  const tabindex1 = document.querySelector('[data-node-key="2"]');
  const tabindex2 = document.querySelector('[data-node-key="3"]');
  const navigate = useNavigate();
  const [partnerBody, setPartnerBody] = useState<PartnerItem>({
    partner_id: location?.state?.id,
    name: location?.state?.name,
    cnpj: location?.state?.cnpj,
    cellphone: location?.state?.cellphone,
    email: location?.state?.email,
    country: location?.state?.country,
  });
  const INITIAL_RESPONSIBLE_QUERY: PartnerResponsiblesQuery = {
    partner_id: location.state.id,
    limit: 25,
    page: 1,
  };

  const submitRef = useRef<HTMLButtonElement>(null);

  const { Countries } = useGetrefetchCountries();

  const formRef = useRef<FormInstance>(null);
  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdatePartner(partnerBody);

  const [responsibleQuery, setResponsibleQuery] =
    useState<PartnerResponsiblesQuery>(INITIAL_RESPONSIBLE_QUERY);
  const [currentResponsible, setCurrentResponsible] =
    useState<PartnerResponsiblesItem | null>(null);
  const [isResponsibleFiltersOpen, setIsResponsibleFiltersOpen] =
    useState<boolean>(false);
  const [isCreateResponsibleOpen, setIsCreateResponsibleOpen] =
    useState<boolean>(false);
  const [isUpdateResponsibleOpen, setIsUpdateResponsibleOpen] =
    useState<boolean>(false);
  const [isDeleteResponsibleOpen, setIsDeleteResponsibleOpen] =
    useState<boolean>(false);
  const [createResponsibleBody, setCreateResponsibleBody] =
    useState<PartnerResponsiblesBody>({});
  const [updateResponsibleBody, setUpdateResponsibleBody] =
    useState<PartnerResponsiblesUpdateBody>({});
  const [fileBody, setFileBody] = useState<
    CreatePartnerFileInterface | undefined
  >({
    partner_id: location.state.id,
  });
  const [deleteFileId, setDeleteFileId] = useState<string>("");

  const {
    ResponsiblesData,
    ResponsiblesDataError,
    isResponsiblesDataFetching,
    refetchResponsiblesData,
  } = useGetPartnerResponsibles(responsibleQuery);

  const {
    PartnerResponsibleError,
    PartnerResponsibleIsLoading,
    PartnerResponsibleIsSuccess,
    PartnerResponsibleMutate,
  } = useCreatePartnerResponsible({
    ...createResponsibleBody,
    partner_id: location.state.id,
  });
  const {
    UpdatePartnerResponsibleError,
    UpdatePartnerResponsibleIsLoading,
    UpdatePartnerResponsibleIsSuccess,
    UpdatePartnerResponsibleMutate,
  } = useUpdatePartnerResponsible({
    ...updateResponsibleBody,
    partner_id: location.state.id,
  });
  const {
    DeletePartnerResponsibleMutate,
    DeletePartnerResponsibleIsLoading,
    DeletePartnerResponsibleError,
    DeletePartnerResponsibleIsSuccess,
  } = useDeletePartnerResponsible({
    partner_responsible_id: currentResponsible?.id,
  });

  const { PartnerAttachmentsData } = useGetPartnerAttachments({
    partner_id: location.state.id,
  });
  const {
    PartnerAttachmentError,
    PartnerAttachmentIsLoading,
    PartnerAttachmentIsSuccess,
    PartnerAttachmentMutate,
  } = useCreatePartnerAttachment(fileBody);

  const {
    DeletePartnerAttachmentMutate,
    DeletePartnerAttachmentError,
    DeletePartnerAttachmentIsSuccess,
  } = useDeletePartnerAttachment(deleteFileId);

  const handleChangePartner = (event: any) => {
    setPartnerBody((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (fileBody?.base64_file) {
      PartnerAttachmentMutate();
      setFileBody({ base64_file: "", file_name: "" });
    }
  }, [fileBody]);

  useEffect(() => {
    if (deleteFileId) {
      DeletePartnerAttachmentMutate();
      setDeleteFileId("");
    }
  }, [deleteFileId]);

  useEffect(() => {
    setFirstChildDivId(tabindex0, "tab-partner-data");
    setFirstChildDivId(tabindex1, "tab-responsibles");
    setFirstChildDivId(tabindex2, "tab-attachments");
  }, [tabindex0, tabindex1, tabindex2]);

  useEffect(() => {
    if (UpdateIsSuccess) {
      navigate("/register/partner/partners/update", {
        state: { ...location.state, ...partnerBody },
      });
    }
  }, [UpdateIsSuccess]);

  const items: TabsProps["items"] | any = [
    {
      key: "1",
      label: t("table.partner_data"),
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
                  value={partnerBody?.name}
                  onChange={handleChangePartner}
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
                    required: false,
                    message:
                      t("input.required", {
                        field: t(`input.cnpj`),
                      }) || "",
                  },
                ]}
              >
                <ReactInputMask
                  value={partnerBody?.cnpj}
                  mask="99.999.999/9999-99"
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d]/g, "");
                    if (!value) {
                      delete partnerBody?.cnpj;
                      return;
                    }
                    setPartnerBody((state: any) => ({
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
                <CellphoneInput body={partnerBody} setBody={setPartnerBody} />
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
                  value={partnerBody?.email}
                  onChange={handleChangePartner}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item label={t("table.country")} name="country">
                <AutoComplete
                  options={Countries?.map((country) => {
                    return {
                      label: (
                        <Typography>
                          <Avatar src={country.flags.svg} />
                          {country?.name.common}
                        </Typography>
                      ),
                      value: country?.name.common,
                    };
                  })}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  size="large"
                  value={partnerBody?.country}
                  onChange={(value) =>
                    setPartnerBody((state) => ({ ...state, country: value }))
                  }
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
                  checked={partnerBody?.status}
                  onChange={(checked) => {
                    setPartnerBody((state) => ({
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
                {t("buttons.update")} {t("table.partner")}
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
    permissions.register.partner.partner.partner_responsible_list && {
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
                disabled={["partner_id"]}
                startDateKeyName="start_date"
                endDateKeyName="end_date"
                query={responsibleQuery}
                setQuery={setResponsibleQuery}
              />
            </Col>
            {permissions.register.partner.partner
              .partner_responsible_create && (
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
                permissions.register.partner.partner
                  .partner_responsible_update && {
                  label: "edit",
                  icon: <EditOutlined style={{ fontSize: "20px" }} />,
                  onClick: (item) => {
                    setUpdateResponsibleBody({
                      partner_responsible_id: item?.id,
                      cellphone: item?.cellphone,
                      name: item?.name,
                      email: item?.email,
                      position: item?.position,
                    });
                    setIsUpdateResponsibleOpen(true);
                  },
                },
                permissions.register.partner.partner
                  .partner_responsible_delete && {
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
              disabled={["partner_id"]}
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
              submit={PartnerResponsibleMutate}
              submitLoading={PartnerResponsibleIsLoading}
              error={PartnerResponsibleError}
              success={PartnerResponsibleIsSuccess}
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
              submit={() => DeletePartnerResponsibleMutate()}
              loading={DeletePartnerResponsibleIsLoading}
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
              submit={UpdatePartnerResponsibleMutate}
              submitLoading={UpdatePartnerResponsibleIsLoading}
              error={UpdatePartnerResponsibleError}
              success={UpdatePartnerResponsibleIsSuccess}
            />
          )}
        </Row>
      ),
    },
    permissions.register.partner.partner.partner_files_list && {
      key: "3",
      label: t("table.attachments"),
      children: PartnerAttachmentIsLoading ? (
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
            <Upload
              style={{ maxHeight: "150px" }}
              listType="picture"
              multiple={false}
              disabled={
                !permissions.register.partner.partner.partner_files_create
              }
              onRemove={(file) => {
                setDeleteFileId(file?.uid);
              }}
              defaultFileList={PartnerAttachmentsData?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
              beforeUpload={(file) => {
                setFileBody({
                  base64_file: "",
                  file_name: "",
                  partner_id: location.state.id,
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
          </Col>

          {!PartnerAttachmentsData?.total && !fileBody?.base64_file && (
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
          {t("table.partner")}: {location.state.name}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Tabs defaultActiveKey="1" items={items} data-test-id="tab" />
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
        error={PartnerResponsibleError}
        success={PartnerResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdatePartnerResponsibleError}
        success={UpdatePartnerResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeletePartnerResponsibleError}
        success={DeletePartnerResponsibleIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.uploaded")}
        actionError={t("messages.upload")}
        error={PartnerAttachmentError}
        success={PartnerAttachmentIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeletePartnerAttachmentError}
        success={DeletePartnerAttachmentIsSuccess}
      />
    </Row>
  );
};
