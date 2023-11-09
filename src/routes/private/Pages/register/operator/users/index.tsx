/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeFilled,
  FileAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportCustomReportsModal } from "@src/components/Modals/exportCustomReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useGetOperatorUsers } from "@src/services/register/operator/users/getOperatorUsers";
import { useUpdateOperatorUser } from "@src/services/register/operator/users/updateUser";
import { useCreateOperatorUsersReports } from "@src/services/reports/register/operator/createOperatorUsersReports";
import { useGetOperatorUsersReportFields } from "@src/services/reports/register/operator/getOperatorUsersReportFields";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewUserInterface, NewUserModal } from "./components/newUserModal";
import { useCreateOperatorUser } from "@src/services/register/operator/users/createUser";

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
    operator_id: currentItem?.operator_id,
    cellphone: currentItem?.cellphone,
  });
  const { mutate, error, isSuccess } = useCreateOperatorUser(bodyCreate);

  const [action, setAction] = useState<"create" | "update">("create");

  const [csvFields, setCsvFields] = useState<any>();
  const [comma, setIsComma] = useState<boolean>(false);
  const {
    OperatorUsersReportsError,
    OperatorUsersReportsIsLoading,
    OperatorUsersReportsIsSuccess,
    OperatorUsersReportsMutate,
  } = useCreateOperatorUsersReports({
    fields: csvFields,
    comma_separate_value: comma,
  });

  const { fields } = useGetOperatorUsersReportFields();
  const [isExportReportsOpen, setIsExportReportsOpen] =
    useState<boolean>(false);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    {
      name: ["permission_group", "name"],
      head: "group",
      type: "text",
      sort: true,
      sort_name: "group_name",
    },
    {
      name: ["operator", "name"],
      head: "operator",
      type: "text",
      sort: true,
      sort_name: "operator_name",
    },
    { name: "last_signin_date", type: "date" },
    { name: "status", type: "status", sort: true },
    { name: "created_at", type: "date", sort: true },
  ];

  useEffect(() => {
    refetchUsersData();
  }, [query]);

  const handleUpdateTokenValidate = () => {
    updateMutate();
  };
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
            loading={isUsersDataFetching}
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
          <Search query={query} setQuery={setQuery} searchOption="name" />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
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
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions.register.operator.operator.operator_export_csv && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
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
            >
              <UserAddOutlined style={{ marginRight: 10, fontSize: 22 }} />{" "}
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
                onClick={() => setIsExportReportsOpen(true)}
                style={{ width: "100%" }}
                shape="round"
                type="dashed"
                size="large"
                loading={isUsersDataFetching}
                disabled={UsersData?.total === 0 || UsersDataError}
              >
                <FileAddOutlined style={{ fontSize: 22 }} /> CSV
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
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={columns}
            loading={isUsersDataFetching}
            label={["name", "username", "operator.name", "updated_at"]}
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
    </Grid>
  );
};
