/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeFilled,
  UserAddOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useGetPartnerUsers } from "@src/services/register/partner/users/getPartnerUsers";
import { useUpdatePartnerUser } from "@src/services/register/partner/users/updateUser";
import { useCreatePartnerUserReports } from "@src/services/reports/register/partner/createUserReports";
import { PartnerQuery } from "@src/services/types/register/partners/partners.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewUserInterface, NewUserModal } from "./components/newUserModal";

const INITIAL_QUERY: PartnerQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const PartnerUsers = () => {
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
    useGetPartnerUsers(query);
  const { updateSuccess, updateError, updateMutate, updateReset } =
    useUpdatePartnerUser({
      ...updateUserBody,
      validation_token: tokenState,
    });

  const {
    PartnerReportsError,
    PartnerReportsIsLoading,
    PartnerReportsIsSuccess,
    PartnerReportsMutate,
    PartnerReportsReset,
  } = useCreatePartnerUserReports(query);
  const [action, setAction] = useState<"create" | "update">("create");

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: ["permission_group", "name"], head: "group", type: "text" },
    { name: ["partner", "name"], head: "partner", type: "text" },
    { name: "last_signin_date", type: "date" },
    { name: "status", type: "status" },
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
        {permissions.register.partner.users.partner_user_create && (
          <Grid item xs={12} md={2} lg={2}>
            <Button
              type="primary"
              loading={isUsersDataFetching}
              onClick={() => {
                PartnerReportsReset();
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

        {permissions.register.partner.users.partner_user_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!UsersData?.total || UsersDataError}
              mutateReport={() => PartnerReportsMutate()}
              error={PartnerReportsError}
              success={PartnerReportsIsSuccess}
              loading={PartnerReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_merchants_reports"
            />
          </Grid>
        )}

        <Grid item xs={12} md="auto">
          <Button
            style={{
              width: "100%",
              height: 40,
            }}
            loading={isUsersDataFetching}
            shape="round"
            type="dashed"
            onClick={refetchUsersData}
          >
            {!isUsersDataFetching && <ReloadOutlined />}
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
              permissions.register.partner.users.partner_user_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  updateReset();
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
            label={["name", "username", "partner.name", "updated_at"]}
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
          setOpen={setIsNewUserModal}
          currentUser={currentItem}
          setCurrentUser={setCurrentItem}
          setUpdateBody={setUpdateUserBody}
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
      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isUsersDataFetching}
          modalName={`${t("modal.user")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
        />
      )}
    </Grid>
  );
};
