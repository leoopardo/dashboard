/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined, EyeFilled, UserAddOutlined, ReloadOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ViewModal } from "@components/Modals/viewGenericModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetRowsMerchantUsers } from "@services/register/merchant/users/getUsers";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { Toast } from "@src/components/Toast";
import { ValidateToken } from "@src/components/ValidateToken";
import { queryClient } from "@src/services/queryClient";
import { useUpdateMerchant } from "@src/services/register/merchant/users/updateMerhchant";
import { useCreateMerchantUsersReports } from "@src/services/reports/register/merchant/createMerchantUsersReports";
import {
  MerchantUserBodyItem,
  MerchantUsersItem,
  MerchantUsersQuery,
} from "@src/services/types/register/merchants/merchantUsers.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UpdateUserModal } from "./components/UpdateUserModal";

const INITIAL_QUERY: MerchantUsersQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const MerchantUser = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;

  const [query, setQuery] = useState<MerchantUsersQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const { UsersData, UsersDataError, isUsersDataFetching, refetchUsersData } =
    useGetRowsMerchantUsers(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"create" | "update">("create");
  const [tokenState, setTokenState] = useState<string>("");
  const [isValidateTokenOpen, setIsValidateTokenOpen] =
    useState<boolean>(false);
  const [updateUserBody, setUpdateUserBody] =
    useState<MerchantUserBodyItem | null>(null);
  const [currentItem, setCurrentItem] = useState<MerchantUsersItem | null>(
    null
  );
  const { updateError, updateIsSuccess, updateMutate, updateReset } =
    useUpdateMerchant({
      ...updateUserBody,
      validation_token: tokenState,
    });
  const {
    MerchantUsersReportsError,
    MerchantUsersReportsIsLoading,
    MerchantUsersReportsIsSuccess,
    MerchantUsersReportsMutate,
  } = useCreateMerchantUsersReports(query);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", sort: true },
    { name: ["merchant", "name"], head: "merchant", type: "text" },
    { name: ["permission_group", "name"], head: "group", type: "text" },
    { name: "last_signin_date", type: "date" },
    { name: "created_at", type: "date", sort: true },
  ];

  const handleUpdateTokenValidate = () => {
    updateMutate();
  };

  useEffect(() => {
    refetchUsersData();
  }, [query]);

  useEffect(() => {
    updateIsSuccess && setIsValidateTokenOpen(false);
  }, [updateIsSuccess]);

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
            type="dashed"
            loading={isUsersDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
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
        {permissions.register.merchant.users.merchant_user_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isUsersDataFetching}
              onClick={() => {
                setRequestType("create");
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
        {permissions.register.merchant.users.merchant_user_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!UsersData?.total || UsersDataError}
              mutateReport={() => MerchantUsersReportsMutate()}
              error={MerchantUsersReportsError}
              success={MerchantUsersReportsIsSuccess}
              loading={MerchantUsersReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_users_reports"
            />
          </Grid>
        )}

        <Grid
          container
          item
          xs={12}
          md="auto"
          lg={1}
          style={{ marginLeft: "auto" }}
        >
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
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={columns}
            loading={isUsersDataFetching}
            label={["name", "username", "merchant.name", "updated_at"]}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
              permissions.register.merchant.users.merchant_user_update && {
                label: "edit",
                icon: <EditOutlined style={{ fontSize: "20px" }} />,
                onClick: () => {
                  updateReset();
                  setRequestType("update");
                  setIsNewUserModal(true);
                },
              },
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
          ]}
          refetch={refetchUsersData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          item={currentItem}
          loading={isUsersDataFetching}
          modalName={`${t("login.user")}: ${currentItem?.name}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
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
          success={updateIsSuccess}
          error={updateError}
          submit={handleUpdateTokenValidate}
        />
      )}

      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={updateError}
        success={updateIsSuccess}
      />

      {isNewUserModal && (
        <UpdateUserModal
          action={requestType}
          open={isNewUserModal}
          setOpen={setIsNewUserModal}
          currentUser={currentItem}
          setCurrentUser={setCurrentItem}
          setUpdateBody={setUpdateUserBody}
          setIsValidateTokenOpen={setIsValidateTokenOpen}
        />
      )}
    </Grid>
  );
};
