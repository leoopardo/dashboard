import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { MerchantsItem } from "@services/types/register/merchants/merchantsRegister.interface";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { CredentialQuery } from "@src/services/types/register/merchants/merchantsCredentialsConfig.interface";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { Toast } from "@components/Toast";
import useDebounce from "@utils/useDebounce";
import { UserAddOutlined } from "@ant-design/icons";
import { EyeFilled, EditOutlined, ToolOutlined } from "@ant-design/icons";
import { ViewModal } from "@components/Modals/viewGenericModal";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { useUpdateMerchant } from "@services/register/merchant/merchant/updateMerchant";
import { useCredentialsConfig } from "@src/services/register/merchant/merchant/credentialsConfig.tsx/getCredentialsConfig";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: CredentialQuery = {
  limit: 25,
  page: 1,
  sort_order: "DESC",
};

export const CredentialConfigTab = (props: { id?: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<CredentialQuery>(INITIAL_QUERY);
  const {
    credentialConfigData,
    credentialConfigError,
    isCredentialConfigFetching,
    refetchCredentialConfigData,
  } = useCredentialsConfig({merchant_id: Number(props?.id), ...query});

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewMerchantModal, setIsNewMerchantModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MerchantsItem | null>(null);
  const [updateBody, setUpdateBody] = useState<MerchantsItem>({
    ...currentItem,
    merchant_id: currentItem?.id,
  });

  const { UpdateError, UpdateIsLoading, UpdateIsSuccess, UpdateMutate } =
    useUpdateMerchant(updateBody);
  const [search, setSearch] = useState<string>("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
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
    const id = currentItem?.id;
    isConfigOpen && navigate(`${id}`);
  }, [isConfigOpen]);

  useEffect(() => {
    refetchCredentialConfigData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      merchant_id: currentItem?.id,
    });
  }, [currentItem]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    setQuery((state: any) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container justifyContent={'flex-end'} style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isCredentialConfigFetching}
            onClick={() => {
              setIsNewMerchantModal(true);
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
                  setIsViewModalOpen(true);
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
          submit={UpdateMutate}
          submitLoading={UpdateIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isCredentialConfigFetching}
          modalName={`${t("menus.merchant")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
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
