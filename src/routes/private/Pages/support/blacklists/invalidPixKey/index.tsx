/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Toast } from "@src/components/Toast";
import { useCheckInvalidPixKey } from "@src/services/support/blacklists/invalidPixKey/checkPixKey";
import { useGetInvalidPixKey } from "@src/services/support/blacklists/invalidPixKey/getInvalidPixKey";
import {
  ThirdPartItem,
  ThirdPartQuery,
} from "@src/services/types/support/blacklists/thirdPartKey.interface";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { queryClient } from "@src/services/queryClient";
import { useDeleteInvalidPixKey } from "@src/services/support/blacklists/invalidPixKey/deleteinvalidPixKey";

export const InvalidPixKeyBlacklist = () => {
  const { t } = useTranslation();
  const INITIAL_QUERY: ThirdPartQuery = {
    limit: 25,
    page: 1,
  };
  const { type } = queryClient.getQueryData("validate") as ValidateInterface;
  const [query, setQuery] = useState<ThirdPartQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ThirdPartItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const { deleteInvalidPixKeyError, deleteInvalidPixKeyMutate, deleteInvalidPixKeyIsSuccess } =
    useDeleteInvalidPixKey(currentItem?.pix_key);
  const {
    InvalidPixKey,
    InvalidPixKeyError,
    isInvalidPixKeyFetching,
    refetchInvalidPixKey,
  } = useGetInvalidPixKey(
    query,
    type === 2 || type === 1 || (type === 3 && search.length > 0)
  );

  const { CheckError, CheckIsSuccess, CheckMutate } = useCheckInvalidPixKey(
    currentItem?._id
  );

  useEffect(() => {
    refetchInvalidPixKey();
  }, [query]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isInvalidPixKeyFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Input.Search
            size="large"
            placeholder="Pesquisa"
            value={search}
            style={{ width: "100%" }}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            onSearch={(value) =>
              search
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? setQuery((state: any) => ({
                    ...state,
                    pix_key: value,
                  }))
                : setQuery((prevQuery) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { pix_key, ...updatedQuery } = prevQuery;
                    return updatedQuery;
                  })
            }
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isInvalidPixKeyFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            style={{
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
      </Grid>
      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={InvalidPixKey}
            items={InvalidPixKey?.items}
            error={InvalidPixKeyError}
            columns={[
              { name: "pix_key", type: "id" },
              { name: "last_check", type: "date" },
              { name: "status", type: "status" },
              { name: "createdAt", type: "date" },
            ]}
            loading={isInvalidPixKeyFetching}
            actions={[
              {
                label: "check",
                icon: <CheckCircleOutlined />,
                onClick() {
                  CheckMutate();
                },
              },
              (type === 1 || type === 2) && {
                label: "delete",
                icon: <DeleteOutlined style={{ fontSize: "18px" }} />,
                onClick: () => setConfirmDelete(true),
              },
            ]}
            isConfirmOpen={confirmDelete}
            setIsConfirmOpen={setConfirmDelete}
            itemToAction={currentItem?.pix_key}
            onConfirmAction={() => deleteInvalidPixKeyMutate()}
            label={["pix_key"]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date"]}
          refetch={refetchInvalidPixKey}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      <Toast
        actionSuccess={t("messages.checked")}
        actionError={t("messages.check")}
        error={CheckError}
        success={CheckIsSuccess}
      />

      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={deleteInvalidPixKeyError}
        success={deleteInvalidPixKeyIsSuccess}
      />
    </Grid>
  );
};
