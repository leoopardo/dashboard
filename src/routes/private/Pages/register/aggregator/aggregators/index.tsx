/* eslint-disable react-hooks/exhaustive-deps */
import {
  EditOutlined,
  EyeFilled,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
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
import { useGetAggregatorsTotals } from "@src/services/register/aggregator/getAggregatorsTotals";
import { useUpdateAggregator } from "@src/services/register/aggregator/updateAggregator";
import { useCreateAggregatorReports } from "@src/services/reports/register/aggregators/createAggregatorReports";
import {
  AggregatorItem,
  AggregatorQuery,
} from "@src/services/types/register/aggregators/aggregators.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Input, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TotalizersCards } from "./components/totalizersCards";
import { TuorComponent } from "@src/components/Tuor";
import { defaultTheme } from "@src/styles/defaultTheme";

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
    isSuccessAggregatorsData,
    refetchAggregatorsData,
  } = useGetAggregators(query);

  const {
    AggregatorsTotalsData,
    isAggregatorsTotalsDataFetching,
    isSuccessAggregatorsTotalsData,
    refetchAggregatorsTotalsData,
  } = useGetAggregatorsTotals(query);

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

  useEffect(() => {
    isSuccessAggregatorsTotalsData && refetchAggregatorsTotalsData();
    isSuccessAggregatorsData && refetchAggregatorsData();
  }, [query]);

  useEffect(() => {
    setUpdateBody({
      ...currentItem,
      aggregator_id: currentItem?.id,
    });
  }, [currentItem]);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        item
        xs={12}
        md={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Tooltip title="Ajuda">
          <Button type="link" onClick={() => setIsTuorOpen((state) => !state)}>
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid>
      <Grid item xs={12} ref={ref}>
        <TotalizersCards
          params={query}
          loading={isAggregatorsTotalsDataFetching}
          data={AggregatorsTotalsData || undefined}
        />
      </Grid>

      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            ref={ref1}
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
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Input.Search
            size="large"
            value={search}
            placeholder={t("table.name") || ""}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            onSearch={() => setQuery((state) => ({ ...state, name: search }))}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref3}
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
              ref={ref4}
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
          <Grid item xs={12} md="auto" ref={ref5}>
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
                  navigate("update", { state: item });
                },
              },
            ]}
            data={AggregatorsData}
            items={AggregatorsData?.items}
            error={AggregatorsDataError}
            columns={[
              { name: "id", type: "id", sort: true, key: refId },
              { name: "name", type: "text", sort: true, key: refName },
              { name: "status", type: "status", sort: true, key: refStatus },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
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
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        searchByNameStepRef={ref2}
        removeFiltersStepRef={ref3}
        createRegisterStep={
          permissions.register.paybrokers.release_category
            .paybrokers_release_category_create && {
            title: t("wiki.register_categories"),
            description: t("wiki.register_categories_description"),
            target: () => ref4.current,
          }
        }
        exportCsvStep={
          permissions.register.paybrokers.release_category
            .paybrokers_release_category_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/aggregator/aggregator_reports/aggregator_aggregators_reports"
                  target="_blank"
                >
                  {t("menus.aggregators")} | {t("menus.reports")} |{" "}
                  {t("menus.aggregators")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref5.current,
          }
        }
        steps={[
          {
            title: t("wiki.totalizers"),
            description: (
              <Typography>
                {t("wiki.totalizers_description")}
                <Typography>
                  <span style={{ color: defaultTheme.colors.info }}>
                    {t("titles.total_registred", {
                      entity: t("menus.aggregator")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_total")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.success }}>
                    {t("titles.total_registred_active", {
                      entity: t("menus.aggregator")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_active")}
                </Typography>
                <Typography>
                  <span style={{ color: defaultTheme.colors.waiting }}>
                    {t("titles.total_registred_inactive", {
                      entity: t("menus.aggregator")?.toLowerCase(),
                    })}
                    :
                  </span>
                  {t("wiki.entity_inactive")}
                </Typography>
              </Typography>
            ),
            target: () => ref.current,
          },

          {
            title: t("table.id"),
            description: t("wiki.id_description"),
            target: () => refId.current,
          },
          {
            title: t("table.name"),
            description: t("wiki.aggregator_name_description"),
            target: () => refName.current,
          },
          {
            title: t("table.status"),
            description: t("wiki.status_description"),
            target: () => refStatus.current,
          },

          {
            title: t("table.createdAt"),
            description: t("wiki.created_at_description"),
            target: () => refCreatedAt.current,
          },
        ]}
        pageStep={{
          title: t("menus.aggregators"),
          description: t("wiki.aggregators_description"),
        }}
      />
    </Grid>
  );
};
