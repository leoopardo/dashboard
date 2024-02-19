/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useTheme } from "@src/contexts/ThemeContext";
import { useActivateFasPixLogo } from "@src/services/register/merchant/merchant/merchantConfig.tsx/activateFastPixLogo";
import { useCreateFastPixLogo } from "@src/services/register/merchant/merchant/merchantConfig.tsx/createFastPixLogo";
import { useDeleteFasPixLogo } from "@src/services/register/merchant/merchant/merchantConfig.tsx/deleteFastPixLogo";
import { useGetMerchantLogos } from "@src/services/register/merchant/merchant/merchantConfig.tsx/getFastPixLogos";
import { useMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/getMerchantConfig";
import { useUpdateMerchantConfig } from "@src/services/register/merchant/merchant/merchantConfig.tsx/updateMerchantConfig";
import {
  IMerchantConfig,
  IMerchantLogoBody,
} from "@src/services/types/register/merchants/merchantConfig.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { RcFile } from "antd/es/upload";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const MerchantConfigTab = (props: { id?: string }) => {
  const { theme } = useTheme();
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { t } = useTranslation();
  const {
    merchantConfigData,
    refetchMerchantConfigData,
    isMerchantConfigFetching,
  } = useMerchantConfig(props?.id);
  const [body, setBody] = useState<IMerchantConfig | null | undefined>(
    merchantConfigData?.merchantConfig
  );

  const [bodyUpdate, setBodyUpdate] = useState<
    Partial<IMerchantConfig> | null | undefined
  >(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const cashoutLimits = [null, 1, 2, 3, 4, 5];
  const { UpdateIsSuccess, UpdateMutate, UpdateError } =
    useUpdateMerchantConfig({ merchant_id: Number(props?.id), ...bodyUpdate });

  const { merchantLogosData, isMerchantLogosFetching } = useGetMerchantLogos(
    props?.id
  );

  const [FastPixLogoBody, setFastPixLogoBody] = useState<IMerchantLogoBody>({
    merchant_id: Number(props?.id),
  });

  const [FastPixLogoToDelete, setFastPixLogoToDelete] = useState<
    string | undefined
  >(undefined);
  const [FastPixLogoToActivate, setFastPixLogoToActivate] = useState<
    string | undefined
  >(undefined);

  const { DeletePixLogoMutate, DeletePixLogoError, DeletePixLogoIsSuccess } =
    useDeleteFasPixLogo(FastPixLogoToDelete);

  const { ActivatePixLogoMutate } = useActivateFasPixLogo(
    FastPixLogoToActivate
  );
  const { CreateLogoMutate, CreateLogoError, CreateLogoIsSuccess } =
    useCreateFastPixLogo({
      ...FastPixLogoBody,
      merchant_id: Number(props?.id),
    });

  const handleSubmit = () => {
    UpdateMutate();
    setIsConfirmOpen(false);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  useEffect(() => {
    refetchMerchantConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(merchantConfigData?.merchantConfig);
  }, [merchantConfigData]);

  useEffect(() => {
    if (FastPixLogoBody.base64_file) {
      CreateLogoMutate();
      setFastPixLogoBody({ merchant_id: Number(props.id) });
    }
  }, [FastPixLogoBody]);

  useEffect(() => {
    if (FastPixLogoToDelete) {
      DeletePixLogoMutate();
      setFastPixLogoToDelete(undefined);
    }
  }, [FastPixLogoToDelete]);

  useEffect(() => {
    if (FastPixLogoToActivate) {
      ActivatePixLogoMutate();
      setFastPixLogoToActivate(undefined);
    }
  }, [FastPixLogoToActivate]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onSubmitCapture={() => handleSubmit()}
      initialValues={
        merchantConfigData ? merchantConfigData?.merchantConfig : {}
      }
    >
      <Row gutter={[8, 8]}>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <Form.Item
            label={t("input.general_deposit_permission")}
            name="cash_in_permission"
          >
            <Select
              data-test-id="general_deposit_permission"
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={body?.cash_in_permission}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_in_permission: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_in_permission: value,
                }));
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <Form.Item
            label={t("input.general_withdraw_permission")}
            name="cash_out_permission"
          >
            <Select
              data-test-id="general_withdraw_permission"
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={body?.cash_out_permission}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_out_permission: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_out_permission: value,
                }));
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <Form.Item
            label={t("input.withdraw_limit_document_by_day")}
            name="cash_out_transaction_limit"
          >
            <Select
              data-test-id="withdraw_limit_document_by_day"
              size="large"
              options={
                cashoutLimits?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: item === null ? t(`input.unlimited`) : item,
                })) ?? []
              }
              value={body?.cash_out_transaction_limit}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cash_out_transaction_limit: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cash_out_transaction_limit: value,
                }));
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <Form.Item
            label={t("table.webhook_url_optional")}
            name="webhook_url_optional"
          >
            <Input
              data-test-id="webhook_url_optional"
              size="large"
              name="webhook_url_optional"
              value={body?.webhook_url_optional}
              onChange={(e) => {
                setBody((state) => ({
                  ...state,
                  webhook_url_optional: e.target.value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  webhook_url_optional: e.target.value,
                }));
              }}
            />
          </Form.Item>
        </Col>
        <Row
          gutter={[8, 8]}
          align="bottom"
          style={{ display: "flex", alignItems: "flex-end", width: "100%" }}
        >
          <Col span={24}>
            <Divider orientation="left">
              <Typography.Title level={3}>FastPix</Typography.Title>
            </Divider>
          </Col>

          <Col xs={{ span: 24 }} md={{ span: 9 }}>
            <Form.Item
              label={t("table.fastpix_webhook_url")}
              name="fastpix_webhook_url"
            >
              <Input
                data-test-id="fastpix_webhook_url"
                size="large"
                name="fastpix_webhook_url"
                value={body?.fastpix_webhook_url}
                onChange={(e) => {
                  setBody((state) => ({
                    ...state,
                    fastpix_webhook_url: e.target.value,
                  }));
                  setBodyUpdate((state) => ({
                    ...state,
                    fastpix_webhook_url: e.target.value,
                  }));
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 9 }}>
            <Form.Item
              label={t("table.fastpix_redirect_url")}
              name="fastpix_redirect_url"
            >
              <Input
                data-test-id="fastpix_redirect_url"
                size="large"
                name="fastpix_redirect_url"
                value={body?.fastpix_redirect_url}
                onChange={(e) => {
                  setBody((state) => ({
                    ...state,
                    fastpix_redirect_url: e.target.value,
                  }));
                  setBodyUpdate((state) => ({
                    ...state,
                    fastpix_redirect_url: e.target.value,
                  }));
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 6 }}>
            <Form.Item
              label={t("table.fastpix_token_time")}
              name="fastpix_token_time"
            >
              <InputNumber
                data-test-id="fastpix_token_time"
                style={{ width: "100%" }}
                size="large"
                name="fastpix_token_time"
                value={body?.fastpix_token_time}
                onChange={(value) => {
                  setBody((state) => ({
                    ...state,
                    fastpix_token_time: value ?? 0,
                  }));
                  setBodyUpdate((state) => ({
                    ...state,
                    fastpix_token_time: value ?? 0,
                  }));
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isMerchantLogosFetching && (
          <Row
            style={{
              width: "100%",
              marginTop: -24,
              padding: 8,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Col span={"auto"}>
              <Typography.Title level={5}>Logos</Typography.Title>
              <Upload
                data-test-id="upload_logo"
                listType="picture-card"
                onPreview={handlePreview}
                {...{
                  beforeUpload: (file) => {
                    setFastPixLogoBody({ base64_file: "", logo_name: "" });
                    setFastPixLogoBody((state: any) => ({
                      ...state,
                      logo_name: file.name,
                    }));
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      setFastPixLogoBody((state: any) => ({
                        ...state,
                        base64_file: reader.result,
                      }));
                    };
                    return false;
                  },
                  defaultFileList: isMerchantLogosFetching
                    ? []
                    : merchantLogosData?.items?.map((logo) => {
                        return {
                          uid: logo?._id ?? "",
                          name: logo?.file_name ?? "",
                          url: logo?.file_url ?? "",
                        };
                      }),

                  showUploadList: {
                    showDownloadIcon: true,
                    showPreviewIcon: true,
                    downloadIcon: "Download",
                    showRemoveIcon: true,
                    removeIcon: (file) => (
                      <DeleteOutlined
                        style={{ color: defaultTheme.colors.error }}
                        onClick={() => setFastPixLogoToDelete(file.uid)}
                      />
                    ),
                    previewIcon: <EyeOutlined style={{ color: "#fff" }} />,
                  },
                }}
                style={{ width: "100%" }}
              >
                <Button icon={<UploadOutlined />} style={{ height: "100%" }}>
                  Upload
                </Button>
              </Upload>
            </Col>

            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Form.Item label={t("input.active_logo")}>
                <Select
                  data-test-id="active_logo"
                  loading={isMerchantLogosFetching}
                  style={{ width: "100%" }}
                  value={
                    merchantLogosData?.items?.find((logo) => logo.active)?._id
                  }
                  onChange={(value) => {
                    setFastPixLogoToActivate(value);
                  }}
                  options={merchantLogosData?.items?.map((logo) => {
                    return {
                      label: (
                        <>
                          <Avatar shape="square" src={logo?.file_url} />{" "}
                          {logo?.file_name}
                        </>
                      ),
                      value: logo?._id ?? "",
                    };
                  })}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <div
            style={{
              backgroundColor: theme === "light" ? "#d1d1d1" : undefined,
              borderRadius: "8px",
            }}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </div>
        </Modal>
      </Row>
      <Grid
        item
        container
        xs={12}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4} lg={2}>
          <button
            data-test-id="submit"
            type="submit"
            ref={submitRef}
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
              itens: t("menus.general_configs").toLowerCase(),
            })}
            open={isConfirmOpen}
            style={{ maxWidth: "340px" }}
            onConfirm={() => submitRef.current?.click()}
            okButtonProps={{ loading: isMerchantConfigFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantConfigFetching}
              onClick={() => setIsConfirmOpen(true)}
            >
              {t("buttons.update", { menu: "configs" })}
            </Button>
          </Popconfirm>
        </Grid>
      </Grid>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={CreateLogoError}
        success={CreateLogoIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeletePixLogoError}
        success={DeletePixLogoIsSuccess}
      />
    </Form>
  );
};
