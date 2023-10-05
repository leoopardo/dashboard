/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { Grid } from "@mui/material";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateSelfExclusion } from "@src/services/register/aggregator/selfExclusion/createSelfExclusion";
import { useDeleteSelfExclusion } from "@src/services/register/aggregator/selfExclusion/deleteSelfExclusion";
import { useGetSelfExclusion } from "@src/services/register/aggregator/selfExclusion/getSelfExclusion";
import { useCreateSelfExclusionReports } from "@src/services/reports/register/aggregators/createSelfExclusionReports";
import {
  CreateSelfExclusion,
  SelfExclusionItem,
  SelfExclusionQuery,
} from "@src/services/types/register/aggregators/selfExclusion/getSelfExclusion";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_QUERY: SelfExclusionQuery = {
  limit: 25,
  page: 1,
};

export const AggregatorSelfExclusion = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<SelfExclusionQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    isSelfExclusionDataFetching,
    SelfExclusionData,
    SelfExclusionDataError,
    refetchSelfExclusionData,
  } = useGetSelfExclusion(query);

  const {
    SelfExclusionReportsError,
    SelfExclusionReportsIsLoading,
    SelfExclusionReportsIsSuccess,
    SelfExclusionReportsMutate,
  } = useCreateSelfExclusionReports(query);

  const [isCreateSelfExclusionOpen, setIsCreateSelfExclusionOpen] =
    useState(false);
  const initialBody = {
    document: "",
    start_date: moment(new Date())
      .startOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
    end_date: moment(new Date())
      .endOf("day")
      .add(3, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  };
  const [body, setBody] = useState<CreateSelfExclusion>(initialBody);
  const [currentItem, setCurrentItem] = useState<SelfExclusionItem | null>(
    null
  );
  const { error, isLoading, isSuccess, mutate } = useCreateSelfExclusion(body);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const {
    deleteSelfExclusionError,
    deleteSelfExclusionIsSuccess,
    deleteSelfExclusionMutate,
  } = useDeleteSelfExclusion(currentItem?._id);

  const columns: ColumnInterface[] = [
    { name: "document", type: "document" },
    { name: "merchant_name", type: "text" },
    { name: "organization_name", head: "organization", type: "text" },
    { name: "partner_name", type: "text" },
    { name: "aggregator_name", type: "text" },
    { name: "status", type: "status" },
    { name: "start_date", type: "date" },
    { name: "end_date", type: "date" },
    { name: "createdAt", type: "date" },
  ];

  useEffect(() => {
    refetchSelfExclusionData();
  }, [query]);

  useEffect(() => {
    setBody(initialBody);
  }, [isCreateSelfExclusionOpen]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isSelfExclusionDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        {permissions.register.aggregator.self_exclusion
          .aggregator_self_exclusion_create && (
          <Grid item xs={12} md={4} lg={2}>
            <Button
              size="large"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              loading={isSelfExclusionDataFetching}
              type="default"
              onClick={() => setIsCreateSelfExclusionOpen(true)}
            >
              <PlusOutlined style={{ fontSize: 20 }} />{" "}
              {t("buttons.create_self_exclusion")}
            </Button>
          </Grid>
        )}

        {permissions.register.aggregator.self_exclusion
          .aggregator_self_exclusion_export_csv && (
          <Grid item xs={12} md={1}>
            <ExportReportsModal
              disabled={!SelfExclusionData?.total || SelfExclusionDataError}
              mutateReport={() => SelfExclusionReportsMutate()}
              error={SelfExclusionReportsError}
              success={SelfExclusionReportsIsSuccess}
              loading={SelfExclusionReportsIsLoading}
              reportPath="/register/aggregator/aggregator_reports/self_exclusion_reports"
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
            data={SelfExclusionData}
            items={SelfExclusionData?.items}
            error={SelfExclusionDataError}
            columns={columns}
            loading={isSelfExclusionDataFetching}
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
            itemToAction={currentItem?.document}
            onConfirmAction={() => deleteSelfExclusionMutate()}
          />
        </Grid>
      </Grid>

      {isCreateSelfExclusionOpen && (
        <MutateModal
          type="update"
          open={isCreateSelfExclusionOpen}
          setOpen={setIsCreateSelfExclusionOpen}
          fields={[
            { label: "document", required: true },
            { label: "date", required: false },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("buttons.create_self_exclusion")}
          submit={mutate}
          submitLoading={isLoading}
          error={error}
          success={isSuccess}
          submitText={`${t("buttons.create")}`}
        />
      )}

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "merchant_id"]}
          refetch={refetchSelfExclusionData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
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
        error={deleteSelfExclusionError}
        success={deleteSelfExclusionIsSuccess}
      />
    </Grid>
  );
};
