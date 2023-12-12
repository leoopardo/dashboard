/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { Grid } from "@mui/material";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
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
import { Button, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
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
  const { error, isLoading, isSuccess, mutate, reset } = useCreateSelfExclusion(body);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const {
    deleteSelfExclusionError,
    deleteSelfExclusionIsSuccess,
    deleteSelfExclusionMutate,
  } = useDeleteSelfExclusion(currentItem?._id);

  useEffect(() => {
    refetchSelfExclusionData();
  }, [query]);

  useEffect(() => {
    setBody(initialBody);
  }, [isCreateSelfExclusionOpen]);

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refDoc = useRef(null);
  const refMerchant = useRef(null);
  const refOrganization = useRef(null);
  const refPartner = useRef(null);
  const refAggregator = useRef(null);
  const refStatus = useRef(null);
  const refStartDate = useRef(null);
  const refEndDate = useRef(null);
  const refCreatedAt = useRef(null);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: -20,
          marginBottom: 20,
        }}
      >
        <Tooltip title={t("buttons.help")}>
          <Button type="link" onClick={() => setIsTuorOpen((state) => !state)}>
            <InfoCircleOutlined />
          </Button>
        </Tooltip>
      </Grid>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={2} lg={2}>
          <Button
            ref={ref1}
            size="large"
            style={{ width: "100%" }}
            loading={isSelfExclusionDataFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
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
              ref={ref2}
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
              icon={<PlusOutlined style={{ fontSize: 20 }} />}
            >
              {t("buttons.create_self_exclusion")}
            </Button>
          </Grid>
        )}

        {permissions.register.aggregator.self_exclusion
          .aggregator_self_exclusion_export_csv && (
          <Grid item xs={12} md={1} ref={ref3}>
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
            columns={[
              { name: "document", type: "document", key: refDoc },
              { name: "merchant_name", type: "text", key: refMerchant },
              {
                name: "organization_name",
                head: "organization",
                type: "text",
                key: refOrganization,
              },
              { name: "partner_name", type: "text", key: refPartner },
              { name: "aggregator_name", type: "text", key: refAggregator },
              { name: "status", type: "status", key: refStatus },
              { name: "start_date", type: "date", key: refStartDate },
              { name: "end_date", type: "date", key: refEndDate },
              { name: "createdAt", type: "date", key: refCreatedAt },
            ]}
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
            { label: "document",head: "cpf", required: true },
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
          clear={reset}
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
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        createRegisterStep={
          permissions.register.aggregator.users.aggregator_user_create && {
            title: t("wiki.register_self_exclusion"),
            description: t("wiki.register_self_exclusion_descriptions"),
            target: () => ref2.current,
          }
        }
        exportCsvStep={
          permissions.register.aggregator.users.aggregator_user_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/aggregator/aggregator_reports/self_exclusion_reports"
                  target="_blank"
                >
                  {t("menus.aggregators")} | {t("menus.reports")} |{" "}
                  {t("menus.self_exclusion")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref3.current,
          }
        }
        steps={[
          {
            title: t("table.document"),
            description: t("wiki.document_description"),
            target: () => refDoc.current,
          },
          {
            title: t("table.merchant"),
            description: t("wiki.merchant_description"),
            target: () => refMerchant.current,
          },
          {
            title: t("table.organization"),
            description: t("wiki.organization_description"),
            target: () => refOrganization.current,
          },
          {
            title: t("table.partner"),
            description: t("wiki.partner_description"),
            target: () => refPartner.current,
          },
          {
            title: t("table.aggregator"),
            description: t("wiki.aggregator_description"),
            target: () => refAggregator.current,
          },
          {
            title: t("table.status"),
            description: t("wiki.status_description"),
            target: () => refStatus.current,
          },
          {
            title: t("table.start_date"),
            description: t("wiki.start_date_description"),
            target: () => refStartDate.current,
          },
          {
            title: t("table.end_date"),
            description: t("wiki.end_date_description"),
            target: () => refEndDate.current,
          },
          {
            title: t("table.createdAt"),
            description: t("wiki.created_at_description"),
            target: () => refCreatedAt.current,
          },
        ]}
        pageStep={{
          title: t("menus.self_exclusion"),
          description: t("wiki.self_exclusion_description"),
        }}
      />
    </Grid>
  );
};
