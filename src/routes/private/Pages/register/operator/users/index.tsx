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
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { TuorComponent } from "@src/components/Tuor";
import { queryClient } from "@src/services/queryClient";
import { useCreateOperatorUser } from "@src/services/register/operator/users/createUser";
import { useGetOperatorUsers } from "@src/services/register/operator/users/getOperatorUsers";
import { useUpdateOperatorUser } from "@src/services/register/operator/users/updateUser";
import { useCreateOperatorUsersReports } from "@src/services/reports/register/operator/createOperatorUsersReports";
import { useGetOperatorUsersReportFields } from "@src/services/reports/register/operator/getOperatorUsersReportFields";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewUserInterface, NewUserModal } from "./components/newUserModal";

const INITIAL_QUERY: PartnerQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const OperatorUsers = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
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
    useGetOperatorUsers(query);
  const { updateSuccess, updateError, updateMutate } = useUpdateOperatorUser({
    ...updateUserBody,
    validation_token: tokenState,
  });
  const [bodyCreate, setBodyCreate] = useState<NewUserInterface>({
    name: "",
    username: "",
    group_id: 0,
    status: true,
    type: 2,
    cellphone: currentItem?.cellphone,
  });
  const { mutate, error, isSuccess } = useCreateOperatorUser({
    ...bodyCreate,
    operator_id:
      bodyCreate.operator_id || currentItem?.operator_id || user?.operator_id,
  });

  const [action, setAction] = useState<"create" | "update">("create");

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    OperatorUsersReportsError,
    OperatorUsersReportsIsLoading,
    OperatorUsersReportsIsSuccess,
    OperatorUsersReportsMutate,
  } = useCreateOperatorUsersReports({
    ...query,
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetOperatorUsersReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    refetchUsersData();
  }, [query]);

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
  const refOperator = useRef(null);
  const refLast = useRef(null);
  const refStatus = useRef(null);
  const refCreatedAt = useRef(null);

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
            onClick={() => setIsFiltersOpen(true)}
            icon={<FilterOutlined />}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <FilterChips
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
        <Grid item xs={12} md={4} lg={4} ref={ref2}>
          <Search query={query} setQuery={setQuery} searchOption="name" />
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
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<FilterAltOffOutlinedIcon />}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.register.operator.operator.operator_export_csv && (
          <Grid item xs={12} md={3} lg={2}>
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
              icon={<UserAddOutlined style={{ fontSize: 22 }} />}
            >
              {`${t("buttons.create")} ${t("buttons.new_user")}`}
            </Button>
          </Grid>
        )}

        {permissions.register.operator.users.operator_user_export_csv && (
          <Grid item xs={12} md="auto">
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
                ref={ref5}
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
              {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
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
                sort: true,
                sort_name: "group_name",
                key: refGroup,
              },
              {
                name: ["operator", "name"],
                head: "operator",
                type: "text",
                sort: true,
                sort_name: "operator_name",
                key: refOperator,
              },
              { name: "last_signin_date", type: "date", key: refLast },
              { name: "status", type: "status", sort: true, key: refStatus },
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
              "operator.name",
              "permission_group.name",
              "updated_at",
            ]}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "start_date",
            "end_date",
            "status",
            "partner_id",
            "merchant_id",
            "aggregator_id",
            "operator_id",
          ]}
          refetch={refetchUsersData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
      {isNewUserModal && (
        <NewUserModal
          action={action}
          open={isNewUserModal}
          setBody={setBodyCreate}
          setOpen={setIsNewUserModal}
          currentUser={currentItem}
          body={bodyCreate}
          setCurrentUser={setCurrentItem}
          setUpdateBody={setUpdateUserBody}
          fuctionMutate={mutate}
          setIsValidateTokenOpen={setIsValidateTokenOpen}
        />
      )}
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

      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        error={error}
        success={isSuccess}
      />

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isUsersDataFetching}
          modalName={`${t("modal.user")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
      <ExportCustomReportsModal
        open={isExportReportsOpen}
        setOpen={setIsExportReportsOpen}
        disabled={UsersData?.total === 0 || UsersDataError}
        mutateReport={() => OperatorUsersReportsMutate()}
        error={OperatorUsersReportsError}
        success={OperatorUsersReportsIsSuccess}
        loading={OperatorUsersReportsIsLoading}
        reportPath="/register/operator/operator_reports/operator_users_reports"
        fields={fields}
        csvFields={csvFields}
        comma={comma}
        setIsComma={setIsComma}
        setCsvFields={setCsvFields}
        reportName="OperatorUsers"
      />
      <TuorComponent
        open={isTuorOpen}
        setOpen={setIsTuorOpen}
        searchFilterStepRef={ref1}
        searchByNameStepRef={ref2}
        removeFiltersStepRef={ref3}
        createRegisterStep={
          permissions.register.operator.operator.operator_create && {
            title: t("wiki.register_users"),
            description: t("wiki.register_users_descriptions"),
            target: () => ref4.current,
          }
        }
        exportCsvStep={
          permissions.register.operator.operator.operator_export_csv && {
            title: t("wiki.generate_reports"),
            description: (
              <Typography>
                {t("wiki.generate_reports_descriptions")}{" "}
                <Typography.Link
                  href="/register/operator/operator_reports/operator_users_reports"
                  target="_blank"
                >
                  {t("menus.operator")} | {t("menus.reports")} |{" "}
                  {t("menus.operator_users")}
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
            title: t("table.operator"),
            description: t("wiki.operator_description"),
            target: () => refOperator.current,
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
          title: t("menus.operator_users"),
          description: t("wiki.operator_users_description"),
        }}
      />
    </Grid>
  );
};
