/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import {
  DeleteColumnOutlined,
  DeleteOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { useGetPixKeyWhitelist } from "@src/services/register/persons/blacklist/getPixKeyWhitelist";
import {
  PixKeyWhitelistItem,
  PixKeyWhitelistQuery,
} from "@src/services/types/register/persons/blacklist/pixKeyWhitelist.interface";
import { useDeleteDeletePixKey } from "@src/services/register/persons/blacklist/deleteFile";
import { Toast } from "@src/components/Toast";

const INITIAL_QUERY: PixKeyWhitelistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const PixKeyWhitelist = () => {
  const [query, setQuery] = useState<PixKeyWhitelistQuery>(INITIAL_QUERY);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    PixKeyWhitelistData,
    PixKeyWhitelistDataError,
    isPixKeyWhitelistDataFetching,
    refetchPixKeyWhitelistData,
  } = useGetPixKeyWhitelist(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<PixKeyWhitelistItem | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);

  const { DeletePixKeyError, DeletePixKeyIsSuccess, DeletePixKeyMutate } =
    useDeleteDeletePixKey({ pix_key: currentItem?.pix_key });

  const columns: ColumnInterface[] = [
    { name: "_id", type: "id" },
    { name: "pix_key", type: "text" },
    { name: "createdAt", type: "date" },
  ];

  useEffect(() => {
    refetchPixKeyWhitelistData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.pix_key;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, pix_key: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
            loading={isPixKeyWhitelistDataFetching}
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
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
            placeholder={t("table.pix_key") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isPixKeyWhitelistDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
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
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              {
                label: "delete",

                icon: <DeleteOutlined />,
                onClick() {
                  setIsConfirmOpen(true);
                },
              },
            ]}
            data={PixKeyWhitelistData}
            items={PixKeyWhitelistData?.items}
            error={PixKeyWhitelistDataError}
            columns={columns}
            loading={isPixKeyWhitelistDataFetching}
            label={["pix_key"]}
            Confirm={
              <Popconfirm
                title={t("messages.confirm_action_title", {
                  action: t("messages.delete"),
                })}
                description={t("messages.are_you_sure", {
                  action: t("messages.delete"),
                  itens: currentItem?.pix_key,
                })}
                open={isConfirmOpen}
                style={{ maxWidth: "340px" }}
                onConfirm={() => {
                  DeletePixKeyMutate();
                  setIsConfirmOpen(false);
                }}
                okText={t("messages.yes_delete")}
                cancelText={t("messages.no_cancel")}
                onCancel={() => setIsConfirmOpen(false)}
              />
            }
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          haveInitialDate
          filters={["start_date", "end_date"]}
          refetch={refetchPixKeyWhitelistData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isPixKeyWhitelistDataFetching}
          modalName={`${t("menus.pix_key")}: ${currentItem?.pix_key}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}

      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeletePixKeyError}
        success={DeletePixKeyIsSuccess}
      />
    </Grid>
  );
};
