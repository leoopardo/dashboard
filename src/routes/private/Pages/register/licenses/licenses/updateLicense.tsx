/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InboxOutlined } from "@ant-design/icons";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import "./styles.css";
import { Toast } from "@src/components/Toast";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { useGetLicensesAttachments } from "@src/services/register/licenses/getLicenseAttachments";
import {
  CreateLicenseFileInterface,
  useCreateLicenseAttachment,
} from "@src/services/register/licenses/uploadLicenseAttachment";
import { useDeleteLicenseAttachment } from "@src/services/register/licenses/deleteLicenseAttachment";
import { useShowLicenses } from "@src/services/register/licenses/showLicense";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  ConfigProvider,
  DatePicker,
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
import locale from "antd/locale/pt_BR";
import Dragger from "antd/es/upload/Dragger";
import { FormInstance } from "antd/lib/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { setFirstChildDivId } from "@src/utils/functions";
import {
  LicenseAttachmentItem,
  LicenseItem,
} from "@src/services/types/register/licenses/licenses.interface";
import { useGetRowsMerchantRegister } from "@src/services/register/merchant/merchant/getMerchants";
import dayjs from "dayjs";
import { MerchantsQuery } from "@src/services/types/register/merchants/merchantsRegister.interface";
import { useUpdateLicense } from "@src/services/register/licenses/updateLicense";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
const { RangePicker } = DatePicker;

export const UpdateLicense = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { t } = useTranslation();
  const location = useLocation();

  const tabindex0 = document.querySelector('[data-node-key="1"]');
  const tabindex1 = document.querySelector('[data-node-key="2"]');
  const tabindex2 = document.querySelector('[data-node-key="3"]');

  const [licenseBody, setLicenseBody] = useState<LicenseItem>({
    license_id: location?.state?.id,
  });

  const INITIAL_QUERY: MerchantsQuery = {
    license_id_list: location.state.id,
    limit: 10,
    page: 1,
    sort_field: "created_at",
    sort_order: "ASC",
  };

  const submitRef = useRef<HTMLButtonElement>(null);
  const { Countries } = useGetrefetchCountries();
  const formRef = useRef<FormInstance>(null);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdateLicense(licenseBody);
  const [merchantAttachedQuery, setMerchantAttachedQuery] =
    useState<MerchantsQuery>(INITIAL_QUERY);
  const [rangeDate, setRangeDate] = useState<any>([]);

  const [_currentResponsible, setCurrentMerchantAttached] =
    useState<LicenseAttachmentItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [fileBody, setFileBody] = useState<
    CreateLicenseFileInterface | undefined
  >({
    license_id: location.state.id,
  });
  const [deleteFileId, setDeleteFileId] = useState<string>("");

  const { ShowLicenseData } = useShowLicenses(location.state.id);

  const {
    MerchantData,
    isMerchantDataFetching,
    MerchantDataError,
    refetchMerchantData,
  } = useGetRowsMerchantRegister(merchantAttachedQuery);
  const { LicenseDataAttachments } = useGetLicensesAttachments({
    license_id: location.state?.id,
  });
  const {
    LicenseAttachmentError,
    LicenseAttachmentIsLoading,
    LicenseAttachmentIsSuccess,
    LicenseAttachmentMutate,
  } = useCreateLicenseAttachment(fileBody);

  const {
    DeleteLicenseAttachmentError,
    DeleteLicenseAttachmentIsSuccess,
    DeleteLicenseAttachmentMutate,
  } = useDeleteLicenseAttachment(deleteFileId);

  const handleChangeLicense = (event: any) => {
    setLicenseBody((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const removedDisplayNoneItems = (items: TabsProps["items"]) => {
    const currentItems = items?.filter(
      (item) => item?.style?.display !== "none"
    );

    return currentItems;
  };

  useEffect(() => {
    if (fileBody?.base64_file) {
      LicenseAttachmentMutate();
      setFileBody({ base64_file: "", file_name: "" });
    }
  }, [fileBody]);

  useEffect(() => {
    formRef.current?.setFieldsValue(ShowLicenseData);
    setRangeDate([
      ShowLicenseData?.start_validity_date
        ? dayjs(ShowLicenseData?.start_validity_date)
        : null,
      ShowLicenseData?.end_validity_date
        ? dayjs(ShowLicenseData?.end_validity_date)
        : null,
    ]);
  }, [location, ShowLicenseData]);

  useEffect(() => {
    if (deleteFileId) {
      DeleteLicenseAttachmentMutate();
      setDeleteFileId("");
    }
  }, [deleteFileId]);

  useEffect(() => {
    setFirstChildDivId(tabindex0, "tab-partner-data");
    setFirstChildDivId(tabindex1, "tab-responsibles");
    setFirstChildDivId(tabindex2, "tab-attachments");
  }, [tabindex0, tabindex1, tabindex2]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("table.license_data"),
      children: (
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={ShowLicenseData || {}}
          onFinish={() => UpdateMutate()}
        >
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <Col xs={{ span: 24 }} md={{ span: 10 }}>
              <Form.Item label={t("table.validity_date")} name="validity_date">
                <ConfigProvider locale={locale}>
                  <RangePicker
                    data-test-id="date-picker"
                    size="large"
                    style={{ width: "100%" }}
                    format={
                      navigator.language === "pt-BR"
                        ? "DD/MM/YYYY HH:mm"
                        : "YYYY/MM/DD HH:mm"
                    }
                    popupStyle={{ marginLeft: "40px" }}
                    showTime
                    value={rangeDate}
                    placeholder={[t("table.start_date"), t("table.end_date")]}
                    onChange={(value: any) => {
                      setRangeDate(value);
                      if (value) {
                        setLicenseBody((state: any) => ({
                          ...state,
                          start_validity_date: dayjs(value[0]?.$d).format(
                            "YYYY-MM-DDTHH:mm:ss.SSS"
                          ),
                          end_validity_date: dayjs(
                            dayjs(value[1]?.$d)
                              .format("YYYY-MM-DDTHH:mm:00.000")
                          ),
                        }));
                      } else {
                        setLicenseBody((state: any) => ({
                          ...state,
                          start_validity_date: null,
                          end_validity_date: null,
                        }));
                      }

                      formRef?.current?.validateFields();
                    }}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
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
                  value={licenseBody?.name}
                  onChange={handleChangeLicense}
                />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("input.license_number")}
                name="number"
                rules={[]}
              >
                <Input
                  name="number"
                  size="large"
                  value={licenseBody?.number}
                  onChange={handleChangeLicense}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <Col
              xs={{ span: 24 }}
              md={{ span: 6 }}
              style={{ marginRight: "auto" }}
            >
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
                  value={licenseBody?.country}
                  onChange={(value) =>
                    setLicenseBody((state) => ({ ...state, country: value }))
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Form.Item
                label={t("table.status")}
                name="status"
                valuePropName="checked"
              >
                <Switch
                  checked={licenseBody?.status}
                  onChange={(checked) => {
                    setLicenseBody((state) => ({
                      ...state,
                      status: checked,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={t("table.indeterminate_validity")}
                name="indeterminate_validity"
                valuePropName="checked"
              >
                <Switch
                  checked={licenseBody?.status}
                  onChange={(checked) => {
                    setLicenseBody((state) => ({
                      ...state,
                      indeterminate_validity: checked,
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
                {t("buttons.update")} {t("table.license")}
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
      label: `${t("table.document")}s`,
      style: {
        display: permissions.register.licenses.licenses.license_files_list
          ? undefined
          : "none",
      },
      children: LicenseAttachmentIsLoading ? (
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
              className={permissions.register.licenses.licenses.license_files_create ? "show" :"hide"}
              style={{ maxHeight: "150px" }}
              listType="picture"
              multiple={false}
              disabled={
                !permissions.register.licenses.licenses.license_files_create
              }
              onRemove={(file) => {
                setDeleteFileId(file?.uid);
              }}
              defaultFileList={LicenseDataAttachments?.items.map((file) => {
                return {
                  uid: file._id,
                  name: file.file_name,
                  url: file.file_url,
                };
              })}
              showUploadList={{
                showRemoveIcon:
                  permissions.register.licenses.licenses.license_files_delete,
              }}
              height={1000}
              beforeUpload={(file) => {
                setFileBody({
                  base64_file: "",
                  file_name: "",
                  license_id: location.state.id,
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

          {!LicenseDataAttachments?.total && !fileBody?.base64_file && (
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
    {
      key: "3",
      label: t("table.linked_merchants"),
      children: (
        <Row gutter={[8, 16]} style={{ width: "100%" }}>
          <Row style={{ width: "100%" }} gutter={[8, 2]} align="middle">
            <Col xs={{ span: 24 }} md={{ span: 4 }}>
              <Button
                size="large"
                style={{ width: "100%" }}
                loading={isMerchantDataFetching}
                type="primary"
                onClick={() => setIsFiltersOpen(true)}
              >
                {t("table.filters")}
              </Button>
            </Col>{" "}
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 15 }}>
              <FilterChips
                disabled={["license_id"]}
                startDateKeyName=""
                endDateKeyName=""
                query={merchantAttachedQuery}
                setQuery={setMerchantAttachedQuery}
              />
            </Col>
          </Row>

          <Col span={24}>
            <CustomTable
              query={merchantAttachedQuery}
              setCurrentItem={setCurrentMerchantAttached}
              setQuery={setMerchantAttachedQuery}
              actions={[]}
              disableActions
              data={MerchantData}
              items={MerchantData?.items}
              error={MerchantDataError}
              columns={[
                { name: "name", type: "text" },
                { name: "domain", type: "text" },
                { name: "status", type: "status" },
              ]}
              loading={isMerchantDataFetching}
              label={["name", "license"]}
            />
          </Col>

            <FiltersModal
              open={isFiltersOpen}
              setOpen={setIsFiltersOpen}
              query={merchantAttachedQuery}
              setQuery={setMerchantAttachedQuery}
              filters={["status"]}
              refetch={refetchMerchantData}
              selectOptions={{}}
              startDateKeyName=""
              endDateKeyName=""
              initialQuery={INITIAL_QUERY}
            />
          
        </Row>
      ),
    },
  ];
  return (
    <Row style={{ padding: 25 }}>
      <Col span={24}>
        <Typography.Title level={4}>
          {t("menus.licenses")}: {location.state.name}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Tabs
          defaultActiveKey="1"
          items={removedDisplayNoneItems(items)}
          data-test-id="tab"
        />
      </Col>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />

      <Toast
        actionSuccess={t("messages.uploaded")}
        actionError={t("messages.upload")}
        error={LicenseAttachmentError}
        success={LicenseAttachmentIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteLicenseAttachmentError}
        success={DeleteLicenseAttachmentIsSuccess}
      />
    </Row>
  );
};
