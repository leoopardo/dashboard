/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleOutlined } from "@ant-design/icons";
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
import useDebounce from "@src/utils/useDebounce";
import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const InvalidPixKeyBlacklist = () => {
  const INITIAL_QUERY: ThirdPartQuery = {
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<ThirdPartQuery>(INITIAL_QUERY);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<ThirdPartItem | null>(null);
  const debounceSearch = useDebounce(search);
  const { t } = useTranslation();
  const {
    InvalidPixKey,
    InvalidPixKeyError,
    isInvalidPixKeyFetching,
    refetchInvalidPixKey,
  } = useGetInvalidPixKey(query);

  const { CheckError, CheckIsSuccess, CheckMutate } = useCheckInvalidPixKey(
    currentItem?._id
  );

  useEffect(() => {
    refetchInvalidPixKey();
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
          <Button
            style={{ width: "100%", height: 40 }}
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
            haveInitialDate
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
            placeholder="Opções"
            options={[{ value: "pix_key", label: t("table.pix_key") }]}
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
            loading={isInvalidPixKeyFetching}
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
            data={InvalidPixKey}
            items={InvalidPixKey?.items}
            error={InvalidPixKeyError}
            columns={[
              { name: "pix_key", type: "id" },
              { name: "pix_key_type", type: "text" },
              { name: "bank_name", type: "bankNameToIcon" },
              { name: "receiver_document", type: "document" },
              { name: "receiver_name", type: "text" },
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
            ]}
            label={["bank_name", "receiver_name", "pix_key"]}
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
    </Grid>
  );
};
