/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { MutateModal } from "@components/Modals/mutateGenericModal";
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useCreateIpConfig } from "@src/services/register/merchant/merchant/ipsConfig.tsx/createIpsConfig";
import { useDeleteIpConfig } from "@src/services/register/merchant/merchant/ipsConfig.tsx/deleteIpsConfig";
import { useGetIpsConfig } from "@src/services/register/merchant/merchant/ipsConfig.tsx/getIpsConfig";
import {
  MerchantIpsItem,
  MerchantIpsQuery,
} from "@src/services/types/register/merchants/merchantIpsConfig";
import useDebounce from "@utils/useDebounce";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const IpsConfigTab = (props: { id?: string }) => {
  const { t } = useTranslation();

  const INITIAL_QUERY: MerchantIpsQuery = {
    limit: 10,
    page: 1,
    merchant_id: Number(props?.id),
  };

  const [query, setQuery] = useState<MerchantIpsQuery>(INITIAL_QUERY);
  const [currentItem, setCurrentItem] = useState<MerchantIpsItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { ipsConfigData, ipsConfigError, isIpsConfigFetching } =
    useGetIpsConfig({ merchant_id: Number(props?.id), ...query });

  const {
    deleteIpsConfigError,
    deleteIpsConfigIsSuccess,
    deleteIpsConfigMutate,
  } = useDeleteIpConfig({ ...currentItem });

  const [createBody, setCreateBody] = useState<MerchantIpsItem | null>({
    ip: "",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    createIpsError,
    createIpsIsLoading,
    createIpsIsSuccess,
    createIpsMutate,
  } = useCreateIpConfig({
    merchant_id: Number(props?.id),
    ...createBody,
  });
  const [search] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [{ name: "ip", type: "text" }];

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
            loading={isIpsConfigFetching}
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
            {`${t("buttons.create")} Ip`}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={ipsConfigData}
            items={ipsConfigData?.items}
            error={ipsConfigError}
            columns={columns}
            loading={isIpsConfigFetching}
            label={["name", "username"]}
            actions={[
              {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "20px" }} />,
                onClick: () => setIsConfirmOpen(true),
              },
            ]}
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            itemToAction={currentItem?.ip}
            onConfirmAction={() => deleteIpsConfigMutate()}
          />
        </Grid>
      </Grid>

      {isCreateModalOpen && (
        <MutateModal
          type="create"
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          fields={[{ label: "ip", required: true }]}
          body={createBody}
          setBody={setCreateBody}
          modalName={`${t("buttons.create")} ${t("menus.merchant")}`}
          submit={() => createIpsMutate()}
          submitLoading={createIpsIsLoading}
          error={createIpsError}
          success={createIpsIsSuccess}
        />
      )}
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.deleted")}
        error={deleteIpsConfigError}
        success={deleteIpsConfigIsSuccess}
      />

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.created")}
        error={createIpsError}
        success={createIpsIsSuccess}
      />
    </Grid>
  );
};
