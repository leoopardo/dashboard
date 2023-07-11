import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button, Input } from "antd";
import { FilterChips } from "@components/FiltersModal/filterChips";
import { useTranslation } from "react-i18next";
import { useGetRowsMerchantUsers } from "@services/register/merchant/users/getUsers";
import { FiltersModal } from "@components/FiltersModal";
import { EditOutlined, EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import { ViewModal } from "@components/Modals/viewGenericModal";
import useDebounce from "@utils/useDebounce";
import { UserAddOutlined } from "@ant-design/icons";
import {
  MerchantUsersItem,
  MerchantUsersQuery,
  MerchantUserBodyItem,
} from "@src/services/types/register/merchants/merchantUsers.interface";
import { useUpdateMerchant } from "@src/services/register/merchant/users/updateMerhchant";
import { UpdateUserModal } from "./components/UpdateUserModal";
import { ValidateToken } from "@src/components/ValidateToken";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { useCreateMerchantUsersReports } from "@src/services/reports/register/merchant/createMerchantUsersReports";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

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
  const [search, setSearch] = useState<string>("");
  const {
    updateError,
    updateIsLoading,
    updateIsSuccess,
    updateMutate,
    updateReset,
  } = useUpdateMerchant({
    ...updateUserBody,
    validation_token: tokenState,
  });
  const {
    MerchantUsersReportsError,
    MerchantUsersReportsIsLoading,
    MerchantUsersReportsIsSuccess,
    MerchantUsersReportsMutate,
  } = useCreateMerchantUsersReports(query);
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "id", type: "id" },
    { name: "name", type: "text" },
    { name: "group_id", type: "text" },
    { name: "email", type: "text" },
    { name: "last_signin_date", type: "date" },
    { name: "created_at", type: "date" },
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

  useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.name;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, name: debounceSearch }));
  }, [debounceSearch]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
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
            startDateKeyName="initial_date"
            endDateKeyName="final_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={4} lg={4}>
          <Input
            size="large"
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
              mutateReport={() => MerchantUsersReportsMutate()}
              error={MerchantUsersReportsError}
              success={MerchantUsersReportsIsSuccess}
              loading={MerchantUsersReportsIsLoading}
              reportPath="/register/merchant/merchant_reports/merchant_users_reports"
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
            data={UsersData}
            items={UsersData?.items}
            error={UsersDataError}
            columns={columns}
            loading={isUsersDataFetching}
            label={["name", "username"]}
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
          haveInitialDate
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
          modalName={`${t("menus.merchant")}: ${currentItem?.name}`}
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
