/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateAggregator } from "@src/services/register/aggregator/createAggregator";
import { useGetAggregators } from "@src/services/register/aggregator/getAggregators";
import { useUpdateAggregator } from "@src/services/register/aggregator/updateAggregator";
import { useCreateAggregatorReports } from "@src/services/reports/register/aggregators/createAggregatorReports";
import {
  AggregatorItem,
  AggregatorQuery,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const INITIAL_QUERY: AggregatorQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const Aggregators = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<AggregatorQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    AggregatorsData,
    AggregatorsDataError,
    isAggregatorsDataFetching,
    refetchAggregatorsData,
  } = useGetAggregators(query);

  const {
    AggregatorReportsError,
    AggregatorReportsIsLoading,
    AggregatorReportsIsSuccess,
    AggregatorReportsMutate,
  } = useCreateAggregatorReports(query);

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
    AggregatorReset,
  } = useCreateAggregator(createBody);

  const {
    UpdateError,
    UpdateIsLoading,
    UpdateMutate,
    UpdateIsSuccess,
    UpdateReset,
  } = useUpdateAggregator(updateBody);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: "status", type: "status", sort: true },
    { name: "created_at", type: "date", sort: true },
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
            size="large"
            style={{ width: "100%" }}
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
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
            value={search}
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
        {permissions.register.aggregator.aggregator.aggregator_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isAggregatorsDataFetching}
              onClick={() => {
                AggregatorReset();
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
        )}
        {permissions.register.aggregator.aggregator.aggregator_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!AggregatorsData?.total || AggregatorsDataError}
              mutateReport={() => AggregatorReportsMutate()}
              error={AggregatorReportsError}
              success={AggregatorReportsIsSuccess}
              loading={AggregatorReportsIsLoading}
              reportPath="/register/aggregator/aggregator_reports/aggregator_aggregators_reports"
            />
          </Grid>
        )}
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
                onClick: (item) => {
                  navigate("details", { state: item });
                },
              },
              permissions.register.aggregator.aggregator.aggregator_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: (item) => {
                  UpdateReset();
                  navigate("update_aggregator", { state: item });
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
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={AggregatorError}
        success={AggregatorIsSuccess}
      />
    </Grid>
  );
};
