/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { MerchantsItem } from "@services/types/register/merchants/merchantsRegister.interface";
import { CredentialQuery } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { Toast } from "@components/Toast";
import useDebounce from "@utils/useDebounce";
import { ValidateToken } from "@components/ValidateToken";
import { UserAddOutlined } from "@ant-design/icons";
import { EyeFilled, EditOutlined } from "@ant-design/icons";
import { ViewModal } from "@components/Modals/viewGenericModal";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { useGetCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/getCredentialsConfig";
import { useShowCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/showCredentialsConfig";
import { useUpdateCredentialConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/updateCredentialsConfig";
import { useCreateCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/createCredentialsConfig";
import { IBodyCredentialItem } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";

const INITIAL_QUERY: CredentialQuery = {
  limit: 25,
  page: 1,
  sort_order: "DESC",
};

export const CredentialConfigTab = (props: { id?: string }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<CredentialQuery>(INITIAL_QUERY);
  const {
    credentialConfigData,
    credentialConfigError,
    isCredentialConfigFetching,
    refetchCredentialConfigData,
  } = useGetCredentialsConfig({ merchant_id: Number(props?.id), ...query });

  const [isGetValidateTokenOpen, setIsGetValidateTokenOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MerchantsItem | null>(null);
  const [tokenState, setTokenState] = useState("");
  const [updateBody, setUpdateBody] = useState<IBodyCredentialItem | null>(
    null
  );
  const [createBody, setCreateBody] = useState<IBodyCredentialItem | null>({
    name: "",
    type: "",
  });
  const [isUpdateValidateTokenOpen, setIsUpdateValidateTokenOpen] =
    useState(false);

  const [isCreateValidateTokenOpen, setIsCreateValidateTokenOpen] =
    useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    isShowCredentialConfigFetching,
    showCredentialConfigData,
    showCredentialConfigError,
    refetchShowCredentialConfigData,
  } = useShowCredentialsConfig({
    api_credential_id: currentItem?.id,
    validation_token: tokenState,
  });

  const { UpdateError, UpdateIsLoading, UpdateIsSuccess, UpdateMutate } =
    useUpdateCredentialConfig({
      api_credential_id: currentItem?.id,
      validation_token: tokenState,
      ...updateBody,
    });

  const {
    CreateCredentialsError,
    CreateCredentialsIsLoading,
    CreateCredentialsIsSuccess,
    CreateCredentialsMutate,
  } = useCreateCredentialsConfig({
    merchant_id: Number(props?.id),
    validation_token: tokenState,
    ...createBody,
  });
  const [search, setSearch] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "type", type: "text" },
    { name: "status", type: "status" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      merchant_id: currentItem?.id,
    });
  }, [currentItem]);
  
  useEffect(() => {
    if (showCredentialConfigError?.response?.status === 400) return;

    setIsGetValidateTokenOpen(false);
    showCredentialConfigData && setIsViewModalOpen(true);
  }, [showCredentialConfigData, showCredentialConfigError]);

  useEffect(() => {
    if (UpdateIsSuccess || CreateCredentialsIsSuccess) {
      refetchCredentialConfigData();
      setIsUpdateValidateTokenOpen(false);
    }

  }, [UpdateIsSuccess, CreateCredentialsIsSuccess]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    setQuery((state: any) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        justifyContent={"flex-end"}
        style={{ marginTop: "5px" }}
        spacing={1}
      >
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isCredentialConfigFetching}
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
            {`${t("buttons.create")} ${t("buttons.new_user")}`}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={credentialConfigData}
            items={credentialConfigData?.items}
            error={credentialConfigError}
            columns={columns}
            loading={isCredentialConfigFetching}
            label={["name", "username"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsGetValidateTokenOpen(true);
                },
              },
              {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setIsUpdateModalOpen(true),
              },
            ]}
          />
        </Grid>
      </Grid>

      {isUpdateModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "type", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.modal_update_merchant")}
          submit={() => setIsUpdateValidateTokenOpen(true)}
          submitLoading={UpdateIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}

      {isCreateModalOpen && (
        <MutateModal
          type="create"
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "type", required: false },
          ]}
          body={createBody}
          setBody={setCreateBody}
          modalName={t("modal.modal_update_merchant")}
          submit={() => setIsCreateValidateTokenOpen(true)}
          submitLoading={CreateCredentialsIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={showCredentialConfigData}
          loading={isShowCredentialConfigFetching}
          modalName={`${t("menus.merchant")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}

      {isUpdateValidateTokenOpen && (
        <ValidateToken
          open={isUpdateValidateTokenOpen}
          setIsOpen={setIsUpdateValidateTokenOpen}
          action="API_CREDENTIAL_UPDATE"
          setTokenState={setTokenState}
          tokenState={tokenState}
          error={CreateCredentialsError}
          success={CreateCredentialsIsSuccess}
          submit={() => {
            UpdateMutate();
          }}
        />
      )}

      {isCreateValidateTokenOpen && (
        <ValidateToken
          open={isCreateValidateTokenOpen}
          setIsOpen={setIsCreateValidateTokenOpen}
          action="API_CREDENTIAL_CREATE"
          setTokenState={setTokenState}
          tokenState={tokenState}
          error={CreateCredentialsError}
          success={CreateCredentialsIsSuccess}
          submit={() => {
            CreateCredentialsMutate();
          }}
        />
      )}

      {isGetValidateTokenOpen && (
        <ValidateToken
          open={isGetValidateTokenOpen}
          setIsOpen={setIsGetValidateTokenOpen}
          action="API_CREDENTIAL_GET"
          setTokenState={setTokenState}
          tokenState={tokenState}
          error={showCredentialConfigError}
          submit={() => {
            refetchShowCredentialConfigData();
          }}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateError}
        success={UpdateIsSuccess}
      />
    </Grid>
  );
};
