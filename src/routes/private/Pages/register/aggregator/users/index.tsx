/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useGetAggregatorUsers } from "@src/services/register/aggregator/users/getAggregatorUsers";
import { useUpdateAggregatorUser } from "@src/services/register/aggregator/users/updateUser";
import { useCreateAggregatorUsersReports } from "@src/services/reports/register/aggregators/createAggregatorUsersReports";
import { useGetAggregatorUserReportFields } from "@src/services/reports/register/aggregators/getUserReportFields";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewUserInterface, NewUserModal } from "./components/newUserModal";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";

const INITIAL_QUERY: PartnerQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const AggregatorUsers = () => {
  const { permissions, aggregator_id } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<PartnerQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewUserModal, setIsNewUserModal] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [updateUserBody, setUpdateUserBody] = useState<NewUserInterface | null>(
    null
  );
  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const [tokenState, setTokenState] = useState<string>("");
  const { UsersData, UsersDataError, isUsersDataFetching, refetchUsersData } =
    useGetAggregatorUsers(query);
  const { updateSuccess, updateError, updateMutate, updateReset } =
    useUpdateAggregatorUser({
      ...updateUserBody,
      validation_token: tokenState,
    });
  const [action, setAction] = useState<"create" | "update">("create");

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    AggregatorUsersReportsError,
    AggregatorUsersReportsIsLoading,
    AggregatorUsersReportsIsSuccess,
    AggregatorUsersReportsMutate,
  } = useCreateAggregatorUsersReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });
  const { fields } = useGetAggregatorUserReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const handleUpdateTokenValidate = () => {
    updateMutate();
  };

  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const refId = useRef(null);
  const refName = useRef(null);
  const refGroup = useRef(null);
  const refPartner = useRef(null);
  const refLast = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

  const filters = aggregator_id
    ? ["start_date", "end_date", "status"]
    : ["start_date", "end_date", "status", "aggregator_id"];

  useEffect(() => {
    refetchUsersData();
  }, [query]);

  useEffect(() => {
    if (!isViewModalOpen) {
      setCurrentItem(null);
    }
  }, [isViewModalOpen]);

  return (
    <Grid container style={{ padding: "25px" }}>
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
            loading={isUsersDataFetching}
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={1}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title={t("buttons.help")}>
            <Button
              type="link"
              onClick={() => setIsTuorOpen((state) => !state)}
            >
              <InfoCircleOutlined />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={5} lg={5} ref={ref2}>
          <Search query={query} setQuery={setQuery} searchOption="search" />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            ref={ref3}
            size="large"
            type="dashed"
            loading={isUsersDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            icon={<FilterAltOffOutlinedIcon />}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions?.register?.aggregator?.users?.aggregator_user_create && (
          <Grid item xs={12} md={2} lg={2}>
            <Button
              ref={ref4}
              type="primary"
              loading={isUsersDataFetching}
              onClick={() => {
                setAction("create");
                setIsNewUserModal(true);
              }}
              style={{
                height: 40,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={
                <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />
              }
            >
              {`${t("buttons.create")} ${t("buttons.new_user")}`}
            </Button>
          </Grid>
        )}
        {permissions?.register?.aggregator?.users?.aggregator_user_export_csv && (
          <Grid item xs={12} md="auto" ref={ref5}>
            <Tooltip
              placement="topRight"
              title={
                UsersData?.total === 0 || UsersDataError
                  ? t("messages.no_records_to_export")
                  : t("messages.export_csv")
              }
              arrow
            >
              <Button
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={isUsersDataFetching}
                disabled={UsersData?.total === 0 || UsersDataError}
                icon={<FileAddOutlined style={{ fontSize: 22 }} />}
              >
                CSV
              </Button>
            </Tooltip>
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
              permissions?.register?.aggregator?.users
                ?.aggregator_user_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  updateReset();
                  setAction("update");
                  setIsNewUserModal(true);
                },
              },
            ]}
            refetch={refetchUsersData}
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={[
              { name: "id", type: "id", sort: true, key: refId },
              { name: "name", type: "text", sort: true, key: refName },
              {
                name: ["permission_group", "name"],
                head: "group",
                type: "text",
                key: refGroup,
                sort: true,
                sort_name: "group_name",
              },
              {
                name: ["aggregator", "name"],
                head: "aggregator",
                type: "text",
                key: refPartner,
                sort: true,
                sort_name: "aggregator_name",
              },
              {
                name: "last_signin_date",
                type: "date",
                key: refLast,
                sort: true,
              },
              { name: "status", type: "status", key: refStatus, sort: true },
              {
                name: "created_at",
                type: "date",
                sort: true,
                key: refCreatedAt,
              },
            ]}
            loading={isUsersDataFetching}
            label={[
              "name",
              "aggregator.name",
              "permission_group.name",
              "updated_at",
            ]}
          />
        </Grid>
      </Grid>

      <FiltersModal
        open={isFiltersOpen}
        setOpen={setIsFiltersOpen}
        query={query}
        setQuery={setQuery}
        filters={filters}
        refetch={refetchUsersData}
        selectOptions={{}}
        startDateKeyName="start_date"
        endDateKeyName="end_date"
        initialQuery={INITIAL_QUERY}
      />

      <NewUserModal
        action={action}
        open={isNewUserModal}
        setOpen={setIsNewUserModal}
        currentUser={currentItem}
        setCurrentUser={setCurrentItem}
        setUpdateBody={setUpdateUserBody}
        setIsValidateTokenOpen={setIsValidateTokenOpen}
      />

      {isValidateTokenOpen && (
        <ValidateToken
          action="USER_UPDATE"
          body={updateUserBody}
          open={isValidateTokenOpen}
          setIsOpen={setIsValidateTokenOpen}
          setTokenState={setTokenState}
          tokenState={tokenState}
          success={updateSuccess}
          error={updateError}
          submit={handleUpdateTokenValidate}
        />
      )}
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateSuccess}
      />

      <ViewModal
        item={currentItem}
        loading={isUsersDataFetching}
        modalName={`${t("modal.user")}: ${currentItem?.name}`}
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
      />

      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        searchByNameStepRef={ref2}
        removeFiltersStepRef={ref3}
        createRegisterStep={
          permissions?.register?.aggregator?.users?.aggregator_user_create && {
            title: t("wiki.register_users"),
            description: t("wiki.register_aggregator_users_descriptions"),
            target: () => ref4.current,
          }
        }
        exportCsvStep={
          permissions?.register?.aggregator?.users?.aggregator_user_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/aggregator/aggregator_reports/aggregator_users_reports"
                  target="_blank"
                >
                  {t("menus.aggregators")} | {t("menus.reports")} |{" "}
                  {t("menus.aggregator_users")}
                </Typography.Link>
              </Typography>
            ),
            target: () => ref5.current,
          }
        }
        steps={[
          {
            title: t("table.id"),
            description: t("wiki.id_description"),
            target: () => refId.current,
          },
          {
            title: t("table.name"),
            description: t("wiki.aggregator_user_name_description"),
            target: () => refName.current,
          },
          {
            title: t("table.group"),
            description: t("wiki.aggregator_group_description"),
            target: () => refGroup.current,
          },
          {
            title: t("table.aggregator"),
            description: t("wiki.aggregator_description"),
            target: () => refPartner.current,
          },
          {
            title: t("table.last_signin_date"),
            description: t("wiki.last_signin_date_description"),
            target: () => refLast.current,
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
          title: t("menus.aggregator_users"),
          description: t("wiki.aggregator_users_description"),
        }}
      />
      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={UsersData?.total === 0 || UsersDataError}
        mutateReport={() => AggregatorUsersReportsMutate()}
        error={AggregatorUsersReportsError}
        success={AggregatorUsersReportsIsSuccess}
        loading={AggregatorUsersReportsIsLoading}
        reportPath="/register/aggregator/aggregator_reports/aggregator_users_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="AggregatorUsers"
      />
    </Grid>
  );
};
