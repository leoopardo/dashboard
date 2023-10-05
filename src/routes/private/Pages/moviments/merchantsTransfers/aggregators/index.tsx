/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, EyeFilled, UserAddOutlined } from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { FiltersModal } from "@components/FiltersModal";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { ValidateToken } from "@components/ValidateToken";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetRowsOrganizationUsers } from "@services/register/organization/users/getUsers";
import { useUpdateOrganizationUser } from "@services/register/organization/users/updateUser";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { ViewModal } from "@src/components/Modals/viewGenericModal";
import { queryClient } from "@src/services/queryClient";
import { useCreateOrganizationReports } from "@src/services/reports/register/organization/createUserReports";
import { OrganizationUserQuery } from "@src/services/types/register/organization/organizationUsers.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import useDebounce from "@utils/useDebounce";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "@src/components/Toast";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";

const INITIAL_QUERY: OrganizationUserQuery = {
  limit: 25,
  page: 1,
  sort_field: "created_at",
  sort_order: "DESC",
};

export const TransferToAggregators = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [query, setQuery] = useState<OrganizationUserQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const { UsersData, UsersDataError, isUsersDataFetching, refetchUsersData } =
    useGetRowsOrganizationUsers(query);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isNewUserModal, setIsNewUserModal] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search);
  const [transferBody, setTransferBody] = useState<any | null>(null);
  const [updateUserBody, setUpdateUserBody] = useState<any | null>(null);
  const [tokenState, setTokenState] = useState<string>("");
  const { updateSuccess, updateError, updateMutate, updateReset } =
    useUpdateOrganizationUser({
      ...updateUserBody,
      validation_token: tokenState,
    });
  const {
    OrganizationReportsError,
    OrganizationReportsIsLoading,
    OrganizationReportsIsSuccess,
    OrganizationReportsMutate,
  } = useCreateOrganizationReports(query);
  const [action, setAction] = useState<"create" | "update">("create");

  const columns: ColumnInterface[] = [
    { name: "id", type: "id", sort: true },
    { name: "name", type: "text", head: "merchant_origin", sort: true },
    { name: "name", type: "text", head: "account_origin", sort: true },
    { name: "name", type: "text", head: "merchant_destination", sort: true },
    { name: "name", type: "text", head: "account_destination", sort: true },
    { name: "name", type: "text", head: "user", sort: true },
    { name: "name", type: "text", head: "description", sort: true },
    { name: "name", type: "text", head: "value", sort: true },
    { name: "created_at", type: "date", sort: true },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    refetchUsersData();
  }, [query]);

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

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
            style={{ width: "100%", height: 40 }}
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
            loading={isUsersDataFetching}
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
        {permissions.register.paybrokers.users.paybrokers_user_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              loading={isUsersDataFetching}
              onClick={() => {
                setAction("create");
                setIsTransferModalOpen(true);
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
              {t("buttons.transfers")}
            </Button>
          </Grid>
        )}
        {permissions.register.paybrokers.users.paybrokers_user_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!UsersData?.total || UsersDataError}
              mutateReport={() => OrganizationReportsMutate()}
              error={OrganizationReportsError}
              success={OrganizationReportsIsSuccess}
              loading={OrganizationReportsIsLoading}
              reportPath="/register/organization/organization_reports/organization_reports_users"
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
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
            ]}
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={columns}
            loading={isUsersDataFetching}
            label={["name", "username"]}
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
            // "partner_id",
            // "merchant_id",
            // "aggregator_id",
            //"operator_id",
          ]}
          refetch={refetchUsersData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      {/*   {isValidateTokenOpen && (
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
      )} */}

      {isTransferModalOpen && (
        <MutateModal
          type="create"
          open={isTransferModalOpen}
          setOpen={setIsTransferModalOpen}
          fields={[
            { label: "merchant_id", required: true },
            { label: "merchant_id", required: true },
            { label: "merchant_id", required: true },
            { label: "merchant_id", required: true },
            { label: "value", required: true },
            { label: "description", required: true },
          ]}
          body={transferBody}
          setBody={setTransferBody}
          modalName={t("modal.new_aggregator")}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          submit={() => {}}
          submitLoading={false}
          error={null}
          success={false}
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