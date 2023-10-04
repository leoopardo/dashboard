/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Toast } from "@src/components/Toast";
import { useDeleteThirdPartKey } from "@src/services/support/blacklists/thirdPartKey/deleteThirdPartKey";
import { useGetThirdPartKey } from "@src/services/support/blacklists/thirdPartKey/getThirdPartKey";
import {
  ThirdPartItem,
  ThirdPartQuery,
} from "@src/services/types/support/blacklists/thirdPartKey.interface";
import useDebounce from "@src/utils/useDebounce";
import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const ThirdPartKeyBlacklist = () => {
  const INITIAL_QUERY: ThirdPartQuery = {
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<ThirdPartQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<ThirdPartItem | null>(null);
  const debounceSearch = useDebounce(search);
  const { t } = useTranslation();
  const {
    ThirdPartKey,
    ThirdPartKeyError,
    isThirdPartKeyFetching,
    refetchThirdPartKey,
  } = useGetThirdPartKey(query);

  const { DeleteError, DeleteIsSuccess, DeleteMutate } = useDeleteThirdPartKey({
    id: currentItem?._id,
  });

  useEffect(() => {
    refetchThirdPartKey();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      return setQuery(q);
    }
    if (searchOption && search) {
      setQuery((state) => ({ ...state, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
           <Button size="large"
            style={{ width: "100%" }}
            loading={isThirdPartKeyFetching}
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
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              setSearchOption(value);
              setSearch("");
            }}
            value={searchOption}
            placeholder={t("input.options")}
            options={[
              { value: "pix_key", label: t("table.pix_key") },
              { value: "receiver_document", label: t("table.document") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            disabled={!searchOption}
            size="large"
            value={search}
            placeholder={searchOption ? t(`table.${searchOption}`) ?? "" : ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isThirdPartKeyFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearch("");
              setSearchOption(null);
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
            data={ThirdPartKey}
            items={ThirdPartKey?.items}
            error={ThirdPartKeyError}
            columns={[
              { name: "pix_key", type: "id" },
              { name: "pix_key_type", type: "text", sort: true },
              { name: "bank_name", type: "bankNameToIcon", sort: true },
              { name: "receiver_document", type: "document" },
              { name: "receiver_name", type: "text", sort: true },
              { name: "createdAt", type: "date", sort: true },
            ]}
            loading={isThirdPartKeyFetching}
            actions={[
              {
                label: "delete",
                icon: <DeleteOutlined />,
                onClick() {
                  setIsConfirmOpen(true);
                },
              },
            ]}
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            label={["bank_name", "receiver_name", "pix_key"]}
            itemToAction={currentItem?.bank_name}
            onConfirmAction={() => DeleteMutate()}
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
          refetch={refetchThirdPartKey}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteError}
        success={DeleteIsSuccess}
      />
    </Grid>
  );
};
