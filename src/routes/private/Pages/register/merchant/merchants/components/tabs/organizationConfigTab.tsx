/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useOrganizationConfig } from "@src/services/register/merchant/merchant/organizationConfig.tsx/getMerchantConfig";
import { useUpdateOrganizationConfig } from "@src/services/register/merchant/merchant/organizationConfig.tsx/updateMerchantConfig";
import {
  IOrganizationConfigResponse,
  IOrganizationUpdateConfig,
} from "@src/services/types/register/merchants/organizationConfig.interface";
import { Button, Form, FormInstance, Popconfirm, Select, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const OrganizationConfigTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const {
    isOrganizationConfigFetching,
    organizationConfigData,
    refetchOrganizationConfigData,
  } = useOrganizationConfig(props?.id);
  const [body, setBody] = useState<
    IOrganizationConfigResponse | undefined | null
  >(null);
  const [bodyUpdate, setBodyUpdate] = useState<
    IOrganizationUpdateConfig | null | undefined
  >(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { UpdateIsSuccess, UpdateMutate, UpdateError } =
    useUpdateOrganizationConfig({
      merchant_id: Number(props?.id),
      ...bodyUpdate,
    });

  const sanitazerOrganizationConfig = (result: any) => {
    let helper;
    if (Array.isArray(result)) helper = result;
    else helper = [result];

    const newObj = helper.map((item) => {
      return {
        ...item,
        cpf_api_permission: item?.merchantConfig?.cpf_api_permission,
      };
    });

    delete result?.merchantConfig;

    return newObj[0];
  };

  const handleSubmit = () => {
    /*  const stopRequest = array.some((item) => {
      if(item.isUnlimited === false && body && body[item.props as keyof typeof body] === null ) {
        setIsConfirmOpen(false);
          return true
        } else return false
    })
  
    if(stopRequest) return; */

    UpdateMutate();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    refetchOrganizationConfigData();
  }, [UpdateIsSuccess]);

  useEffect(() => {
    formRef.current?.setFieldsValue(
      sanitazerOrganizationConfig(organizationConfigData)
    );
    setBody(sanitazerOrganizationConfig(organizationConfigData));
  }, [organizationConfigData]);
  console.log({ body });
  return (
    <Form
      ref={formRef}
      layout="vertical"
      onSubmitCapture={() => handleSubmit()}
      initialValues={organizationConfigData ? organizationConfigData : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <Form.Item
            label={t("input.check_cpf_permission")}
            name="cpf_api_permission"
          >
            <Select
              size="large"
              options={
                [true, false]?.map((item, index) => ({
                  key: index,
                  value: item,
                  label: `${t(`table.${item}`)}`,
                })) ?? []
              }
              value={body?.cpf_api_permission}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  cpf_api_permission: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  cpf_api_permission: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Form.Item label={t("table.status")} name="status">
            <Switch
              checked={body?.status}
              onChange={(value) => {
                setBody((state) => ({
                  ...state,
                  status: value,
                }));
                setBodyUpdate((state) => ({
                  ...state,
                  status: value,
                }));
              }}
            />
          </Form.Item>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={6}
        lg={6}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
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
            okButtonProps={{ loading: isOrganizationConfigFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isOrganizationConfigFetching}
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
    </Form>
  );
};
