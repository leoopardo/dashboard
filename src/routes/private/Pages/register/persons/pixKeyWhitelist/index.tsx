/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EyeFilled } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useDeleteDeletePixKey } from "@src/services/register/persons/blacklist/deleteFile";
import { useGetPixKeyWhitelist } from "@src/services/register/persons/blacklist/getPixKeyWhitelist";
import { useCreatePixKeyWhitelistReports } from "@src/services/reports/register/persons/PixKeyWhitelist/createPixKeyWhitelistReports";
import {
  PixKeyWhitelistItem,
  PixKeyWhitelistQuery,
} from "@src/services/types/register/persons/blacklist/pixKeyWhitelist.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: PixKeyWhitelistQuery = {
  limit: 25,
  page: 1,
  sort_field: "createdAt",
  sort_order: "DESC",
};

export const PixKeyWhitelist = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const [query, setQuery] = useState<PixKeyWhitelistQuery>(INITIAL_QUERY);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    PixKeyWhitelistData,
    PixKeyWhitelistDataError,
    isPixKeyWhitelistDataFetching,
    refetchPixKeyWhitelistData,
  } = useGetPixKeyWhitelist(query);

  const {
    PixKeyWhitelistReportsError,
    PixKeyWhitelistReportsIsLoading,
    PixKeyWhitelistReportsIsSuccess,
    PixKeyWhitelistReportsMutate,
  } = useCreatePixKeyWhitelistReports(query);

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
    { name: "createdAt", type: "date", sort: true },
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
           <Button size="large"
            style={{ width: "100%" }}
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
        {permissions.register.person.pix_whitelist
          .person_pix_whitelist_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!PixKeyWhitelistData?.total || PixKeyWhitelistDataError}
              mutateReport={() => PixKeyWhitelistReportsMutate()}
              error={PixKeyWhitelistReportsError}
              success={PixKeyWhitelistReportsIsSuccess}
              loading={PixKeyWhitelistReportsIsLoading}
              reportPath="/register/person/person_reports/pix_whitelist_reports"
            />
          </Grid>
        )}
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
              permissions.register.person.pix_whitelist
                .person_pix_whitelist_delete && {
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
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            itemToAction={currentItem?.pix_key}
            onConfirmAction={() => DeletePixKeyMutate()}
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
          modalName={`${t("table.pix_key")}: ${currentItem?.pix_key}`}
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
