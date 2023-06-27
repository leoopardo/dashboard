/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { FiltersModal } from "@components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import useDebounce from "@utils/useDebounce";
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import {
  AggregatorItem,
  AggregatorQuery,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { useGetAggregators } from "@src/services/register/aggregator/getAggregators";
import { useCreateAggregator } from "@src/services/register/aggregator/createAggregator";
import { useUpdateAggregator } from "@src/services/register/aggregator/updateAggregator";

const INITIAL_QUERY: AggregatorQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Aggregators = () => {
  const [query, setQuery] = useState<AggregatorQuery>(INITIAL_QUERY);
  const { t } = useTranslation();

  const {
    AggregatorsData,
    AggregatorsDataError,
    isAggregatorsDataFetching,
    refetchAggregatorsData,
  } = useGetAggregators(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewCategorieModal, setIsNewCategorieModal] =
    useState<boolean>(false);
  const [isUpdateCategorieModalOpen, setIsUpdateCategorieModalOpen] =
    useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<AggregatorItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [createBody, setCreateBody] = useState<AggregatorItem>({
    name: "",
    cnpj: "",
    country: "",
    responsible_name: "",
  });
  const [updateBody, setUpdateBody] = useState<AggregatorItem>({
    ...currentItem,
    Aggregator_id: currentItem?.id,
  });

  const {
    AggregatorIsLoading,
    AggregatorMutate,
    AggregatorError,
    AggregatorIsSuccess,
  } = useCreateAggregator(createBody);

  const { UpdateError, UpdateIsLoading, UpdateMutate, UpdateIsSuccess } =
    useUpdateAggregator(updateBody);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "status", type: "status" },
    { name: "created_at", type: "date" },
  ];

  useEffect(() => {
    refetchAggregatorsData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      aggregator_id: currentItem?.id,
    });
  }, [currentItem]);

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
            loading={isAggregatorsDataFetching}
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
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isAggregatorsDataFetching}
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
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="primary"
            loading={isAggregatorsDataFetching}
            onClick={() => {
              setIsNewCategorieModal(true);
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
            {`${t("buttons.create")} ${t("buttons.new_aggregator")}`}
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
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
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsUpdateCategorieModalOpen(true);
                },
              },
            ]}
            data={AggregatorsData}
            items={AggregatorsData?.items}
            error={AggregatorsDataError}
            columns={columns}
            loading={isAggregatorsDataFetching}
            label={["name", "description"]}
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
          filters={["start_date", "end_date", "status"]}
          refetch={refetchAggregatorsData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isNewCategorieModal && (
        <MutateModal
          type="create"
          open={isNewCategorieModal}
          setOpen={setIsNewCategorieModal}
          fields={[
            { label: "name", required: true },
            { label: "cnpj", required: true },
            { label: "cellphone", required: false },
            { label: "email", required: false },
            { label: "country", required: true },
          ]}
          body={createBody}
          setBody={setCreateBody}
          modalName={t("modal.new_aggregator")}
          submit={AggregatorMutate}
          submitLoading={AggregatorIsLoading}
          error={AggregatorError}
          success={AggregatorIsSuccess}
        />
      )}
      {isUpdateCategorieModalOpen && (
        <MutateModal
          type="update"
          open={isUpdateCategorieModalOpen}
          setOpen={setIsUpdateCategorieModalOpen}
          fields={[
            { label: "name", required: false },
            { label: "cnpj", required: false },
            { label: "cellphone", required: false },
            { label: "email", required: false },
            { label: "country", required: false },
          ]}
          body={updateBody}
          setBody={setUpdateBody}
          modalName={t("modal.update_aggregator")}
          submit={UpdateMutate}
          submitLoading={UpdateIsLoading}
          error={UpdateError}
          success={UpdateIsSuccess}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isAggregatorsDataFetching}
          modalName={`${t("menus.aggregator")}: ${currentItem?.name}`}
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
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={AggregatorError}
        success={AggregatorIsSuccess}
      />
    </Grid>
  );
};
