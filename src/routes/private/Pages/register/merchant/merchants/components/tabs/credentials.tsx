/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined, EyeFilled, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { ViewModal } from "@components/Modals/viewGenericModal";
import { ValidateToken } from "@components/ValidateToken";
import { Grid } from "@mui/material";
import { MerchantsItem } from "@services/types/register/merchants/merchantsRegister.interface";
import { useCreateCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/createCredentialsConfig";
import { useGetCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/getCredentialsConfig";
import { useShowCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/showCredentialsConfig";
import { useUpdateCredentialConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/updateCredentialsConfig";
import {
  CredentialQuery,
  IBodyCredentialItem,
} from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import useDebounce from "@utils/useDebounce";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [createdCredential, setCreatedCredential] = useState<any>(null);

  const {
    isShowCredentialConfigFetching,
    showCredentialConfigData,
    showCredentialConfigError,
    showCredentialConfigisSuccess,
    refetchShowCredentialConfigData,
    remove,
  } = useShowCredentialsConfig({
    api_credential_id: currentItem?.id ?? createdCredential,
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
    CreateCredentialsIsReset,
    data,
  } = useCreateCredentialsConfig({
    merchant_id: Number(props?.id),
    validation_token: tokenState,
    ...createBody,
  });
  const [search] = useState<string>("");
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
    if (!CreateCredentialsIsSuccess) return;
    setCreatedCredential(data);
    setIsViewModalOpen(true);
  }, [CreateCredentialsIsSuccess]);

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

  useEffect(() => {
    if (!isViewModalOpen) {
      remove();
    }
  }, [isViewModalOpen]);

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
            data-test-id="create-credential-button"
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
            <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
            {`${t("buttons.create")} ${t(
              "menus.credentials"
            )?.toLocaleLowerCase()}`}
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
                id: "table-details-button",
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsGetValidateTokenOpen(true);
                },
              },
              {
                id: "table-edit-button",
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
          modalName={`${t("buttons.create")} ${t("menus.merchant")}`}
          submit={() => setIsCreateValidateTokenOpen(true)}
          submitLoading={CreateCredentialsIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={showCredentialConfigData ?? createdCredential}
          loading={isShowCredentialConfigFetching}
          modalName={`${t("menus.merchant")}: ${
            currentItem?.name || createdCredential?.name
          }`}
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
          resetFunction={CreateCredentialsIsReset}
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
          success={showCredentialConfigisSuccess}
          tokenState={tokenState}
          error={showCredentialConfigError}
          submit={() => refetchShowCredentialConfigData()}
        />
      )}
    </Grid>
  );
};
