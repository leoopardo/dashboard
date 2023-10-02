/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { useCreatePersonBlacklistReason } from "@src/services/register/persons/blacklist/createReason";
import { useDeletePersonReason } from "@src/services/register/persons/blacklist/deleteReason";
import { useGetPersonBlacklistReasons } from "@src/services/register/persons/blacklist/getPersonBlacklistReasons";
import {
  PersonBlacklistReasonsItem,
  PersonBlacklistReasonsQuery,
} from "@src/services/types/register/persons/blacklist/reasons.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: PersonBlacklistReasonsQuery = {
  limit: 25,
  page: 1,
};

export const PersonBlacklistReasons = () => {
  const [query, setQuery] =
    useState<PersonBlacklistReasonsQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const { reasonsIsFetching, reasonsData, reasonsError, refetchReasons } =
    useGetPersonBlacklistReasons(query);
  const [isCreateReasonOpen, setIsCreateReasonOpen] = useState(false);
  const [body, setBody] = useState<{ reason: string }>({
    reason: "",
  });
  const [currentItem, setCurrentItem] =
    useState<PersonBlacklistReasonsItem | null>(null);
  const { error, isLoading, isSuccess, mutate } =
    useCreatePersonBlacklistReason(body);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const {
    deletePersonReasonError,
    deletePersonReasonIsSuccess,
    deletePersonReasonMutate,
  } = useDeletePersonReason(currentItem?.id);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "reason", type: "text" },
    { name: "status", type: "status" },
    { name: "createdAt", type: "date" },
  ];

  useEffect(() => {
    refetchReasons();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.reason;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, reason: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={4}>
          <Input
            placeholder={`${t("table.reason")}`}
            size="large"
            style={{ width: "100%" }}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={reasonsIsFetching}
            danger
            onClick={() => {
              setQuery(() => ({
                ...INITIAL_QUERY,
              }));
              setSearch("");
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={reasonsIsFetching}
            onClick={() => setIsCreateReasonOpen(true)}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlusOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
            {t("buttons.new_reason")}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={reasonsData}
            items={reasonsData?.items}
            error={reasonsError}
            columns={columns}
            loading={reasonsIsFetching}
            label={["cpf", "merchant_name"]}
            actions={[
              {
                icon: <DeleteOutlined style={{ fontSize: 22 }} />,
                label: "delete",
                onClick: () => setIsDeleteOpen(true),
              },
            ]}
            isConfirmOpen={isDeleteOpen}
            setIsConfirmOpen={setIsDeleteOpen}
            itemToAction={currentItem?.reason}
            onConfirmAction={() => deletePersonReasonMutate()}
          />
        </Grid>
      </Grid>

      {isCreateReasonOpen && (
        <MutateModal
          type="create"
          open={isCreateReasonOpen}
          setOpen={setIsCreateReasonOpen}
          fields={[{ label: "person_reason", required: true }]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_reason")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
        />
      )}

      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionError={t("messages.delete").toLowerCase()}
        actionSuccess={t("messages.deleted")}
        error={deletePersonReasonError}
        success={deletePersonReasonIsSuccess}
      />
    </Grid>
  );
};
